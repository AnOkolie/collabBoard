import { pool } from "../db/db.js";
import { broadcastBoard } from "../websockets/boards.js";
import { prisma } from "../db/prisma.js";
import { formatGetTasksResponse } from "../transformers/card.js";
export const addCards = async (req, res) => {
  const {
    content: content,
    title: title,
    board_id: boardId,
    due_date: due_date,
  } = req.body;
  const { column_id: column_id } = req.params;
  try {
    const addCard = await prisma.$transaction(async (tx) => {
      const card = await tx.cards.create({
        data: { content, column_id, title, due_date },
        select: {
          content: true,
          id: true,
          column_id: true,
          title: true,
          created_at: true,
          state: true,
          due_date: true,
        },
      });

      await tx.boards.update({
        where: { id: boardId },
        data: { updated_at: new Date() },
      });
      await updateBoardProgress(boardId, tx);
      return card;
    });
    const message = {
      type: "card:created",
      payload: {
        boardId: boardId,
        columnId: column_id,
        card: addCard,
      },
    };
    broadcastBoard(boardId, message);
    res.json({ message: "Card added successfully", card: addCard });
  } catch (error) {
    console.error("Error adding card:", error);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCards = async (card, board_id) => {
  if (!card || !board_id) return { error: "Misiing required fields" };
  const { id } = card;
  if (!id) return { error: "Misiing required fields" };
  try {
    const updatedCard = await prisma.cards.update({
      where: {
        id: id,
      },
      data: {
        updated_at: new Date(),
        content: card.content,
        state: card.state,
        title: card.title,
        ...(card.assignee !== "" && { assignee: card.assignee }),
      },
    });
    const members = await prisma.boards.findFirst({
      where: {
        id: board_id,
      },
      select: {
        board_members: true,
      },
    });
    if (!updatedCard) return { error: "Error updating card" };
    return { message: "Card updated", data: updatedCard, members };
  } catch (error) {
    console.error("Error updating card:", error);
    return { error: "Internal server error" };
  }
};

export const deleteCards = async (req, res) => {
  const { id: cardId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM cards WHERE id = $1 RETURNING *",
      [cardId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    const board = await pool.query(
      "SELECT board_id FROM columns where id = $1",
      [column_id],
    );
    const board_id = board.rows[0];
    const message = {
      type: "card:deleted",
      payload: {
        boardId: board_id,
        card: result.rows[0],
      },
    };
    broadcastBoard(board_id, message);
    res.json({ message: "Card deleted successfully", card: result.rows[0] });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCard = async (req, res) => {
  const { id: cardId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM cards WHERE id = $1", [
      cardId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ card: result.rows[0] });
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      column_id: columnId,
      board_id: boardId,
      user_id: userId,
    } = req.body;
    const move = await prisma.$transaction(async (tx) => {
      const fromColumn = await tx.cards.findFirst({
        where: {
          id: id,
        },
        select: {
          column_id: true,
        },
      });
      const newState = await tx.columns.findFirst({
        where: {
          id: columnId,
        },
        select: {
          title: true,
        },
      });
      await tx.cards.update({
        where: {
          id: id,
        },
        data: {
          column_id: columnId,
          updated_at: new Date(),
          state: newState.title,
        },
      });
      await updateBoardProgress(boardId, tx);
      const message = {
        type: "card:moved",
        payload: {
          userId: userId,
          boardId: boardId,
          cardId: id,
          fromColumnId: fromColumn.column_id,
          toColumnId: columnId,
        },
      };
      broadcastBoard(boardId, message);
      return res.status(200).json({ message: "Card moved successfully" });
    });
  } catch (error) {
    console.error("Error moving card:", error);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBoardProgress = async (boardId, tx) => {
  if (!boardId) return;
  try {
    const columns = await tx.columns.findMany({
      where: {
        board_id: boardId,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
      },
    });

    const completedCardsCount =
      columns.find((col) => col.title === "Completed")?._count.cards ?? 0;

    const totalCardsCount = columns.reduce(
      (sum, col) => sum + col._count.cards,
      0,
    );

    const progress =
      totalCardsCount > 0 ? (completedCardsCount / totalCardsCount) * 100 : 0;
    const updateProgress = await prisma.boards.update({
      where: {
        id: boardId,
      },
      data: {
        progress: progress,
      },
    });
    if (updateProgress) {
      broadcastBoard(
        boardId,
        JSON.stringify({
          type: "board:update",
          payload: updateProgress,
        }),
      );
    }
  } catch (error) {
    console.error("Error updating board progress:", error);
  }
};

export const getUpcomingTasks = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await prisma.cards.findMany({
      where: {
        assigned_user: {
          id: user_id,
        },
        state: {
          not: {
            equals: "Completed",
          },
        },
      },
      take: 5,
      orderBy: {
        due_date: "asc",
      },
    });
    const columnIds = result.map((card) => {
      return card.column_id;
    });
    const boards = await prisma.boards.findMany({
      where: {
        columns: {
          some: {
            id: {
              in: columnIds,
            },
          },
        },
      },
      select: {
        id: true,
        columns: { select: { id: true } },
        conversations: { select: { id: true } },
      },
    });
    const boardMap = new Map();
    boards.map((b) => {
      b.columns.map((col) => {
        boardMap.set(col.id, b);
      });
      return;
    });

    const data = result.map((card) => {
      const boardId = boardMap.get(card.column_id);
      return {
        ...card,
        board_id: boardId.id,
        conversationId: boardId.conversations.id,
      };
    });
    return res
      .status(200)
      .json({ message: "Tasks retrieved", data: formatGetTasksResponse(data) });
  } catch (err) {
    console.error("error getting upcoming tasks", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
