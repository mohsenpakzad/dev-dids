import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { DevDIDs } from "../typechain";

describe("Issuer", async () => {
  let devDIDs: DevDIDs;

  beforeEach(async () => {
    const DevDIDs = await ethers.getContractFactory("DevDIDs");
    devDIDs = await DevDIDs.deploy();
    await devDIDs.deployed();
  });

  it("The Balance should be equal to three", async function () {
    const [, addr1] = await ethers.getSigners();

    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has got driving license",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed her course",
      5,
      20
    );

    expect(await devDIDs.balanceOf(addr1.address)).to.equal(3);
  });

  it("The number of holder vcs should be equal to three", async function () {
    const [, addr1] = await ethers.getSigners();

    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has got driving license",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed her course",
      5,
      20
    );

    expect((await devDIDs.vcsOfHolder(addr1.address)).length).to.equal(3);
  });

  it("should return address of owner of vc1 addr1", async function () {
    const [, addr1] = await ethers.getSigners();

    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint",
      5,
      20
    );
    expect(await devDIDs.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should fail when self issuing", async function () {
    const [owner] = await ethers.getSigners();
    await expect(
      devDIDs.issue(
        owner.address,
        "Zahra MohammadPour",
        "Has completed first sprint",
        5,
        20
      )
    ).to.be.revertedWith("DevDIDs: self issuing is not permitted");
  });

  it("Should fail if valid from is later than valid to", async function () {
    const [, addr1] = await ethers.getSigners();
    await expect(
      devDIDs.issue(
        addr1.address,
        "Zahra MohammadPour",
        "Has completed first sprint",
        20,
        5
      )
    ).to.be.revertedWith(
      "DevDIDs: vc valid from must be greater than valid to"
    );
  });

  it("Should Revoke The VC and User's balance should be 2", async function () {
    const [, addr1] = await ethers.getSigners();
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed first sprint",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has got driving license",
      5,
      20
    );
    await devDIDs.issue(
      addr1.address,
      "Zahra MohammadPour",
      "Has completed her course",
      5,
      20
    );
    await devDIDs.revoke(2);
    expect(await devDIDs.balanceOf(addr1.address)).to.equal(2);
  });
});
