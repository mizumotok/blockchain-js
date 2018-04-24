// @flow

import { ec as EC } from 'elliptic';
import uuidv1 from 'uuid/v1';
import Blockchain, { Transaction } from '../../blockchain';
import Miner from '../../miner';

const ec = new EC('secp256k1');

describe('Miner', () => {
  let blockchain;
  let miner;

  beforeEach(() => {
    blockchain = new Blockchain();
    miner = new Miner(blockchain);
  });

  it('mine test', () => {
    miner.mine();
    expect(blockchain.chain).toHaveLength(2);
    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
  });

  it('pushTransaction test', () => {
    const keyPair = ec.genKeyPair({ entropy: uuidv1() });
    const tx = Transaction.createTransaction(keyPair, 1000, 'recipient-address', 100);

    miner.pushTransaction(tx);
    expect(miner.transactionPool).toHaveLength(1);

    // 同じアドレス
    const tx2 = Transaction.createTransaction(keyPair, 1000, 'recipient-address2', 200);
    miner.pushTransaction(tx2);
    expect(miner.transactionPool).toHaveLength(1);

    // 改ざんされたトランザクション
    const tx3 = Transaction.createTransaction(keyPair, 1000, 'recipient-address', 300);
    tx3.outputs[0].address = 'kaizansareta-address';
    miner.pushTransaction(tx3);
    expect(miner.transactionPool).toHaveLength(1);

    // clearTransaction
    miner.clearTransactions();
    expect(miner.transactionPool).toHaveLength(0);
  });
});
