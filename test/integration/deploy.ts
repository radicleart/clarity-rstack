import { assert } from "chai";
import { readFromContract } from "../unit/query-utils"
import * as fs from "fs";
import {
  StacksTransaction,
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
  await new Promise((r) => setTimeout(r, 30000));
  return transaction;
}
async function callContract(nonce, sender: string, contractName: string, functionName: string, functionArgs: ClarityValue[]): Promise<StacksTransaction> {
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
  var result = await broadcastTransaction(transaction, network);
  // console.log(transaction);
  // console.log(result);
  return transaction;
}

describe("Deploying contracts", () => {
  it("should deploy LightningSwaps contract and wait for confirmation", async () => {
    let transaction = await deployContract("LightningSwaps", new BigNum(0));
    assert.isOk(transaction, "Transaction succeeded");
    console.log("=======================================================================================");
    console.log(transaction);
    console.log("=======================================================================================");
  });
});

describe("Check contracts deployed", () => {
  it("should return LightningSwaps contract address", async () => {
    let args = [];
    let transaction = await callContract(new BigNum(2), "contract-base", "LightningSwaps", "get-address", args);
    console.log(transaction);
    assert.isOk(transaction, "Transaction succeeded");
  })
})

describe("Test project admin functions", () => {
  it("should allow insert if tx-sender is contract owner", async () => {
    let args = [standardPrincipalCV(keys['project1'].stacksAddress), bufferCV(Buffer.from("http://project1.com/assets/v1")), uintCV(0x5000)];
    let transaction = await callContract(new BigNum(2), "contract-base", "projects", "add-project", args);
    assert.isOk(transaction, "Transaction succeeded");
  })
  it("should allow read of inserted project", async () => {
    let args = [standardPrincipalCV(keys['project1'].stacksAddress)];
    let transaction = await callContract(new BigNum(0), "project1", "projects", "get-project", args);
  })
  it("should return error if no project found", async () => {
    let args = [standardPrincipalCV(keys['project1'].stacksAddress)];
    let transaction = await callContract(new BigNum(0), "project2", "projects", "get-project", args);
  })
});

after(async () => {
  // await provider.close();
});
