import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity"
import { assert } from "chai"
import { readFromContract, execMethod } from "./query-utils"
import * as fs from "fs"
import {
  uintCV,
  bufferCV,
  standardPrincipalCV
} from "@blockstack/stacks-transactions"

describe("Lightning swaps test suite", () => {

  const contractKeys = JSON.parse(fs.readFileSync("./keys-contract-base.json").toString())
  const project1Keys = JSON.parse(fs.readFileSync("./keys-project1.json").toString())
  let client: Client
  let provider: Provider

  const contractKey = contractKeys.stacksAddress
  const project1Key = project1Keys.stacksAddress

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(contractKey + ".lightning-swaps-v1", "lightning-swaps-v1", provider);
  })

  describe("Deploying an instance of the contract", () => {
    it("should have a valid syntax", async () => {
      await client.checkContract()
      await client.deployContract()
    })
  })

  describe("== Swap tests ================================================", () => {
    
    it("should return administrator", async () => {
      const result = await readFromContract(client, "get-administrator", []);
      assert.isOk(result.rawResult === '(ok ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM.lightning-swaps-v1)');
    })

    it ("should not let sender do transfer as not enough funds", async () => {
      let args = [`'${project1Key}`, "\"815\"", "u5000"];
      let txreceive = await execMethod(client, contractKey, "transfer-to-recipient!", args, true);
      assert.isOk(txreceive.error['commandOutput'].indexOf('u1') > -1, "returns error: not found");
      assert.isNotOk(txreceive.success, "Transaction succeeded");
    })

    it ("should not let sender do transfer as sender and receiver the same", async () => {
      let args = [`'${contractKey}`, "\"815\"", "u5000"];
      let txreceive = await execMethod(client, contractKey, "transfer-to-recipient!", args, true);
      assert.isOk(txreceive.error['commandOutput'].indexOf('u2') > -1, "returns error: not found");
      assert.isNotOk(txreceive.success, "Transaction succeeded");
    })

    it("should not have stored anything under this preimage", async () => {
      const result = await readFromContract(client, "get-tranfer", ["\"815\""]);
      assert.isOk(result.rawResult.indexOf('err u100') > -1, "Ensure amount not found");
    })
  })
  
  describe("== BTC Address Tests ================================================", () => {
    
    it ("should not let sender do transfer as sender and receiver the same", async () => {
      let args = ["\"tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e\"", "u20"];
      let txreceive = await execMethod(client, contractKey, "register-btc-address", args, true);
      assert.isOk(txreceive.success, "Transaction succeeded");
    })

    it("should be registered at this address", async () => {
      const result = await readFromContract(client, "is-btc-registered", ["\"tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e\""]);
      assert.isOk(result.rawResult === '(ok (tuple (lockin-rate u20) (stacker-address ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM)))', "Ensure amount not found");
    })
  })

  after(async () => {
    await provider.close()
  })
})
