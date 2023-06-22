// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Router02.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Factory.sol";
import "@sushiswap/masterchef/contracts/MasterChef.sol" as SushiMasterChefV1;
import "@sushiswap/masterchef/contracts/MasterChefV2.sol" as SushiMasterChefV2;

contract ezlpsushiswap {
    IUniswapV2Router02 public sushiRouter;
    SushiMasterChefV1.MasterChef public masterChefV1;
    SushiMasterChefV2.MasterChefV2 public masterChefV2;
    address public owner;

    constructor(
        address _sushiRouter,
        address _masterChefV1,
        address _masterChefV2
    ) public {
        sushiRouter = IUniswapV2Router02(_sushiRouter);
        masterChefV1 = SushiMasterChefV1.MasterChef(_masterChefV1);
        masterChefV2 = SushiMasterChefV2.MasterChefV2(_masterChefV2);
        owner = msg.sender;
    }

    function joinSushiLiquidityProgram(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB,
        uint256 _pid,
        bool useV2
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(address(sushiRouter), _amountA);
        IERC20(_tokenB).approve(address(sushiRouter), _amountB);

        sushiRouter.addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            0,
            0,
            address(this),
            block.timestamp + 1
        );

        IUniswapV2Factory sushiFactory = IUniswapV2Factory(
            sushiRouter.factory()
        );

        address lpToken = sushiFactory.getPair(_tokenA, _tokenB);
        uint256 lpBalance = IERC20(lpToken).balanceOf(address(this));

        require(lpBalance > 0, "No liquidity tokens received");

        IERC20(lpToken).approve(address(masterChefV1), lpBalance);
        IERC20(lpToken).approve(address(masterChefV2), lpBalance);

        if (useV2) {
            masterChefV2.deposit(_pid, lpBalance, msg.sender);
        } else {
            masterChefV1.deposit(_pid, lpBalance);
        }
    }

    function withdrawLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _pid,
        uint256 _amount,
        bool useV2
    ) external {
        if (useV2) {
            masterChefV2.withdraw(_pid, _amount, msg.sender);
        } else {
            masterChefV1.withdraw(_pid, _amount);
        }

        IUniswapV2Factory sushiFactory = IUniswapV2Factory(
            sushiRouter.factory()
        );
        address lpToken = sushiFactory.getPair(_tokenA, _tokenB);
        uint256 lpBalance = IERC20(lpToken).balanceOf(address(this));

        IERC20(lpToken).transfer(msg.sender, lpBalance);

        sushiRouter.removeLiquidity(
            _tokenA,
            _tokenB,
            lpBalance,
            0,
            0,
            msg.sender,
            block.timestamp + 1
        );
    }

    function emergencyWithdraw(uint256 _pid, bool useV2) external {
        if (useV2) {
            masterChefV2.emergencyWithdraw(_pid, msg.sender);
        } else {
            masterChefV1.emergencyWithdraw(_pid);
        }
    }
}
