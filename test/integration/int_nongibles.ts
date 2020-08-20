import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
import { readFromContract, execMethod } from "../unit/query-utils"
import * as fs from "fs";
import {
  makeContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
  ChainID,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  StacksTestnet,
  broadcastTransaction,
} from "@blockstack/stacks-transactions";
const BigNum = require("bn.js"); 
const STACKS_API_URL = "http://localhost:20443";
describe("nongibles tutorial test suite", () => {
  describe("Deploying an instance of the contract", () => {
    it("should mint a non fungible token", async () => {
      const contractKeys = JSON.parse(fs.readFileSync("./keys-contract-base.json").toString());
      const minterKeys = JSON.parse(fs.readFileSync("./keys-minter.json").toString());
  
      const contractName = "nongibles";
      const codeBody = fs
        .readFileSync("./contracts/nongibles.clar")
        .toString();
  
      const price = 0x1000;
  
      var fee = new BigNum(2548);
      const network = new StacksTestnet();
      network.coreApiUrl = STACKS_API_URL;
  
      console.log("deploy contract");
      var transaction = await makeContractDeploy({
        contractName,
        codeBody,
        fee,
        senderKey: contractKeys.secretKey,
        nonce: new BigNum(0),   // watch for nonce increments if this works - may need to restart mocknet!
        network,
      });
      console.log(transaction);
      console.log(await broadcastTransaction(transaction, network));

      await new Promise((r) => setTimeout(r, 30000));
      console.log("client-mint: ");
      fee = new BigNum(256);

      transaction = await makeContractCall({
        contractAddress: contractKeys.stacksAddress,
        contractName,
        functionName: "client-mint",
        functionArgs: [uintCV(price)],
        fee,
        senderKey: minterKeys.secretKey,
        nonce: new BigNum(0),
        network,
      });
      console.log(transaction);
      console.log(await broadcastTransaction(transaction, network));
       /** 
        **/
      });
  });
  after(async () => {
    // await provider.close();
  });
});
