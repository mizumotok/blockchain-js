// @flow

import WebSocket from 'ws';
import Blockchain, { Block, Transaction } from '../blockchain';
import Miner from '../miner';
import P2pServer from './p2p_server';
import MESSAGE_TYPES from './message_types';
import type { MessageData } from './message_types';

class Router {
  blockchain: Blockchain;
  miner: Miner;
  sockets: Array<WebSocket>;
  p2pServer: P2pServer;

  constructor(blockchain: Blockchain, p2pEnabled: bool = true) {
    this.blockchain = blockchain;
    this.p2pServer = new P2pServer(this.blockchain, this.messageHandler.bind(this), p2pEnabled);
  }

  subscribe(miner: Miner) {
    this.miner = miner;
  }

  pushTransaction(tx: Transaction) {
    if (this.miner) {
      this.miner.pushTransaction(tx);
    }
    this.p2pServer.broadcastTransaction(tx);
  }

  mineDone() {
    this.p2pServer.broadcastMined();
  }

  messageHandler(data: MessageData) {
    switch (data.type) {
      case MESSAGE_TYPES.BLOCK_CHAIN:
        this.blockchain.replaceChain(data.payload.map(o => Block.fromJSON(o)));
        break;
      case MESSAGE_TYPES.TRANSACTION:
        if (this.miner) {
          this.miner.pushTransaction(Transaction.fromJSON(data.payload));
        }
        break;
      case MESSAGE_TYPES.MINED:
        this.blockchain.replaceChain(data.payload.map(o => Block.fromJSON(o)));
        if (this.miner) {
          this.miner.clearTransactions();
        }
        break;
      default:
        break;
    }
  }
}

export default Router;
