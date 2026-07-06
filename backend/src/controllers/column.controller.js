import { pool } from "../db/db.js";
import { broadcastBoard } from "../websockets/boards.js";
import { prisma } from "../db/prisma.js";
import { formatGetColumns } from "../transformers/column.js";

export const addColumn = async (req, res) => {
  const { id: boardId } = req.params;
  const { title, userId } = req.body;

  if (!boardId || !title || !userId) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM boards WHERE id = $1)",
      [boardId],
    );
    if (!result.rows[0].exists) {
      return res.status(404).json({ error: "Board not found" });
    }
    const userRole = await pool.query(
      "SELECT role FROM board_members WHERE board_id = $1 and user_id = $2",
      [boardId, userId],
    );

    if (!userRole.rows[0].role) {
      return res
        .status(404)
        .json({ error: "This user is not a member of this board" });
    }
    if (userRole.rows[0].role === "member") {
      return res.status(404).json({
        error: "Only the board owner or admin can create a new column",
      });
    }
    const newColumn = await pool.query(
      "INSERT INTO columns (title, board_id) VALUES ($1, $2) RETURNING *",
      [title, boardId],
    );
    broadcastBoard(boardId, {
      type: "column:created",
      payload: newColumn.rows[0],
    });
    return res.json({
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
    broadcastBoard(boardId, {
      type: "column:deleted",
      payload: response.rows[0],
    });
    return res.json({
      message: "Column deleted successfully",
      column: response.rows[0],
    });
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const renameColumn = async (req, res) => {
  const { columnId } = req.params;
  const { new_name } = req.body;
  if (!columnId || !new_name) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    const response = await pool.query(
      "UPDATE columns SET title = $1 WHERE id = $2 RETURNING *",
      [new_name, columnId],
    );
    if (response.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "No columns found with the matching column id" });
    }
    broadcastBoard(boardId, {
      type: "column:created",
      payload: response.rows[0],
    });
    return res.status(200).json({
      message: "Column successfully updated",
      column: response.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
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
    const result = await prisma.columns.findMany({
      where: {
        board_id: board_id,
      },
      include: {
        cards: true,
      },
    });

    return res.json({
      message: "Columns retrieved successfully",
      columns: formatGetColumns(result),
    });
  } catch (error) {
    console.error("Error retrieving columns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
