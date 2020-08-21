# Clarity Hackathon Risidio Lightning Swaps 2020

## Fraud Proof Swaps

Goals / roadmap of this work are;

Enable swapping lightning btc for STX tokens linking the stacks 2.0 project to development on lightning network.
Swaps use the LSAT (402 payment) protocol. The roadmap is about enabling delegated stacking / stack pools and
hopes to make stacking accessible to people in the lightning community.

Ultimately we'd like to see Proof of Transfer shift to being based on HTLC (Hashed Time Locked Contracts) to mitigate
the problem of Bitcoin transaction fees.

## Unit Testing

```bash
git clone git@github.com:radicleart/clarity-rstack.git

npm install
```

(node version `nvm use v12.16.3`)

test classes can be found in `test/unit/*.ts`

```javascript
npm run swaps
```

## Integration Testing

Generate two key sets using

```bash
cargo run --bin blockstack-cli generate-sk --testnet
```

Edit Stacks.toml to add the public key and set initial balances and run mocknet

```bash
vi $HOME/stacks-blockchain/testnet/stacks-node/Stacks.toml

nohup cargo testnet start --config=./testnet/stacks-node/Stacks.toml &

// tail the log file to watch for runtime errors in your script...
tail -f -n 200000 nohup.out | grep -i ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM
```

Check balances and contract deployment using the API;

* [Swapper Balance:](http://127.0.0.1:20443/v2/accounts/STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG)
* [Contract Balance:](http://127.0.0.1:20443/v2/accounts/ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM)
* [Contract Source Code:](http://127.0.0.1:20443/v2/contracts/source/ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM/lightning-swaps-v1)

## Issues

## References

* [Blockstack Clarity Documentation](https://docs.blockstack.org/core/smart/rpc-api.html)
* [Stacks Transactions JS Library](https://github.com/blockstack/stacks-transactions-js)
* [Stacks Blockchain](https://github.com/blockstack/stacks-blockchain)
* [Stacks Blockchain Sidecar](https://github.com/blockstack/stacks-blockchain-sidecar)
* [Clarity JS SDK](https://github.com/blockstack/clarity-js-sdk)
* [Clarity VSCode](https://github.com/blockstack/clarity-vscode)
