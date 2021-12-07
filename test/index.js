const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DevDIDs", function () {

  let DevDIDs;
  let devDIDs;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DevDIDs = await ethers.getContractFactory("DevDIDs");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`

  });
  describe("Issue", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.


    it("Should issue a Vc for address", async function () {

      await devDIDs.issue(addr1.address,"ZahraMohammadPour","Has compeleted first sprint",5,20);
      expect(await devDIDs.ownerOf(1)).to.equal(addr1.address);
  
    });

  it("Should fail when self issuing", async function () {

    await expect(
      devDIDs.issue(owner.address,"ZahraMohammadPour","Has compeleted first sprint",5,20))
    .to.be.revertedWith("self issuing is not permitted");

  });


 });

});
