// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { artifacts, ethers } from "hardhat";
import { BaseContract } from "ethers";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners(); // get the account to deploy the contract
  console.log("Deploying contracts with the account:", deployer.address);

  // We get the contract to deploy
  const DevDIDs = await ethers.getContractFactory("DevDIDs");
  const devDIDs = await DevDIDs.deploy();

  await devDIDs.deployed();

  console.log("DevDIDs deployed to:", devDIDs.address);

  saveDeployedData(devDIDs);
}

function saveDeployedData(contract: BaseContract) {
  const fs = require("fs");
  const path = require("path");

  const contractsDir = path.join(__dirname, "..", "deployedData");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ DevDIDs: contract.address }, undefined, 2)
  );

  const DevDIDsArtifact = artifacts.readArtifactSync("DevDIDs");

  fs.writeFileSync(
    contractsDir + "/DevDIDs.json",
    JSON.stringify(DevDIDsArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
