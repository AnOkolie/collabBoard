import { prisma } from "../db/prisma.js";
import { formatDueDatesResponse } from "../transformers/calendar.js";

export const getTaskDetails = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const events = await prisma.boards.findMany({
      where: {
        board_members: {
          some: {
            user_id: {
              in: [user_id],
            },
          },
        },
      },
      select: {
        id: true,
        columns: {
          select: {
            cards: {
              select: {
                id: true,
                title: true,
                content: true,
                due_date: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ data: formatDueDatesResponse(events) });
  } catch (err) {
    console.log("error getting user events", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
