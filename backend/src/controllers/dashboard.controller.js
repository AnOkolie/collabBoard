import { prisma } from "../db/prisma.js";
import { formatGetBoard } from "../transformers/boards.js";
import { formatAllFriendsResponse } from "../transformers/friends.js";
import { formatGetTasksResponse } from "../transformers/card.js";
export const getTasksCompletedWithinTheWeek = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const tasks = await prisma.cards.findMany({
      where: {
        assigned_user: {
          id: user_id,
        },
        updated_at: {
          gte: lastWeek,
        },
        state: "completed",
      },
    });
    return res
      .status(200)
      .json({ message: "Tasks completed this week", tasks });
  } catch (err) {
    console.error("Failed to get this weeks completed tasks", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCompletedTasks = async (req, res) => {
  const { user_id } = req.params;
  const { startDate, endDate } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const tasks = await prisma.cards.findMany({
      where: {
        assigned_user: {
          id: user_id,
        },
        updated_at: {
          gte: startDate,
          ...(endDate && { lte: endDate }),
        },
        state: "completed",
      },
    });
    const columnIds = tasks.map((card) => {
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

    const data = tasks.map((card) => {
      const boardId = boardMap.get(card.column_id);
      return {
        ...card,
        board_id: boardId.id,
        conversationId: boardId.conversations.id,
      };
    });
    return res.status(200).json({
      message: "Tasks completed this week",
      tasks: formatGetTasksResponse(data),
    });
  } catch (err) {
    console.error("Failed to get this weeks completed tasks", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getIncompleteTasks = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const tasks = await prisma.cards.findMany({
      where: {
        assigned_user: {
          id: user_id,
        },
        state: {
          notIn: ["Completed"],
        },
      },
      take: 7,
      orderBy: {
        due_date: "asc",
      },
    });
    const columnIds = tasks.map((card) => {
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

    const data = tasks.map((card) => {
      const boardId = boardMap.get(card.column_id);
      return {
        ...card,
        board_id: boardId.id,
        conversationId: boardId.conversations.id,
      };
    });
    return res.status(200).json({
      message: "Tasks left to complete",
      tasks: formatGetTasksResponse(data),
    });
  } catch (err) {
    console.error("Failed to get this weeks completed tasks", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  const { user_id } = req.params;
  const { startDate } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const boards = await prisma.boards.findMany({
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
    const friends = await prisma.users.findMany({
      where: {
        id: user_id,
      },
      include: {
        friendsInitiated: true,
        friendsReceived: true,
      },
    });
    const tasks = await prisma.cards.findMany({
      where: {
        assignee: user_id,
      },
    });
    return res.status(200).json({
      message: "Retrieved dashboard stats",
      boards: formatGetBoard(boards),
      friends: formatAllFriendsResponse(friends),
      tasks: formatGetTasksResponse(tasks),
    });
  } catch (err) {
    console.error("Failed to dashboard stats", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// export const compareProductivityThisWeek = async (req, res) => {
//   const { user_id } = req.params;
//   if (!user_id) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }
//   try {
//     const average = await prisma.boards.aggregate({
//       where: {
//         board_members: {
//           some: {
//             NOT: user_id,
//           },
//         },
//       },
//       _count: {

//       },
//     });
//   } catch (err) {
//     console.error("Failed to get this weeks completed tasks", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
