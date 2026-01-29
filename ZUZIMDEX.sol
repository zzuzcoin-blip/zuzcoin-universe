// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * ZUZIM DEX - Decentralized Exchange with Philanthropy
 * Simple AMM with automatic charity donations
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZUZIMDEX is Ownable {
    address public constant PHILANTHROPY_WALLET = 0x742d35Cc6634C0532925a3b844Bc9e5F2A5dF2e3;
    
    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        mapping(address => uint256) liquidity;
    }
    
    mapping(uint256 => Pool) public pools;
    uint256 public poolCount;
    
    event PoolCreated(uint256 indexed poolId, address tokenA, address tokenB);
    event LiquidityAdded(uint256 indexed poolId, address provider, uint256 amountA, uint256 amountB);
    event Swap(uint256 indexed poolId, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 donation);
    event Donation(uint256 indexed poolId, address token, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * Create a new liquidity pool
     */
    function createPool(address tokenA, address tokenB) external returns (uint256) {
        require(tokenA != tokenB, "Cannot create pool with same tokens");
        
        poolCount++;
        Pool storage pool = pools[poolCount];
        pool.tokenA = tokenA;
        pool.tokenB = tokenB;
        
        emit PoolCreated(poolCount, tokenA, tokenB);
        return poolCount;
    }
    
    /**
     * Add liquidity to a pool
     */
    function addLiquidity(uint256 poolId, uint256 amountA, uint256 amountB) external {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool does not exist");
        
        // Transfer tokens from user
        IERC20(pool.tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(pool.tokenB).transferFrom(msg.sender, address(this), amountB);
        
        // Update reserves
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        
        // Calculate and mint liquidity tokens
        uint256 liquidity = sqrt(amountA * amountB);
        pool.liquidity[msg.sender] += liquidity;
        pool.totalLiquidity += liquidity;
        
        emit LiquidityAdded(poolId, msg.sender, amountA, amountB);
    }
    
    /**
     * Swap tokens with 1% philanthropy fee
     */
    function swap(uint256 poolId, address tokenIn, uint256 amountIn) external returns (uint256) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool does not exist");
        require(tokenIn == pool.tokenA || tokenIn == pool.tokenB, "Invalid token");
        
        address tokenOut = (tokenIn == pool.tokenA) ? pool.tokenB : pool.tokenA;
        
        // Calculate output using constant product formula
        uint256 reserveIn = (tokenIn == pool.tokenA) ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = (tokenIn == pool.tokenA) ? pool.reserveB : pool.reserveA;
        
        // Calculate output amount (0.3% fee + 1% philanthropy)
        uint256 amountInWithFee = amountIn * 997 / 1000; // 0.3% DEX fee
        uint256 donation = amountIn / 100; // 1% philanthropy
        uint256 amountInAfterDonation = amountIn - donation;
        
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn + amountInWithFee;
        uint256 amountOut = numerator / denominator;
        
        require(amountOut > 0, "Insufficient output amount");
        
        // Transfer tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInAfterDonation);
        IERC20(tokenIn).transferFrom(msg.sender, PHILANTHROPY_WALLET, donation);
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        // Update reserves
        if (tokenIn == pool.tokenA) {
            pool.reserveA += amountInAfterDonation;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountInAfterDonation;
            pool.reserveA -= amountOut;
        }
        
        emit Swap(poolId, tokenIn, tokenOut, amountIn, amountOut, donation);
        emit Donation(poolId, tokenIn, donation);
        
        return amountOut;
    }
    
    /**
     * Remove liquidity
     */
    function removeLiquidity(uint256 poolId, uint256 liquidity) external {
        Pool storage pool = pools[poolId];
        require(pool.liquidity[msg.sender] >= liquidity, "Insufficient liquidity");
        
        // Calculate token amounts
        uint256 amountA = (liquidity * pool.reserveA) / pool.totalLiquidity;
        uint256 amountB = (liquidity * pool.reserveB) / pool.totalLiquidity;
        
        // Update reserves and liquidity
        pool.reserveA -= amountA;
        pool.reserveB -= amountB;
        pool.liquidity[msg.sender] -= liquidity;
        pool.totalLiquidity -= liquidity;
        
        // Transfer tokens back to user
        IERC20(pool.tokenA).transfer(msg.sender, amountA);
        IERC20(pool.tokenB).transfer(msg.sender, amountB);
    }
    
    /**
     * Get pool info
     */
    function getPoolInfo(uint256 poolId) external view returns (
        address tokenA,
        address tokenB,
        uint256 reserveA,
        uint256 reserveB,
        uint256 totalLiquidity
    ) {
        Pool storage pool = pools[poolId];
        return (
            pool.tokenA,
            pool.tokenB,
            pool.reserveA,
            pool.reserveB,
            pool.totalLiquidity
        );
    }
    
    /**
     * Get user liquidity
     */
    function getUserLiquidity(uint256 poolId, address user) external view returns (uint256) {
        return pools[poolId].liquidity[user];
    }
    
    /**
     * Square root function
     */
    function sqrt(uint256 x) private pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
