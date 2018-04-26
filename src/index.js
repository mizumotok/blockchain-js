// @flow

import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from './blockchain';
import Router from './router';
import Wallet from './wallet';
import Miner from './miner';
import { HTTP_PORT } from './config';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const bc = new Blockchain();
const router = new Router(bc);
const wallet = new Wallet(bc, router);
const miner = new Miner(bc, wallet.publicKey, router);

app.get('/blocks', (req, res) => {
  const r = bc.chain.map((b, i) => {
    const j = b.toJSON();
    j.hash = b.hash();
    j.height = i;
    return j;
  });
  res.json(r.reverse());
});

app.get('/transactions', (req, res) => {
  res.json(miner.transactionPool);
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  wallet.createTransaction(recipient, Number(amount));
  res.redirect('/transactions');
});

app.get('/wallet', (req, res) => {
  res.json({ address: wallet.publicKey, blance: wallet.balance() });
});

app.post('/mine', (req, res) => {
  miner.mine();
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
