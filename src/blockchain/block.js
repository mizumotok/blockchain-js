// @flow

import SHA256 from 'crypto-js/sha256';
import Transaction from './transaction';
import { DIFFICULTY_TARGET, MINING_DURATION } from '../config';

class Block {
  timestamp: number;
  prevHash: string;
  difficultyTarget: number;
  nonce: number;
  transactions: Array<Transaction>;
  miningDuration: number;

  constructor(
    timestamp: number,
    prevHash: string,
    difficultyTarget: number,
    nonce: number,
    transactions: Array<Transaction>,
    miningDuration: number,
  ) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.difficultyTarget = difficultyTarget;
    this.nonce = nonce;
    this.transactions = transactions;
    this.miningDuration = miningDuration;
  }

  static genesis(): Block {
    return new this(0, '0'.repeat(64), DIFFICULTY_TARGET, 0, [], MINING_DURATION);
  }

  hash(): string {
    return SHA256(JSON.stringify([
      this.timestamp,
      this.prevHash,
      this.difficultyTarget,
      this.nonce,
      this.transactions,
      this.miningDuration,
    ])).toString();
  }

  isValid(): bool {
    const hash = this.hash();
    return Number(`0x${hash}`) < 2 ** this.difficultyTarget;
  }
}

export default Block;
