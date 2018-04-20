// @flow

import Block from './block';

class Blockchain {
  chain: Array<Block>;

  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(block: Block): bool {
    if (!this.canAddBlock(block)) {
      return false;
    }
    this.chain.push(block);
    return true;
  }

  canAddBlock(block: Block): bool {
    const lastBlock = this.chain[this.chain.length - 1];
    return block.prevHash === lastBlock.hash() &&
      block.timestamp > lastBlock.timestamp &&
      block.isValid();
  }

  lastHash(): string {
    return this.chain[this.chain.length - 1].hash();
  }
}

export default Blockchain;
