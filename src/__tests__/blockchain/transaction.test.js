// @flow

import SHA256 from 'crypto-js/sha256';
import Blockchain, { Transaction } from '../../blockchain';
import Wallet, { INITIAL_BALANCE } from '../../wallet';

describe('Transaction', () => {
  let wallet: Wallet;
  let tx: Transaction;
  beforeEach(() => {
    const blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
    tx = Transaction.createTransaction(wallet, 'recipient-address', 100);
  });

  it('createOutputs test', () => {
    // おつりあり
    expect(tx.outputs).toEqual([
      { amount: 100, address: 'recipient-address' },
      { amount: INITIAL_BALANCE - 100, address: wallet.publicKey },
    ]);

    // おつりなし
    const tx2 = Transaction.createTransaction(wallet, 'recipient-address', INITIAL_BALANCE);
    expect(tx2.outputs).toEqual([
      { amount: INITIAL_BALANCE, address: 'recipient-address' },
    ]);
  });

  it('signTransaction test', () => {
    const hash = SHA256(JSON.stringify(tx.outputs)).toString();
    expect(tx.input.address).toBe(wallet.publicKey);
    expect(tx.input.signature).toEqual(wallet.sign(hash));
  });

  it('verifyTransaction test', () => {
    expect(tx.verifyTransaction()).toBe(true);

    // 改ざん
    tx.outputs[0].address = 'kaizansareta-address';
    expect(tx.verifyTransaction()).toBe(false);
  });
});
