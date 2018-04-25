// @flow

import { ec as EC } from 'elliptic';
import Blockchain, { Transaction } from '../../blockchain';
import Miner from '../../miner';
import Wallet, { INITIAL_BALANCE } from '../../wallet';

const ec = new EC('secp256k1');

describe('Miner', () => {
  let blockchain: Blockchain;
  let miner: Miner;
  let wallet: Wallet;

  beforeEach(() => {
    blockchain = new Blockchain();
    miner = new Miner(blockchain);
    wallet = new Wallet(blockchain);
  });

  it('balance test', () => {
    expect(wallet.balance()).toBe(INITIAL_BALANCE);

    const tx = Transaction.createTransaction(wallet, 'recipient-address', 100);
    miner.pushTransaction(tx);
    miner.mine();
    expect(wallet.balance()).toBe(INITIAL_BALANCE - 100);
    console.log(`残高： ${INITIAL_BALANCE - 100}`);
  });

  it('sign test', () => {
    const data = `${new Date().getTime()}`;
    const signature = wallet.sign(data);
    expect(ec.keyFromPublic(wallet.publicKey, 'hex').verify(data, signature))
      .toBe(true);
  });
});
