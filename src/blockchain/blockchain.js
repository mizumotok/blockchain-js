// @flow

import Block from './block';
import { MINING_DURATION } from '../config';

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

  nextDifficultyTarget(): number {
    return Blockchain.calcDifficultyTarget(this.chain);
  }

  static calcDifficultyTarget(chain: Array<Block>): number {
    const lastBlock = chain[chain.length - 1];
    if (lastBlock.miningDuration > MINING_DURATION * 1.2) {
      return lastBlock.difficultyTarget + 1;
    }
    if (lastBlock.miningDuration < MINING_DURATION * 0.8) {
      return lastBlock.difficultyTarget - 1;
    }
    return lastBlock.difficultyTarget;
  }

  static isValidChain(chain: Array<Block>) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    let prevBlock = null;
    return chain.every((block) => {
      if (!prevBlock) {
        prevBlock = block;
        return true;
      }
      if (!block.isValid()) {
        return false;
      }
      if (prevBlock.hash() !== block.prevHash) {
        return false;
      }
      prevBlock = block;
      return true;
    });
  }
}

export default Blockchain;
