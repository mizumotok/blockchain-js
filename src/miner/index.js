// @flow

import Blockchain, { Block, Transaction } from '../blockchain';
import Router from '../router';

class Miner {
  transactionPool: Array<Transaction>;
  blockchain: Blockchain;
  rewardAddress: string;
  router: Router;

  constructor(blockchain: Blockchain, rewardAddress: string, router: Router) {
    this.transactionPool = [];
    this.blockchain = blockchain;
    this.rewardAddress = rewardAddress;
    this.router = router;
    this.router.subscribe(this);
  }

  mine() {
    const miningStartTimestamp = new Date().getTime();
    const prevHash = this.blockchain.lastHash();
    const target = this.blockchain.nextDifficultyTarget();
    const rewardTx = Transaction.rewardTransaction(this.rewardAddress);
    this.transactionPool.push(rewardTx);

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
        this.transactionPool,
        timestamp - miningStartTimestamp,
      );
    } while (!block.isValid());

    this.blockchain.addBlock(block);
    this.clearTransactions();
    this.router.mineDone();
  }

  pushTransaction(tx: Transaction) {
    if (!tx.verifyTransaction()) {
      console.log('署名の検証に失敗しました。');
      return;
    }
    this.transactionPool =
      this.transactionPool.filter(t => t.input && t.input.address !== tx.input.address);
    this.transactionPool.push(tx);
    console.log('トランザクションを追加しました。');
  }

  clearTransactions() {
    this.transactionPool = [];
    console.log('トランザクションを削除しました。');
  }
}

export default Miner;
