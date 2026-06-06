export function boardChannel(board_id) {
  return `board:${board_id}`;
}

export const presenceChannel = (boardId) => {
  return `presence:${boardId}`;
};
