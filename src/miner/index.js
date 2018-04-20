// @flow

import Blockchain, { Block } from '../blockchain';

class Miner {
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
  }

  mine() {
    const prevHash = this.blockchain.lastHash();
    const target = 250;

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
      );
    } while (!block.isValid());

    this.blockchain.addBlock(block);
  }
}

export default Miner;
