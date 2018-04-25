// @flow

import { ec as EC } from 'elliptic';
import Blockchain, { Transaction } from '../../blockchain';
import Miner from '../../miner';
import Wallet from '../../wallet';
import { MINING_REWARD } from '../../config';

const ec = new EC('secp256k1');

describe('Miner', () => {
  let blockchain: Blockchain;
  let miner: Miner;
  let wallet: Wallet;

  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
    miner = new Miner(blockchain, wallet.publicKey);
  });

  it('balance test', () => {
    expect(wallet.balance()).toBe(0);

    miner.mine();
    expect(wallet.balance()).toBe(MINING_REWARD);

    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);
    miner.pushTransaction(tx);
    miner.mine();
    expect(wallet.balance()).toBe((MINING_REWARD * 2) - 10);
  });

  it('sign test', () => {
    const data = `${new Date().getTime()}`;
    const signature = wallet.sign(data);
    expect(ec.keyFromPublic(wallet.publicKey, 'hex').verify(data, signature))
      .toBe(true);
  });
});
