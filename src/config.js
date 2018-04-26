const DIFFICULTY_TARGET = 240;
const MINING_DURATION = 5000;
const MINING_REWARD = 50;
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

module.exports = {
  DIFFICULTY_TARGET,
  MINING_DURATION,
  MINING_REWARD,
  HTTP_PORT,
  P2P_PORT,
  PEERS,
};
