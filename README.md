# Risidio STX Lightning Swaps 2020

## Fraud Proof Swaps

Enable Lightning BTC to STX token swaps using Lightning Service Authentication Tokens
(LSAT or 402) payment protocol.

This contract is part of a more ambitious project one component of which is fraud proof swaps of btc for stx over the Lightning network using the LSAT protocol. The main project can be found at [rStack](https://stax.risidio.com).

As it stands the contract here provides the transfer function of the stx tokens that have been purchased indepently via a lightning transaction. LSAT generates a token that combines with the payment preimage to provide a proof of payment. On receipt of this token via a separate websocket connection an 'admin' wallet is able to call this contract to make the final transfer.

We ended up building the tools to deploy the contract on testnet - we didin't realise we were doing this in parallel with the Blockstack PBC explorer development. This is probably beneficial in the long run as it helps to decentralise the project.

Challenges involved have all been around logistics of getting it working on mainnet. Figuring out the correct value for the nonce, for example, when broadcasting transactions and getting our heads around the multiple calls and states of the application.

Our goals / roadmap with this work would be to provide an educational site and build services such as delegated stacking to help small STX token holders participate in proof of transfer.

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
