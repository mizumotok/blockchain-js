// @flow

import Blockchain, { Transaction } from '../../blockchain';
import Miner from '../../miner';
import Wallet from '../../wallet';

describe('Miner', () => {
  let blockchain;
  let miner;
  let wallet;

  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
    miner = new Miner(blockchain);
  });

  it('mine test', () => {
    miner.mine();
    expect(blockchain.chain).toHaveLength(2);
    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
  });

  it('pushTransaction test', () => {
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 100);

    miner.pushTransaction(tx);
    expect(miner.transactionPool).toHaveLength(1);

    // 同じアドレス
    const tx2 = Transaction.createTransaction(wallet, 'recipient-address2', 200);
    miner.pushTransaction(tx2);
    expect(miner.transactionPool).toHaveLength(1);

    // 改ざんされたトランザクション
    const tx3 = Transaction.createTransaction(wallet, 'recipient-address', 300);
    tx3.outputs[0].address = 'kaizansareta-address';
    miner.pushTransaction(tx3);
    expect(miner.transactionPool).toHaveLength(1);

    // clearTransaction
    miner.clearTransactions();
    expect(miner.transactionPool).toHaveLength(0);
  });
});
