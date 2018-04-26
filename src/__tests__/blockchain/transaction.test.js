// @flow

import SHA256 from 'crypto-js/sha256';
import Blockchain, { Transaction } from '../../blockchain';
import Wallet from '../../wallet';
import Miner from '../../miner';
import Router from '../../router';

import { MINING_REWARD } from '../../config';

describe('Transaction', () => {
  let wallet: Wallet;
  let miner: Miner;
  beforeEach(() => {
    const blockchain = new Blockchain();
    const router = new Router(blockchain, false);
    wallet = new Wallet(blockchain, router);
    miner = new Miner(blockchain, wallet.publicKey, router);
  });

  it('createOutputs test', () => {
    miner.mine(); // まず報酬をもらう
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);

    // おつりあり
    expect(tx.outputs).toEqual([
      { amount: 10, address: 'recipient-address' },
      { amount: MINING_REWARD - 10, address: wallet.publicKey },
    ]);

    // おつりなし
    const tx2 = Transaction.createTransaction(wallet, 'recipient-address', MINING_REWARD);
    expect(tx2.outputs).toEqual([
      { amount: MINING_REWARD, address: 'recipient-address' },
    ]);
  });

  it('signTransaction test', () => {
    miner.mine();
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);

    const hash = SHA256(JSON.stringify(tx.outputs)).toString();
    expect(tx.input.address).toBe(wallet.publicKey);
    expect(tx.input.signature).toEqual(wallet.sign(hash));
  });

  it('verifyTransaction test', () => {
    miner.mine();
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);

    expect(tx.verifyTransaction()).toBe(true);

    // 改ざん
    tx.outputs[0].address = 'kaizansareta-address';
    expect(tx.verifyTransaction()).toBe(false);
  });

  it('rewardTransaction', () => {
    const tx = Transaction.rewardTransaction('reward-address');
    expect(tx.outputs[0].address).toBe('reward-address');
    expect(tx.outputs[0].amount).toBe(MINING_REWARD);
    expect(tx.coinbase.length).toBeGreaterThan(1);
  });

  it('toJSON test', () => {
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);
    expect(tx.toJSON()).toEqual({
      id: tx.id,
      outputs: tx.outputs,
      input: tx.input,
      coinbase: tx.coinbase,
    });
  });

  it('fromJSON test', () => {
    const tx = Transaction.createTransaction(wallet, 'recipient-address', 10);
    const tx2 = Transaction.fromJSON(tx.toJSON());
    expect(tx).toEqual(tx2);
  });
});
