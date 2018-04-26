// @flow

import WebSocket from 'ws';
import Blockchain, { Transaction } from '../blockchain';
import MESSAGE_TYPES from './message_types';
import type { MessageData } from './message_types';
import { P2P_PORT, PEERS } from '../config';

class P2pServer {
  blockchain: Blockchain;
  messageHandler: Function;
  sockets: Array<WebSocket>;

  constructor(blockchain: Blockchain, messageHandler: Function, p2pEnabled: bool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.messageHandler = messageHandler;
    if (p2pEnabled) {
      this.listen();
    }
  }

  listen() {
    try {
      const server = new WebSocket.Server({ port: P2P_PORT });
      server.on('connection', socket => this.connect2Socket(socket));
      this.connect2Peers();
      console.log(`P2P Listening on ${P2P_PORT}`);
    } catch (e) {
      console.log('P2Pサーバの起動に失敗しました。');
    }
  }

  connect2Peers() {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.connect2Socket(socket));
    });
  }

  connect2Socket(socket: WebSocket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    socket.on('message', (message) => {
      console.log(`received from peer: ${message}`);
      const data: MessageData = JSON.parse(message);
      this.messageHandler(data);
    });
    this.sendBlockchain(socket);
  }

  sendBlockchain(socket: WebSocket) {
    P2pServer.sendData(socket, {
      type: MESSAGE_TYPES.BLOCK_CHAIN,
      payload: this.blockchain.chain.map(b => b.toJSON()),
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach(socket => P2pServer.sendData(socket, {
      type: MESSAGE_TYPES.TRANSACTION,
      payload: transaction.toJSON(),
    }));
  }

  broadcastMined() {
    this.sockets.forEach(socket => P2pServer.sendData(socket, {
      type: MESSAGE_TYPES.MINED,
      payload: this.blockchain.chain.map(b => b.toJSON()),
    }));
  }

  static sendData(socket: WebSocket, data: MessageData) {
    socket.send(JSON.stringify(data));
  }
}

export default P2pServer;
