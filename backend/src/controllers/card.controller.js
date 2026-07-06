import { pool } from "../db/db.js";
import { broadcastBoard } from "../websockets/boards.js";
import { prisma } from "../db/prisma.js";
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

      return card;
    });
    await updateBoardProgress(boardId);
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

    await pool.query("BEGIN");
    const fromColumn = await pool.query(
      "SELECT column_id FROM cards where id = $1",
      [id],
    );
    await pool.query(
      "UPDATE cards SET column_id = $1, updated_at = NOW() WHERE id = $2",
      [columnId, id],
    );

    await updateBoardProgress(boardId);
    const fromColumnId = fromColumn.rows[0].column_id;
    const message = {
      type: "card:moved",
      payload: {
        userId: userId,
        boardId: boardId,
        cardId: id,
        fromColumnId: fromColumnId,
        toColumnId: columnId,
      },
    };
    broadcastBoard(boardId, message);
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
    const boardProgress = await pool.query(
      "UPDATE boards SET progress = $1 WHERE id = $2 RETURNING *",
      [progress, boardId],
    );
    if (boardProgress.rows.length > 0) {
      broadcastBoard(
        boardId,
        JSON.stringify({
          type: "board:update",
          payload: boardProgress.rows[0],
        }),
      );
    }
  } catch (error) {
    console.error("Error updating board progress:", error);
  }
};
