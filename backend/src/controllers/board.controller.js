import { pool } from "../utils/db.js";

export const getBoard = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "No user id given" });
  }
  try {
    const result = await pool.query("SELECT * FROM boards where user_id = $1", [
      user_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No boards found for this user" });
    }

    return res.status(200).json({
      message: "Board retrieved successfully",
      board: result.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addBoard = async (req, res) => {
  const { title } = req.body;
  const { user_id } = req.params;
  console.log("userId", user_id);

  if (!title || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query("BEGIN");
    const boardResult = await pool.query(
      "INSERT INTO boards (title, user_id, created_at) VALUES ($1, $2, NOW()) RETURNING id",
      [title, user_id],
    );

    const board = boardResult.rows[0];
    const defaults = ["To Do", "In Progress", "Completed"];

    for (let i = 0; i < defaults.length; i++) {
      await pool.query(
        `INSERT INTO columns (board_id, title)
         VALUES ($1, $2)`,
        [board.id, defaults[i]],
      );
    }

    await pool.query("COMMIT");

    return res.status(201).json({
      message: "Board added successfully",
      board: board,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
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
      "UPDATE boards SET title = $1 WHERE id = $2 RETURNING *",
      [newTitle, board_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Board not found" });
    }

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
  console.log("boardId", board_id);

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
