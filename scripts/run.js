const main = async() => {
  // compile the contract and generate its artifacts
  // hre - Hardhat Runtime Env, obj is built on the fly when running 'npx hardhat <...>'
  const messageBoardFactory = await hre.ethers.getContractFactory('MessageBoard');
  // spin up local Eth network for this contract
  const messageBoard = await messageBoardFactory.deploy();
  // the constructor runs when contract is on our local network
  await messageBoard.deployed();
  console.log(`Contract deployed to: ${messageBoard.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();