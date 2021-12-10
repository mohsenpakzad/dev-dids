import { expect } from "chai";
import { ethers } from "hardhat";
import { DevDIDs } from "../typechain";

describe("Verifier", async () => {
  let devDIDs: DevDIDs;

  beforeEach(async () => {
    const DevDIDs = await ethers.getContractFactory("DevDIDs");
    devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();
  });

  it("Should return true if vp is valid", async function () {
    const [, addr1] = await ethers.getSigners();

    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint1",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint2",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint3",
      5,
      20
    );

    const vp = await devDIDs.connect(addr1).generateVp([1, 3], 5, 12);

    await expect(await devDIDs.verify(vp, addr1.address, 5)).deep.equal([
      true,
      "",
    ]);
  });

  it("Should return false if vp is not valid", async function () {
    const [, addr1, addr2] = await ethers.getSigners();

    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint1",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint2",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint3",
      5,
      20
    );
    await devDIDs.issue(
      addr2.address,
      "Zahra MohammadPour",
      "Has completed first sprint3",
      5,
      20
    );

    const vp = await devDIDs.connect(addr1).generateVp([1, 2, 3], 5, 12);

    await expect(await devDIDs.verify(vp, addr2.address, 5)).deep.equal([
      false,
      "DevDIDs: holder is not owner of all vcs",
    ]);
  });
});
