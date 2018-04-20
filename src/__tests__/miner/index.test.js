// @flow

import Blockchain from '../../blockchain';
import Miner from '../../miner';

describe('Miner', () => {
  let blockchain;
  let miner;

  beforeEach(() => {
    blockchain = new Blockchain();
    miner = new Miner(blockchain);
  });

  it('mine', () => {
    miner.mine();
    expect(blockchain.chain).toHaveLength(2);
    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);

    miner.mine();
    expect(blockchain.chain).toHaveLength(3);
    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);

    console.log(blockchain.chain);
  });
});
