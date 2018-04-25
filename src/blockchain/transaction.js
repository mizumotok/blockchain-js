// @flow

import uuidv1 from 'uuid/v1';
import SHA256 from 'crypto-js/sha256';
import { ec as EC } from 'elliptic';
import Wallet from '../wallet';

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

  createOutputs(senderWallet: Wallet, recipient: string, amount: number) {
    const balance = senderWallet.balance();
    this.outputs = [{ amount, address: recipient }];
    if (balance > amount) {
      this.outputs.push({
        amount: balance - amount,
        address: senderWallet.publicKey,
      });
    }
  }

  signTransaction(senderWallet: Wallet) {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    this.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance(),
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hash),
    };
  }

  verifyTransaction(): bool {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    return ec.keyFromPublic(this.input.address, 'hex')
      .verify(hash, this.input.signature);
  }

  static createTransaction(
    senderWallet: Wallet,
    recipient: string,
    amount: number,
  ): Transaction {
    const tx = new Transaction();
    tx.id = uuidv1();
    tx.createOutputs(senderWallet, recipient, amount);
    tx.signTransaction(senderWallet);
    return tx;
  }
}

export default Transaction;
