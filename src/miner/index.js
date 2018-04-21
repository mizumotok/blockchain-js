// @flow

import Blockchain, { Block } from '../blockchain';

class Miner {
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
  }

  mine() {
    const miningStartTimestamp = new Date().getTime();
    const prevHash = this.blockchain.lastHash();
    const target = this.blockchain.nextDifficultyTarget();

    let nonce = 0;
    let block;
    let timestamp;

    do {
      timestamp = new Date().getTime();
      nonce += 1;
      block = new Block(
        timestamp,
        prevHash,
        target,
        nonce,
        [],
        timestamp - miningStartTimestamp,
      );
    } while (!block.isValid());

    this.blockchain.addBlock(block);
  }
}

export default Miner;
