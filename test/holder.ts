import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { DevDIDs } from "../typechain";

describe("Holder", async () => {
  let devDIDs: DevDIDs;

  beforeEach(async () => {
    const DevDIDs = await ethers.getContractFactory("DevDIDs");
    devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();
  });

  it("Should return a valid vp", async function () {
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
    const res = await devDIDs.connect(addr1).generateVp([1, 3], 5, 12);

    expect(res.vcs[0]).to.equal(1);

    expect(res.vcs[1]).to.equal(3);
  });

  it("Should reject generating a vp using other's vcs", async function () {
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

    await expect(devDIDs.generateVp([1, 3, 10], 5, 12)).to.be.revertedWith(
      "DevDIDs: all of the vcs must belong to you"
    );
  });

  it("Should fail if valid from for vp is later than valid to", async function () {
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
    await expect(
      devDIDs.connect(addr1).generateVp([1, 3], 12, 5)
    ).to.be.revertedWith(
      "DevDIDs: vp valid from must be greater than valid to"
    );
  });

  it("after Delete balance should be 2", async function () {
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
    await devDIDs.connect(addr1).delete_(2);
    expect(await devDIDs.balanceOf(addr1.address)).to.equal(2);
  });
});
