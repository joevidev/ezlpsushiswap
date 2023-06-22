import { ethers } from "hardhat";

async function main() {
  const sushiRouterAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
  const masterChefV1Address = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";
  const masterChefV2Address = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";

  const EzlpsushiswapFactory = await ethers.getContractFactory("ezlpsushiswap");
  const ezlpsushiswap = await EzlpsushiswapFactory.deploy(
    sushiRouterAddress,
    masterChefV1Address,
    masterChefV2Address
  );

  console.log("Contract deployment in progress...");
  await ezlpsushiswap.waitForDeployment();

  console.log(
    `ezlpsushiswap contract has been deployed to: ${ezlpsushiswap.target}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
