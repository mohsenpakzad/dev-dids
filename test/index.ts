import { expect } from "chai";
import { ethers } from "hardhat";
import { DevDIDs } from "../typechain";


describe("DevDIDs", function () {
    let devDIDs: DevDIDs;
  
    beforeEach(async () => {
      const DevDIDs = await ethers.getContractFactory("DevDIDs");
      devDIDs = await DevDIDs.deploy();
      await devDIDs.deployed();
    
    });

    describe("issue", async () => {

      it("should return 5 when given parameters are 2 and 3", async function () {
        let owner, addr1,addr2,addrs;
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        
        await devDIDs.issue(addr1.address,"ZahraMohammadPour","Has compeleted first sprint",5,20);
        expect(await devDIDs.ownerOf(1)).
        to.
        equal(addr1.address);    
      });
      it("Should fail when self issuing", async function () {
        let owner, addr1,addr2,addrs;
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        await expect(
        devDIDs.issue(owner.address,"ZahraMohammadPour","Has compeleted first sprint",5,20)).
        to.
        be.
        revertedWith("self issuing is not permitted");
      });
  
    });
});