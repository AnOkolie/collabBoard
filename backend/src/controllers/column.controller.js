import { pool } from "../utils/db.js";

export const addColumn = async (req, res) => {
  const { id: boardId } = req.params;
  const { title } = req.body;

  if (!boardId || !title) {
    return res.status(400).json({ error: "Board ID and title are required" });
  }
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM boards WHERE id = $1)",
      [boardId],
    );
    if (!result.rows[0].exists) {
      return res.status(404).json({ error: "Board not found" });
    }
    const newColumn = await pool.query(
      "INSERT INTO columns (title, board_id) VALUES ($1, $2) RETURNING *",
      [title, boardId],
    );
    res.json({
      message: "Column added successfully",
      column: newColumn.rows[0],
    });
  } catch (error) {
    console.error("Error adding column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteColumn = async (req, res) => {
  const { board_id: boardId, column_id: columnId } = req.params;
  if (!boardId || !columnId) {
    return res
      .status(400)
      .json({ error: "Board ID and Column ID are required" });
  }
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM boards WHERE id = $1)",
      [boardId],
    );
    if (!result.rows[0].exists) {
      return res.status(404).json({ error: "Board not found" });
    }
    const response = await pool.query(
      "DELETE FROM columns WHERE board_id = $1 AND id = $2 RETURNING *",
      [boardId, columnId],
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Column not found" });
    }
    res.json({
      message: "Column deleted successfully",
      column: response.rows[0],
    });
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBoardColumns = async (req, res) => {
  try {
    const { board_id } = req.params;

    if (!board_id) {
      return res.status(400).json({
        error: "board_id is required",
      });
    }
    const result = await pool.query(
      'SELECT * FROM "columns" WHERE board_id = $1',
      [board_id],
    );

    for (let i = 0; i < result.rows.length; i++) {
      const cardsResult = await pool.query(
        "SELECT * FROM cards WHERE column_id = $1",
        [result.rows[i].id],
      );
      result.rows[i].cards = cardsResult.rows;
    }

    return res.json({
      message: "Columns retrieved successfully",
      columns: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving columns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
