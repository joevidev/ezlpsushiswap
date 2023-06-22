## EzLPSushiSwap Overview

This project aims to provide a smart contract acting as a wallet to simplify the process of joining the SushiSwap liquidity mining program. The wallet encapsulates all the necessary actions into a single transaction, thus saving time and reducing gas costs. The smart contract is compatible with both MasterChefV1 and MasterChefV2, and it can work with any pair of tokens.

## Dependencies

The project relies on a few external libraries:

- "@openzeppelin/contracts": For ERC20 token standard interface.
- "@sushiswap/core": For the Uniswap v2 Router and Factory interfaces.
- "@sushiswap/masterchef": For the MasterChef v1 and v2 contracts.

## Contract Description

The `ezlpsushiswap.sol` contract allows a user to join the SushiSwap liquidity program with any pair of tokens. The contract also allows a user to withdraw their liquidity from the program.

Here is a brief description of the contract's functions:

- `joinSushiLiquidityProgram`: This function is used to join the SushiSwap liquidity program. It takes as parameters the addresses of the two tokens to be used, the amounts of each token to be added to the liquidity pool, the ID of the pool, and a boolean indicating whether to use MasterChefV2.
- `withdrawLiquidity`: This function is used to withdraw liquidity from the SushiSwap program. It takes as parameters the addresses of the two tokens used in the liquidity pool, the ID of the pool, the amount to be withdrawn, and a boolean indicating whether to use MasterChefV2.
- `emergencyWithdraw`: This function is used to make an emergency withdrawal from the SushiSwap program. It takes as parameters the ID of the pool and a boolean indicating whether to use MasterChefV2.

## Testing

The project includes tests covering all the functionalities of the contract. The tests are written using Chai and Sinon. The tests are located in the `test` directory.

## Usage

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies with `npm install`
4. Compile the contract with `npx hardhat compile`
5. To deploy `npx hardhat run scripts/deploy.ts --network <network>`
