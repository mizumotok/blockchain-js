# Blockchain in Javascript

## Building Steps
### Step0 Set up
We use Babel, ES6, ESLint, Flow, Jest.
```
$ git checkout 00_setup
```

### Step1 Block
Implement Block Class.
```
$ git checkout 01_block
```

### Step2 Blockchain
Implement Blockchain Class which contains linked Block instances.
```
$ git checkout 02_blockchain
```

### Step3 Miner
Implement Miner Class which builds a new block.
```
$ git checkout 03_miner
```

### Step4 Adjust Difficulty
Adjust mining difficulty based on how long the previous mining took.
```
$ git checkout 04_adjust_difficulty
```

### Step5 Transaction
Implement Transaction Class which manages input, outputs and a digital signature.
```
$ git checkout 05_transaction
```

### Step6 Wallet
Implement Wallet Class which manages a public and private key pair and creates a digital signature.
```
$ git checkout 06_wallet
```

### Step7 Mining Reward
Give reward when a miner discovers a block.
```
$ git checkout 07_mining_reward
```

### Step8 Web User Interface
Web User Interface helps us test.
```
$ git checkout 08_web_user_interface
```

### Step9 P2P Network(Router)
Implement Router Class which makes a peer-to-peer netowork.
```
$ git checkout 09_router
```

## 解説ブログ
1. [ブロックの実装](https://mizumotok.hatenablog.jp/entry/2018/04/21/152341)
2. [ブロックチェーンの実装](https://mizumotok.hatenablog.jp/entry/2018/04/22/131604)
3. [マイニングの実装](https://mizumotok.hatenablog.jp/entry/2018/04/23/175235)
4. [トランザクションの実装](https://mizumotok.hatenablog.jp/entry/2018/04/24/234017)
5. [ウォレットの実装](https://mizumotok.hatenablog.jp/entry/2018/04/25/231306)
6. [P2Pネットワーク](https://mizumotok.hatenablog.jp/entry/2018/04/26/234819)
