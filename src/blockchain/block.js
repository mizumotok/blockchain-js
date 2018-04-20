// @flow

import SHA256 from 'crypto-js/sha256';

const DIFFICULTY_TARGET = 255;

class Block {
  timestamp: number;
  prevHash: string;
  difficultyTarget: number;
  nonce: number;
  transactions: Array<any>;

  constructor(
    timestamp: number,
    prevHash: string,
    difficultyTarget: number,
    nonce: number,
    transactions: Array<any>,
  ) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.difficultyTarget = difficultyTarget;
    this.nonce = nonce;
    this.transactions = transactions;
  }

  static genesis(): Block {
    return new this(0, '0'.repeat(64), DIFFICULTY_TARGET, 0, []);
  }

  hash(): string {
    return SHA256(JSON.stringify([
      this.timestamp,
      this.prevHash,
      this.difficultyTarget,
      this.nonce,
      this.transactions,
    ])).toString();
  }

  isValid(): bool {
    const hash = this.hash();
    return Number(`0x${hash}`) < 2 ** this.difficultyTarget;
  }
}

export default Block;
