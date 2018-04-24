// @flow

import { ec as EC } from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import uuidv1 from 'uuid/v1';
import { Transaction } from '../../blockchain';

const ec = new EC('secp256k1');

describe('Transaction', () => {
  let keyPair;
  let tx;
  beforeEach(() => {
    keyPair = ec.genKeyPair({ entropy: uuidv1() });
    tx = Transaction.createTransaction(keyPair, 1000, 'recipient-address', 100);
  });

  it('createOutputs test', () => {
    // おつりあり
    expect(tx.outputs).toEqual([
      { amount: 100, address: 'recipient-address' },
      { amount: 900, address: keyPair.getPublic().encode('hex') },
    ]);

    // おつりなし
    const tx2 = Transaction.createTransaction(keyPair, 1000, 'recipient-address', 1000);
    expect(tx2.outputs).toEqual([
      { amount: 1000, address: 'recipient-address' },
    ]);
  });

  it('signTransaction test', () => {
    const hash = SHA256(JSON.stringify(tx.outputs)).toString();
    expect(tx.input.address).toBe(keyPair.getPublic().encode('hex'));
    expect(tx.input.signature).toEqual(keyPair.sign(hash));
  });

  it('verifyTransaction test', () => {
    expect(tx.verifyTransaction()).toBe(true);

    // 改ざん
    tx.outputs[0].address = 'kaizansareta-address';
    expect(tx.verifyTransaction()).toBe(false);
  });
});
