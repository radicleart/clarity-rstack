# Risidio STX Lightning Swaps 2020

## Delegated Stacking and Fraud Proof Swaps

Enable Delegated Stacking via swaps of Lightning BTC to STX tokens using Lightning Service Authentication Tokens (LSAT/402) protocol. Our goals revolve around providing services to help small STX token holders participate in proof of transfer. Our project [rStack](https://stax.risidio.com) is a fully decentralised application using Gaia for data storage.

The Clarity contract is part of a more ambitious project. Its purpose is to transfer STX tokens and register btc reward addresses, linked transparently to the STX holder address. One component of the solution enables fraud proof swaps of btc for stx over the Lightning network using the LSAT protocol. 

The clarity contract here provides the transfer function of the stx tokens that have been purchased indepently via a lightning transaction and also a register for the stackers reward address. The registration happens in conjunction with payment for STX tokens via LSAT generates and in so doing a macaroon is registered that proves the service level agreement by locking in some key information. Combining the macaroon with the Lightning payment preimage provides a proof of payment and locks in some meta data. Using this technique the user can authenticate their bitcoin address while purchasing stx tokens and then register this information with the clartiy contract.

We ended up building the tools to deploy the contract on testnet - we didin't realise we were doing this in parallel with the Blockstack PBC explorer development. In the longer term its beneficial to have multiple providers of this type of infrastructure as its unlikely all users will opt to run the blockchain locally.

Challenges have revolved around logistics of getting things working. Figuring out the correct value for the nonce, dealing with integration testing, financial constraints etc, when broadcasting transactions and getting our heads around the multiple calls and states of the application.

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

* [rStack](https://stax.risidio.com)
* [Blockstack Clarity Documentation](https://docs.blockstack.org/core/smart/rpc-api.html)
* [Stacks Transactions JS Library](https://github.com/blockstack/stacks-transactions-js)
* [Stacks Blockchain](https://github.com/blockstack/stacks-blockchain)
* [Stacks Blockchain Sidecar](https://github.com/blockstack/stacks-blockchain-sidecar)
* [Clarity JS SDK](https://github.com/blockstack/clarity-js-sdk)
* [Clarity VSCode](https://github.com/blockstack/clarity-vscode)
