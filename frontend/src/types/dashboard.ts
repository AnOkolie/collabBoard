import { BoardType } from "./boards";
import { tasks } from "./cards";
import { CardType } from "./columns";
import { allFriends } from "./friends";

export type dashboardStats = {
  tasks: CardType[];
  friends: allFriends[];
  boards: BoardType[];
};

export type LoaderData = {
  stats: {
    data: {
      stats: Record<string, number>;
    };
  };
  completeTasks: {
    tasks: tasks[];
  };
  inCompleteTasks: {
    tasks: tasks[];
  };
  dashboardStats: dashboardStats;
};
