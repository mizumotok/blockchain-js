const MESSAGE_TYPES = {
  BLOCK_CHAIN: 'BLOCK_CHAIN',
  TRANSACTION: 'TRANSACTION',
  MINED: 'MINED',
};

type MessageData = {
  type: string,
  payload: any,
};

export default MESSAGE_TYPES;
export type { MessageData };
