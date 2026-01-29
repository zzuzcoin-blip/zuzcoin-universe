# 🚀 ZUZCOIN Universe - Deployment Guide

## 📋 Prerequisites

### 1. Install Dependencies
```bash
npm install
# 1. СОЗДАЕМ КОНТРАКТ ПРОСТОГО AMM (Uniswap V2 стиль)
cat > contracts/ZUZIMDEX.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZUZIMDEX {
    // Структура для пула ликвидности
    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        mapping(address => uint256) liquidity;
    }
    
    // Мэппинг пулов
    mapping(bytes32 => Pool) public pools;
    mapping(address => mapping(address => bytes32)) public poolKeys;
    
    // События
    event PoolCreated(address indexed tokenA, address indexed tokenB, bytes32 poolId);
    event LiquidityAdded(address indexed user, bytes32 indexed poolId, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed user, bytes32 indexed poolId, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed user, bytes32 indexed poolId, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    
    // 1% филантропия адрес
    address public constant PHILANTHROPY_WALLET = 0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0;
    
    // Создать пул
    function createPool(address tokenA, address tokenB) external returns (bytes32 poolId) {
        require(tokenA != tokenB, "Same tokens");
        require(tokenA != address(0) && tokenB != address(0), "Zero address");
        
        // Сортировка токенов для уникального ID
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        poolId = keccak256(abi.encodePacked(token0, token1));
        
        require(pools[poolId].tokenA == address(0), "Pool exists");
        
        pools[poolId].tokenA = token0;
        pools[poolId].tokenB = token1;
        poolKeys[token0][token1] = poolId;
        poolKeys[token1][token0] = poolId;
        
        emit PoolCreated(token0, token1, poolId);
    }
    
    // Добавить ликвидность
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired
    ) external returns (uint256 liquidity) {
        require(amountADesired > 0 && amountBDesired > 0, "Zero amount");
        
        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(pools[poolId].tokenA != address(0), "Pool not exists");
        
        Pool storage pool = pools[poolId];
        
        // Переводим токены от пользователя
        IERC20(pool.tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(pool.tokenB).transferFrom(msg.sender, address(this), amountBDesired);
        
        // Рассчитываем ликвидность (простая формула)
        if (pool.totalLiquidity == 0) {
            liquidity = sqrt(amountADesired * amountBDesired);
        } else {
            uint256 liquidityA = (amountADesired * pool.totalLiquidity) / pool.reserveA;
            uint256 liquidityB = (amountBDesired * pool.totalLiquidity) / pool.reserveB;
            liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
        }
        
        require(liquidity > 0, "Insufficient liquidity");
        
        // Обновляем резервы
        pool.reserveA += amountADesired;
        pool.reserveB += amountBDesired;
        pool.totalLiquidity += liquidity;
        pool.liquidity[msg.sender] += liquidity;
        
        emit LiquidityAdded(msg.sender, poolId, amountADesired, amountBDesired, liquidity);
    }
    
    // Удалить ликвидность
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity
    ) external returns (uint256 amountA, uint256 amountB) {
        require(liquidity > 0, "Zero liquidity");
        
        bytes32 poolId = getPoolId(tokenA, tokenB);
        Pool storage pool = pools[poolId];
        
        require(pool.liquidity[msg.sender] >= liquidity, "Insufficient liquidity");
        
        // Рассчитываем доли
        amountA = (liquidity * pool.reserveA) / pool.totalLiquidity;
        amountB = (liquidity * pool.reserveB) / pool.totalLiquidity;
        
        // Обновляем состояние
        pool.reserveA -= amountA;
        pool.reserveB -= amountB;
        pool.totalLiquidity -= liquidity;
        pool.liquidity[msg.sender] -= liquidity;
        
        // Возвращаем токены пользователю
        IERC20(pool.tokenA).transfer(msg.sender, amountA);
        IERC20(pool.tokenB).transfer(msg.sender, amountB);
        
        emit LiquidityRemoved(msg.sender, poolId, amountA, amountB, liquidity);
    }
    
    // Обмен токенов с 1% филантропией
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        require(amountIn > 0, "Zero amount");
        
        bytes32 poolId = getPoolId(tokenIn, tokenOut);
        Pool storage pool = pools[poolId];
        
        // Определяем какие токены в резервах
        bool isTokenAIn = tokenIn == pool.tokenA;
        uint256 reserveIn = isTokenAIn ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = isTokenAIn ? pool.reserveB : pool.reserveA;
        
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        // 1% филантропия
        uint256 philanthropyAmount = amountIn / 100;
        uint256 amountInAfterFee = amountIn - philanthropyAmount;
        
        // Рассчитываем вывод по формуле x*y=k
        amountOut = (reserveOut * amountInAfterFee) / (reserveIn + amountInAfterFee);
        require(amountOut > 0, "Insufficient output");
        
        // Переводим токен входа
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Отправляем 1% на филантропию
        IERC20(tokenIn).transfer(PHILANTHROPY_WALLET, philanthropyAmount);
        
        // Обновляем резервы
        if (isTokenAIn) {
            pool.reserveA += amountInAfterFee;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountInAfterFee;
            pool.reserveA -= amountOut;
        }
        
        // Отправляем токен выхода пользователю
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        emit Swap(msg.sender, poolId, tokenIn, tokenOut, amountIn, amountOut);
    }
    
    // Получить цену
    function getPrice(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        bytes32 poolId = getPoolId(tokenIn, tokenOut);
        Pool storage pool = pools[poolId];
        
        if (pool.reserveA == 0 || pool.reserveB == 0) return 0;
        
        bool isTokenAIn = tokenIn == pool.tokenA;
        uint256 reserveIn = isTokenAIn ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = isTokenAIn ? pool.reserveB : pool.reserveA;
        
        // Учитываем 1% fee
        uint256 amountInAfterFee = amountIn * 99 / 100;
        amountOut = (reserveOut * amountInAfterFee) / (reserveIn + amountInAfterFee);
    }
    
    // Получить информацию о пуле
    function getPoolInfo(address tokenA, address tokenB) external view returns (
        uint256 reserveA,
        uint256 reserveB,
        uint256 totalLiquidity
    ) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        Pool storage pool = pools[poolId];
        
        // Возвращаем в правильном порядке
        if (tokenA == pool.tokenA) {
            return (pool.reserveA, pool.reserveB, pool.totalLiquidity);
        } else {
            return (pool.reserveB, pool.reserveA, pool.totalLiquidity);
        }
    }
    
    // Получить ликвидность пользователя
    function getUserLiquidity(address tokenA, address tokenB, address user) external view returns (uint256) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        return pools[poolId].liquidity[user];
    }
    
    // Вспомогательные функции
    function getPoolId(address tokenA, address tokenB) public pure returns (bytes32) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encodePacked(token0, token1));
    }
    
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
