const main = async() => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  // compile the contract and generate its artifacts
  // hre - Hardhat Runtime Env, obj is built on the fly when running 'npx hardhat <...>'
  const messageBoardContractFactory = await hre.ethers.getContractFactory('MessageBoard');
  // spin up local Eth network for this contract
  const messageBoardContract = await messageBoardContractFactory.deploy();
  // the constructor runs when contract is on our local network
  await messageBoardContract.deployed();

  console.log(`Contract deployed to: ${messageBoardContract.address}`);
  console.log(`Contract deployed by: ${owner.address}`);

  // try to submit posts from multiple addresses
  let postCount = await messageBoardContract.getPostCount();

  let postTxn = await messageBoardContract.post();
  await postTxn.wait();

  postCount = await messageBoardContract.getPostCount();

  postTxn = await messageBoardContract.connect(randomPerson).post();
  await postTxn.wait();

  postCount = await messageBoardContract.getPostCount();
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