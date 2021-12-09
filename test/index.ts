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

  describe("Issuer", async () => {
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
  });

  describe("Holder", async () => {
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
  });

  describe("Verifier", async () => {
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
});
