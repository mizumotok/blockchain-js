// @flow

import uuidv1 from 'uuid/v1';
import { ec as EC } from 'elliptic';
import Blockchain, { Transaction } from '../blockchain';
import Router from '../router';

const ec = new EC('secp256k1');

class Wallet {
  blockchain: Blockchain;
  keyPair: any;
  publicKey: string;
  router: Router;

  constructor(blockchain: Blockchain, router: Router) {
    this.blockchain = blockchain;
    this.keyPair = ec.genKeyPair({ entropy: uuidv1() });
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.router = router;
  }

  createTransaction(recipient: string, amount: number) {
    if (amount > this.balance()) {
      console.log('残高不足です。');
      return;
    }
    const tx = Transaction.createTransaction(this, recipient, amount);
    this.router.pushTransaction(tx);
  }

  balance() :number {
    const transactions = this.blockchain.chain
      .reduce((a, block) => a.concat(block.transactions), []);
    const inputs = transactions.reduce((a, tx) => (
      tx.input && tx.input.address === this.publicKey ? a + tx.input.amount : a
    ), 0);
    const outputs = transactions.reduce((a, tx) => (
      a + (tx.outputs || []).reduce((a2, o) => (
        o.address === this.publicKey ? a2 + o.amount : a2
      ), 0)
    ), 0);
    return outputs - inputs;
  }

  sign(data: string) :string {
    return this.keyPair.sign(data);
  }
}

export default Wallet;
