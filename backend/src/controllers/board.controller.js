import { pool } from "../db/db.js";
import { broadcastBoard } from "../websockets/boards.js";
import { prisma } from "../db/prisma.js";
import { formatGetBoard } from "../transformers/boards.js";

export const getBoard = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "No user id given" });
  }
  try {
    const result = await prisma.boards.findMany({
      where: {
        board_members: {
          some: {
            user_id: {
              in: [user_id],
            },
          },
        },
      },
      include: {
        conversations: true,
        board_members: true,
      },
    });

    if (!result) {
      return res.status(200).json({ message: "No boards found for this user" });
    }

    return res.status(200).json({
      message: "Board retrieved successfully",
      board: formatGetBoard(result),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addBoard = async (req, res) => {
  const { title } = req.body;
  const { user_id } = req.params;

  if (!title || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const boardCreation = await prisma.$transaction(async (tx) => {
      const board = await tx.boards.create({
        data: {
          title,
          user_id,
          owner_id: user_id,
        },
      });

      const defaults = ["To Do", "In Progress", "Completed"];

      await tx.columns.createMany({
        data: defaults.map((title) => ({
          board_id: board.id,
          title,
        })),
      });

      await tx.board_members.create({
        data: {
          board_id: board.id,
          user_id,
          role: "owner",
        },
      });

      await tx.conversations.create({
        data: {
          type: "group",
          name: title,
          created_by: user_id,
          group_id_key: board.id,
          conversation_members: {
            create: [
              {
                user_id,
                joined_at: new Date(),
                role: "owner",
              },
            ],
          },
        },
      });

      return tx.boards.findUnique({
        where: {
          id: board.id,
        },
        include: {
          columns: true,
          board_members: true,
          conversations: true,
        },
      });
    });
    return res.status(201).json({
      message: "Board added successfully",
      board: boardCreation,
    });
  } catch (err) {
    console.error("Transaction failed:", err);
    return res.status(500).json({ error: "Failed to create board" });
  }
};

export const renameBoard = async (req, res) => {
  const { board_id } = req.params;
  const { newTitle } = req.body;

  if (!board_id || !newTitle) {
    return res
      .status(400)
      .json({ error: "Board ID and new title are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE boards SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [newTitle, board_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }
    broadcastBoard(board_id, { type: "board:update", payload: result.rows[0] });
    return res.status(200).json({
      message: "Board updated successfully",
      board: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating board:", err);
    return res.status(500).json({ error: "Failed to update board" });
  }
};

export const deleteBoard = async (req, res) => {
  const { board_id } = req.params;

  if (!board_id) {
    return res.status(400).json({ error: "Board ID is required" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM boards WHERE id = $1 RETURNING *",
      [board_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }
    broadcastBoard(board_id, {
      type: "board:deleted",
      payload: result.rows[0],
    });
    return res.status(200).json({
      message: "Board deleted successfully",
      board: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting board:", err);
    return res.status(500).json({ error: "Failed to delete board" });
  }
};

export const getAllBoardDetails = async (req, res) => {
  const { user_id: userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId field" });
  }

  const boardsMap = new Map();
  boardsMap.set("total", 0);

  try {
    const boardsResult = await pool.query(
      "SELECT id FROM boards WHERE user_id = $1",
      [userId],
    );

    for (let i = 0; i < boardsResult.rows.length; i++) {
      const boardId = boardsResult.rows[i].id;

      const allTasksResult = await pool.query(
        `
        SELECT COUNT(cards.id) AS count
        FROM columns
        LEFT JOIN cards ON columns.id = cards.column_id
        WHERE columns.board_id = $1
        `,
        [boardId],
      );

      const groupedTasksResult = await pool.query(
        `
        SELECT columns.title, COUNT(cards.id) AS count
        FROM columns
        LEFT JOIN cards ON columns.id = cards.column_id
        WHERE columns.board_id = $1
        GROUP BY columns.id, columns.title
        `,
        [boardId],
      );

      boardsMap.set(
        "total",
        boardsMap.get("total") + Number(allTasksResult.rows[0].count),
      );

      for (let j = 0; j < groupedTasksResult.rows.length; j++) {
        const title = groupedTasksResult.rows[j].title;
        const cardCount = Number(groupedTasksResult.rows[j].count);

        if (!boardsMap.has(title)) {
          boardsMap.set(title, cardCount);
        } else {
          boardsMap.set(title, boardsMap.get(title) + cardCount);
        }
      }
    }

    return res.status(200).json({
      message: "All boards history",
      data: Object.fromEntries(boardsMap),
    });
  } catch (error) {
    console.error("Error fetching board details:", error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const getBoardMembers = async (req, res) => {
  const { board_id: boardId } = req.params;
  if (!boardId) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    const boardName = ("SELECT title FROM boards WHERE id = $1", [boardId]);
    const result = await pool.query(
      "SELECT u.id, u.email, u.profilepic, u.username, bm.role FROM board_members AS bm LEFT JOIN users AS u on bm.user_id = u.id WHERE bm.board_id = $1",
      [boardId],
    );
    if (result.rows.length === 0) {
      if (boardName) {
        return res
          .status(400)
          .json({ error: `No members for board ${boardName}` });
      }
      return res.status(400).json({ error: "No members for this board" });
    }

    return res
      .status(200)
      .json({ message: "Retrieved members for board", data: result.rows });
  } catch (error) {
    console.error("Error retrieving users for board", error);
    return res.status(500).json({ error: error });
  }
};

export const boardInvitation = async (host_id, attendee_id, board_id) => {
  if (!host_id || !attendee_id || !board_id) {
    return { error: "Required fields are missing" };
  }
  try {
    const board = await pool.query("SELECT title FROM boards where id = $1", [
      board_id,
    ]);
    if (board.rows.length === 0) {
      return { error: "This board doesnt exist" };
    }
    const result = await pool.query(
      "INSERT INTO board_invitations(board_id, invited_user_id, host_id, status) VALUES($1, $2, $3, 'pending') RETURNING *",
      [board_id, attendee_id, host_id],
    );
    if (result.rows.length === 0) {
      return { error: "Failed to send invite" };
    }
    const boardTitle = board.rows[0].title;
    return {
      message: "Invite sent",
      data: result.rows,
      title: boardTitle,
      alert: `You have received a board invite for ${boardTitle}`,
    };
  } catch (error) {
    if (error.code === "23505") {
      return {
        error:
          "A pending invitation has already been sent to this user for this board",
      };
    }
    console.error("Error updating board_invitation DB ", error);
    return { error: "Internal Server error" };
  }
};

export const updateBoardInviteState = async (
  board_id,
  user_id,
  host_id,
  state,
) => {
  if (!board_id || !user_id || !host_id || !state) {
    return { error: "Required fields are missing" };
  }

  try {
    const boardInviteResponse = await prisma.$transaction(async (tx) => {
      const invite = await tx.board_invitations.updateMany({
        where: {
          board_id,
          invited_user_id: user_id,
          host_id,
          status: "pending",
        },
        data: {
          status: state,
          responded_at: new Date(),
        },
      });

      if (invite.count === 0) {
        throw new Error("Failed to update invite status");
      }

      if (state === "accepted") {
        await tx.board_members.upsert({
          where: {
            board_id_user_id: {
              board_id,
              user_id,
            },
          },
          create: {
            board_id,
            user_id,
            role: "member",
          },
          update: {},
        });
        const conversationId = await tx.conversations.findUnique({
          where: {
            group_id_key: board_id,
          },
          select: {
            id: true,
          },
        });
        if (conversationId) {
          await tx.conversation_members.create({
            data: {
              conversation_id: conversationId.id,
              user_id: user_id,
              role: "member",
              joined_at: new Date(),
            },
          });
        }
      }
      const board = await tx.boards.findUnique({
        where: {
          id: board_id,
        },
        include: {
          board_members: {
            where: {
              user_id,
            },
            select: {
              role: true,
            },
          },
        },
      });

      return board;
    });

    // declined/cancelled -> no board membership to return
    return boardInviteResponse;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating board_invitation DB ", error);
    return { error: "Internal Server error" };
  }
};

export const fetchBoardInvites = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    const result = await pool.query(
      "SELECT b.title, bi.host_id, bi.board_id FROM board_invitations AS bi LEFT JOIN boards AS b on bi.board_id = b.id WHERE invited_user_id = $1 and status = 'pending'",
      [user_id],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "No invites found for this user" });
    }
    const invites = result.rows.map((invite) => ({
      ...invite,
      alert: `You have received a board invite for ${invite.title}`,
    }));

    return res.status(200).json({
      message: "Board invites retrieved",
      data: invites,
    });
  } catch (error) {
    console.error("error retrieving board invites", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBoardDetailsTwo = async (req, res) => {
  const { user_id: userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId field" });
  }

  const boardsMap = new Map();
  boardsMap.set("total", 0);

  try {
    const result = await prisma.boards.findMany({
      where: {
        OR: [
          {
            board_members: {
              some: {
                user_id: userId,
              },
            },
          },
          {
            user_id: userId,
          },
        ],
      },
      select: {
        columns: {
          select: {
            title: true,
            id: true,
            cards: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        title: true,
      },
    });
    const total = result.length;
    const boardStats = new Map();
    boardStats.set("total", total);
    for (const res of result) {
      const column = res.columns;
      for (const col of column) {
        if (!boardStats.has(col.title)) {
          boardStats.set(col.title, 0);
        }
        boardStats.set(col.title, boardStats.get(col.title) + col.cards.length);
      }
    }

    return res.status(200).json({
      message: "All boards history",
      data: {
        title: result.map((tit) => tit.title),
        columns: result.map((col) => col.columns),
        cards: result.map((col) => col.columns.map((card) => card.cards)),
        stats: Object.fromEntries(boardStats),
      },
    });
  } catch (error) {
    console.error("Error fetching board details:", error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
