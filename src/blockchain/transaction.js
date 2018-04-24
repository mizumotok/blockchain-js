// @flow

import uuidv1 from 'uuid/v1';
import SHA256 from 'crypto-js/sha256';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

type Input = {
  timestamp: number,
  amount: number,
  address: string,
  signature: string,
};

type Output = {
  amount: number,
  address: string,
};

class Transaction {
  id: string;
  outputs: Array<Output>;
  input: Input;
  coinbase: ?string;

  createOutputs(keyPair: any, senderAmount: number, recipient: string, amount: number) {
    this.outputs = [{ amount, address: recipient }];
    if (senderAmount > amount) {
      this.outputs.push({
        amount: senderAmount - amount,
        address: keyPair.getPublic().encode('hex'),
      });
    }
  }

  signTransaction(keyPair: any, amount: number) {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    this.input = {
      timestamp: Date.now(),
      amount,
      address: keyPair.getPublic().encode('hex'),
      signature: keyPair.sign(hash),
    };
  }

  verifyTransaction(): bool {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    return ec.keyFromPublic(this.input.address, 'hex')
      .verify(hash, this.input.signature);
  }

  static createTransaction(
    keyPair: any,
    senderAmount: number,
    recipient: string,
    amount: number,
  ): Transaction {
    const tx = new Transaction();
    tx.id = uuidv1();
    tx.createOutputs(keyPair, senderAmount, recipient, amount);
    tx.signTransaction(keyPair, senderAmount);
    return tx;
  }
}

export default Transaction;
