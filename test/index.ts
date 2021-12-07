import { expect } from "chai";
import { ethers } from "hardhat";

describe("DevDIDs", function () {
  it("Should return the new greeting once it's changed", async function () {
    const DevDIDs = await ethers.getContractFactory("DevDIDs");
    const devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");
    //
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    //
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    //
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
