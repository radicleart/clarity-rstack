import { assert } from "chai";
import { readFromContract } from "../unit/query-utils"
import * as fs from "fs";
import {
  StacksTransaction,
  TxBroadcastResult,
  makeContractDeploy,
  makeContractCall,
  ClarityValue,
  uintCV,
  intCV,
  bufferCV,
  standardPrincipalCV,
  StacksTestnet,
  broadcastTransaction,
} from "@blockstack/stacks-transactions";
const BigNum = require("bn.js"); 
const network = new StacksTestnet();
const fee = new BigNum(3000);
const keys = {
  'contract-base': JSON.parse(fs.readFileSync("./keys-contract-base.json").toString()),
  'minter': JSON.parse(fs.readFileSync("./keys-minter.json").toString()),
  'project1': JSON.parse(fs.readFileSync("./keys-project1.json").toString()),
  'project2': JSON.parse(fs.readFileSync("./keys-project2.json").toString()),
}

async function deployContract(contractName: string, nonce): Promise<Object> {
  console.log("deploying contract: " + contractName);
  network.coreApiUrl = "http://localhost:20443";
  const codeBody = fs.readFileSync("./contracts/" + contractName + ".clar").toString();
  var transaction = await makeContractDeploy({
    contractName,
    codeBody,
    fee,
    senderKey: keys['contract-base'].secretKey, // using same key allows contract-call?
    // nonce: nonce,   // watch for nonce increments if this works - may need to restart mocknet!
    network,
  });
  await broadcastTransaction(transaction, network);
  await new Promise((r) => setTimeout(r, 4000));
  return transaction;
}
async function callContract(nonce, sender: string, contractName: string, functionName: string, functionArgs: ClarityValue[]): Promise<TxBroadcastResult> {
  console.log("transaction: contract=" + contractName + " sender=" + sender + " function=" + functionName + " args= .. ");
  var transaction = await makeContractCall({
    contractAddress: keys['contract-base'].stacksAddress,
    contractName,
    functionName,
    functionArgs,
    fee,
    senderKey: keys[sender].secretKey,
    nonce,
    network
  });
  var result:any = await broadcastTransaction(transaction, network);
  // console.log(transaction);
  // console.log(result);
  assert.isNotOk(result.reason, "Transaction failed");
  return result;
}
/**
**/
describe("Deploying contracts", () => {
  it("should deploy lightning-swaps-v1 contract and wait for confirmation", async () => {
    let transaction = await deployContract("lightning-swaps-v1", new BigNum(0));
    assert.isOk(transaction, "Transaction succeeded");
    console.log("=======================================================================================");
    // console.log(transaction);
    console.log("=======================================================================================");
  });
});

describe("Check contracts deployed", () => {
  it("should return lightning-swaps-v1 contract address", async () => {
    let args = [bufferCV(Buffer.from("815"))];
    let result:any = await callContract(new BigNum(1), "contract-base", "lightning-swaps-v1", "get-tranfer", args);
    // console.log(transaction);
    assert.isOk(result, "Transaction succeeded");
  })
})

describe("Test project admin functions", () => {
  it("should not allow insert if tx-sender is not admin", async () => {
    let args = [standardPrincipalCV(keys['project1'].stacksAddress), bufferCV(Buffer.from("815")), uintCV(0x5000)];
    let result:any = await callContract(new BigNum(2), "contract-base", "lightning-swaps-v1", "transfer-to-recipient!", args);
    // console.log(transaction);
    assert.isOk(result, "Transaction succeeded");
  })
});

after(async () => {
  // await provider.close();
});
