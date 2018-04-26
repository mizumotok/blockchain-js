// @flow

import Block from '../../blockchain/block';

describe('Block', () => {
  let genesis;
  beforeEach(() => {
    genesis = Block.genesis();
  });

  it('genesis block', () => {
    expect(genesis.timestamp).toBe(0);
    expect(genesis.prevHash).toBe('0'.repeat(64));
  });

  it('hashは64桁の16進数', () => {
    const block = new Block(new Date(), genesis.hash(), 0, 0, [], 0);
    const hash = block.hash();
    expect(/[0-9a-f]{64}/.test(hash)).toBe(true);
  });

  it('isValid test', () => {
    // 最小difficultyTarget
    const minDifficultyBlock = new Block(new Date(), genesis.hash(), 0, 0, [], 0);
    expect(minDifficultyBlock.isValid()).toBe(false);

    // 最大difficultyTarget
    const maxDifficultyBlock = new Block(new Date(), genesis.hash(), 256, 0, [], 0);
    expect(maxDifficultyBlock.isValid()).toBe(true);
  });

  it('toJSON test', () => {
    const timestamp = new Date();
    const block = new Block(timestamp, genesis.hash(), 0, 0, [], 0);
    expect(block.toJSON()).toEqual({
      timestamp,
      prevHash: genesis.hash(),
      difficultyTarget: 0,
      nonce: 0,
      transactions: [],
      miningDuration: 0,
    });
  });

  it('fromJSON test', () => {
    const timestamp = new Date();
    const block = new Block(timestamp, genesis.hash(), 0, 0, [], 0);
    const block2 = Block.fromJSON(block.toJSON());
    expect(block).toEqual(block2);
  });
});
