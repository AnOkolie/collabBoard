import { pool } from "../utils/db.js";

export const addCards = async (req, res) => {
  const {
    content: content,
    position: position,
    column_id: column_id,
  } = req.body;
  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "INSERT INTO cards (content, position, column_id) VALUES ($1, $2, $3) RETURNING *",
      [content, position, column_id],
    );
    const updateProgress = await pool.query(
      "SELECT COUNT(*) as count, b.id FROM boards b JOIN columns c ON b.id = c.board_id JOIN cards cd ON c.id = cd.column_id WHERE cd.state = 'completed' GROUP BY b.id",
    );
    const totalCards = await pool.query(
      "SELECT COUNT(*) as count, b.id FROM boards b JOIN columns c ON b.id = c.board_id JOIN cards cd ON c.id = cd.column_id GROUP BY b.id",
    );
    const progressPercentage =
      totalCards.rows[0].count > 0
        ? (updateProgress.rows[0].count / totalCards.rows[0].count) * 100
        : 0;
    console.log("Progress percentage:", progressPercentage);
    const boardId = await pool.query(
      "SELECT board_id FROM columns WHERE id = $1",
      [column_id],
    );
    await pool.query("UPDATE boards SET progress = $1 WHERE id = $2", [
      progressPercentage,
      boardId.rows[0].board_id,
    ]);
    await pool.query("COMMIT");
    res.json({ message: "Card added successfully", card: result.rows[0] });
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCards = async (req, res) => {
  const { id: cardId } = req.params;
  const { content, position, column_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cards SET content = $1, position = $2, column_id = $3 WHERE id = $4 RETURNING *",
      [content, position, column_id, cardId],
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
