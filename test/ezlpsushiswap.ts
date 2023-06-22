import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import chai, { expect } from "chai";
import { ethers as ethHardhat } from "hardhat";
import { ethers } from "ethers";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("ezlpsushiswap", function () {
  async function deployezlpsushiswapFixture() {
    const [owner, otherAccount] = await ethHardhat.getSigners();

    /* const sushiRouterAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
    const masterChefV1Address = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";
    const masterChefV2Address = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d"; */

    const sushiSwapMock = await ethHardhat.getContractFactory("SushiSwapMock");
    const sushiSwapMockInstance =
      (await sushiSwapMock.deploy()) as ethers.Contract;

    await sushiSwapMockInstance.deployed();

    const masterChefV1Mock = await ethHardhat.getContractFactory(
      "MasterChefV1Mock"
    );
    const masterChefV1MockInstance =
      (await masterChefV1Mock.deploy()) as ethers.Contract;
    await masterChefV1MockInstance.deployed();

    const masterChefV2Mock = await ethHardhat.getContractFactory(
      "MasterChefV2Mock"
    );
    const masterChefV2MockInstance =
      (await masterChefV2Mock.deploy()) as ethers.Contract;
    await masterChefV2MockInstance.deployed();

    const ezlpsushiswap = await ethHardhat.getContractFactory("ezlpsushiswap");
    const contract = (await ezlpsushiswap.deploy(
      sushiSwapMockInstance.getAddress(),
      masterChefV1MockInstance.getAddress(),
      masterChefV2MockInstance.getAddress()
    )) as any;

    return {
      contract,
      owner,
      otherAccount,
      sushiSwapMock: sushiSwapMockInstance,
      masterChefV1Mock: masterChefV1MockInstance,
      masterChefV2Mock: masterChefV2MockInstance,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployezlpsushiswapFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Liquidity Program", function () {
    it("Should join the SushiSwap liquidity program", async function () {
      const {
        contract,
        owner,
        sushiSwapMock,
        masterChefV1Mock,
        masterChefV2Mock,
      } = await loadFixture(deployezlpsushiswapFixture);

      const addLiquiditySpy = sinon.spy(sushiSwapMock, "addLiquidity");
      const depositV1Spy = sinon.spy(masterChefV1Mock, "deposit");
      const depositV2Spy = sinon.spy(masterChefV2Mock, "deposit");

      await contract
        .connect(owner)
        .joinSushiLiquidityProgram("tokenA", "tokenB", 100, 200, 1, true);

      expect(addLiquiditySpy).calledWithMatch("tokenA", "tokenB", 100, 200);
      expect(depositV1Spy).calledWithMatch(1, 100);
      expect(depositV2Spy).calledWithMatch(1, 100);
    });

    it("Should withdraw liquidity", async function () {
      const { contract, owner, masterChefV1Mock, masterChefV2Mock } =
        await loadFixture(deployezlpsushiswapFixture);
      const withdrawV1Spy = sinon.spy(masterChefV1Mock, "withdraw");
      const leaveStakingV1Spy = sinon.spy(masterChefV1Mock, "leaveStaking");
      const withdrawV2Spy = sinon.spy(masterChefV2Mock, "withdraw");
      const leaveStakingV2Spy = sinon.spy(masterChefV2Mock, "leaveStaking");
      await contract
        .connect(owner)
        .withdrawLiquidity("tokenA", "tokenB", 1, 50, true);
      expect(withdrawV1Spy).calledWithMatch(1, 50);
      expect(leaveStakingV1Spy).calledWithMatch(50);
      expect(withdrawV2Spy).calledWithMatch(1, 50);
      expect(leaveStakingV2Spy).calledWithMatch(50);
    });
  });
});
