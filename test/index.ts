import { expect } from "chai";
import { ethers } from "hardhat";

describe("DevDIDs", function () {
  it("Should issue a Vc for address", async function () {
    const DevDIDs = await ethers.getContractFactory("DevDIDs");
    const devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();
    let owner;
    let addr1;
    let addr2;
    let addrs;
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();


    await devDIDs.issue(addr1.address,"ZahraMohammadPour","Has compeleted first sprint",5,20);
    expect(await devDIDs.ownerOf(1)).to.equal(addr1.address);
  });
});
