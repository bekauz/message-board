const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(`Deploying contracts with account ${deployer.address}`);
  console.log(`Account balance: ${accountBalance.toString()}`);

  const Token = await hre.ethers.getContractFactory('MessageBoard');
  const msgBoard = await Token.deploy();

  await msgBoard.deployed();

  console.log(`MessageBoard address: ${msgBoard.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();