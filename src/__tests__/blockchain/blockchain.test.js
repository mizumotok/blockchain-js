// @flow

import Blockchain, { Block } from '../../blockchain';
import { MINING_DURATION } from '../../config';

describe('Blockchain', () => {
  let blockchain: Blockchain;
  let newBlock: Block;

  beforeEach(() => {
    blockchain = new Blockchain();
    newBlock = new Block(new Date(), blockchain.chain[0].hash(), 256, 0, [], MINING_DURATION);
  });

  it('初期値はgenesis blockのみ', () => {
    expect(blockchain.chain).toHaveLength(1);
    const block = Block.genesis();
    expect(blockchain.chain[0].hash()).toBe(block.hash());
  });

  it('canAddBlock test', () => {
    const olderBlock = new Block(-1, blockchain.chain[0].hash(), 256, 0, []);
    expect(blockchain.canAddBlock(olderBlock)).toBe(false);

    const wrongHashBlock = new Block(new Date(), 'xxxx', 256, 0, []);
    expect(blockchain.canAddBlock(wrongHashBlock)).toBe(false);

    const inValidBlock = new Block(new Date(), blockchain.chain[0].hash(), 0, 0, []);
    expect(blockchain.canAddBlock(inValidBlock)).toBe(false);

    expect(blockchain.canAddBlock(newBlock)).toBe(true);
  });

  it('addBlock test', () => {
    const inValidBlock = new Block(new Date(), blockchain.chain[0].hash(), 0, 0, []);
    let result = blockchain.addBlock(inValidBlock);
    expect(result).toBe(false);
    expect(blockchain.chain).toHaveLength(1);

    result = blockchain.addBlock(newBlock);
    expect(result).toBe(true);
    expect(blockchain.chain).toHaveLength(2);
    expect(blockchain.chain[0].hash()).toBe(blockchain.chain[1].prevHash);
  });

  it('lastHash test', () => {
    const genesis = Block.genesis();
    expect(blockchain.lastHash()).toBe(genesis.hash());

    blockchain.addBlock(newBlock);
    expect(blockchain.lastHash()).toBe(newBlock.hash());
  });

  it('validChain test', () => {
    // genesisが間違っている
    let chain = [newBlock];
    expect(Blockchain.isValidChain(chain)).toBe(false);

    const genesis = Block.genesis();
    chain = [genesis];
    expect(Blockchain.isValidChain(chain)).toBe(true);

    // prevHashが間違っている
    chain = [genesis, new Block(0, 'xxx', 256, 0, [])];
    expect(Blockchain.isValidChain(chain)).toBe(false);

    // invalidなblockがある
    chain = [genesis, new Block(0, genesis.hash(), 0, 0, [])];
    expect(Blockchain.isValidChain(chain)).toBe(false);

    chain = [genesis, newBlock];
    expect(Blockchain.isValidChain(chain)).toBe(true);
  });

  it('calcDifficultyTarget test', () => {
    const difficultyTarget = 250;
    const longMiningBlock = new Block(
      new Date(),
      blockchain.chain[0].hash(),
      difficultyTarget,
      0,
      [],
      MINING_DURATION * 2,
    );
    const chain = blockchain.chain.concat([longMiningBlock]);
    expect(Blockchain.calcDifficultyTarget(chain)).toBe(difficultyTarget + 1);

    const shortMiningBlock = new Block(
      new Date(),
      blockchain.chain[0].hash(),
      difficultyTarget,
      0,
      [],
      MINING_DURATION / 2,
    );
    chain.push(shortMiningBlock);
    expect(Blockchain.calcDifficultyTarget(chain)).toBe(difficultyTarget - 1);

    const justRightBlock = new Block(
      new Date(),
      blockchain.chain[0].hash(),
      difficultyTarget,
      0,
      [],
      MINING_DURATION * 1.1,
    );
    chain.push(justRightBlock);
    expect(Blockchain.calcDifficultyTarget(chain)).toBe(difficultyTarget);
  });
});
