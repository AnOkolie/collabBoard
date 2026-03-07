import { pool } from "../utils/db.js";

export const addCards = async (req, res) => {
  const { content: content, title: title, board_id: boardId } = req.body;
  const { column_id: column_id } = req.params;
  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "INSERT INTO cards (content, column_id, title) VALUES ($1, $2, $3) RETURNING *",
      [content, column_id, title],
    );
    await updateBoardProgress(boardId);

    res.json({ message: "Card added successfully", card: result.rows[0] });
    await pool.query("COMMIT");
  } catch (error) {
    console.error("Error adding card:", error);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCards = async (req, res) => {
  const { id: cardId } = req.params;
  const { content, column_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cards SET content = $1, column_id = $2 WHERE id = $3 RETURNING *",
      [content, column_id, cardId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ message: "Card updated successfully", card: result.rows[0] });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ error: "Internal server error" });
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
    const { column_id: columnId, board_id: boardId } = req.body;
    console.log("Moving card with ID:", id, "to column ID:", columnId);
    await pool.query("BEGIN");
    await pool.query(
      "UPDATE cards SET column_id = $1, updated_at = NOW() WHERE id = $2",
      [columnId, id],
    );

    await updateBoardProgress(boardId);

    res.status(200).json({ message: "Card moved successfully" });
    await pool.query("COMMIT");
  } catch (error) {
    console.error("Error moving card:", error);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBoardProgress = async (boardId) => {
  try {
    const completedColumnId = await pool.query(
      "SELECT id from columns where title = 'Completed' and board_id = $1",
      [boardId],
    );
    if (completedColumnId.rows.length === 0) {
      console.log("No 'completed' column found for board ID:", boardId);
      return;
    }
    const completedCardsCountResult = await pool.query(
      "SELECT COUNT(*) FROM cards WHERE column_id = $1",
      [completedColumnId.rows[0].id],
    );
    const totalCardsCountResult = await pool.query(
      "SELECT COUNT(*) FROM cards c JOIN columns col ON c.column_id = col.id WHERE col.board_id = $1",
      [boardId],
    );
    const completedCardsCount = parseInt(
      completedCardsCountResult.rows[0].count,
      10,
    );
    const totalCardsCount = parseInt(totalCardsCountResult.rows[0].count, 10);
    const progress =
      totalCardsCount > 0 ? (completedCardsCount / totalCardsCount) * 100 : 0;
    console.log(`Updating board ID ${boardId} progress to ${progress}%`);
    await pool.query("UPDATE boards SET progress = $1 WHERE id = $2", [
      progress,
      boardId,
    ]);
  } catch (error) {
    console.error("Error updating board progress:", error);
  }
};
