// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Минимальный интерфейс ERC20
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleDEX {
    address public owner;
    address public constant ZUZ_TOKEN = 0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31;
    address public constant PHILANTHROPY_WALLET = 0x742d35CC6634c0532925A3B844bC9E768c4E33A0;
    
    struct Pool {
        uint256 zuzReserve;
        uint256 ethReserve;
        uint256 totalLiquidity;
        mapping(address => uint256) liquidity;
    }
    
    Pool public pool;
    
    event LiquidityAdded(address indexed user, uint256 zuzAmount, uint256 ethAmount, uint256 liquidity);
    event LiquidityRemoved(address indexed user, uint256 zuzAmount, uint256 ethAmount, uint256 liquidity);
    event Swapped(address indexed user, bool zuzToEth, uint256 amountIn, uint256 amountOut, uint256 philanthropy);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Добавить ликвидность ZUZ/ETH
    function addLiquidity(uint256 zuzAmount, uint256 ethAmount) external payable returns (uint256 liquidity) {
        require(zuzAmount > 0, "ZUZ amount required");
        require(msg.value == ethAmount, "ETH amount must match");
        
        // Переводим ZUZ от пользователя
        require(IERC20(ZUZ_TOKEN).transferFrom(msg.sender, address(this), zuzAmount), "ZUZ transfer failed");
        
        // Рассчитываем ликвидность
        if (pool.totalLiquidity == 0) {
            liquidity = sqrt(zuzAmount * ethAmount);
        } else {
            uint256 liquidityZuz = (zuzAmount * pool.totalLiquidity) / pool.zuzReserve;
            uint256 liquidityEth = (ethAmount * pool.totalLiquidity) / pool.ethReserve;
            liquidity = liquidityZuz < liquidityEth ? liquidityZuz : liquidityEth;
        }
        
        require(liquidity > 0, "Insufficient liquidity");
        
        // Обновляем пул
        pool.zuzReserve += zuzAmount;
        pool.ethReserve += ethAmount;
        pool.totalLiquidity += liquidity;
        pool.liquidity[msg.sender] += liquidity;
        
        emit LiquidityAdded(msg.sender, zuzAmount, ethAmount, liquidity);
        return liquidity;
    }
    
    // Удалить ликвидность
    function removeLiquidity(uint256 liquidity) external returns (uint256 zuzAmount, uint256 ethAmount) {
        require(liquidity > 0, "Liquidity required");
        require(pool.liquidity[msg.sender] >= liquidity, "Insufficient liquidity");
        
        // Рассчитываем доли
        zuzAmount = (liquidity * pool.zuzReserve) / pool.totalLiquidity;
        ethAmount = (liquidity * pool.ethReserve) / pool.totalLiquidity;
        
        // Обновляем пул
        pool.zuzReserve -= zuzAmount;
        pool.ethReserve -= ethAmount;
        pool.totalLiquidity -= liquidity;
        pool.liquidity[msg.sender] -= liquidity;
        
        // Возвращаем токены
        require(IERC20(ZUZ_TOKEN).transfer(msg.sender, zuzAmount), "ZUZ return failed");
        payable(msg.sender).transfer(ethAmount);
        
        emit LiquidityRemoved(msg.sender, zuzAmount, ethAmount, liquidity);
        return (zuzAmount, ethAmount);
    }
    
    // Купить ZUZ за ETH
    function buyZuz() external payable returns (uint256 zuzAmount) {
        require(msg.value > 0, "ETH required");
        require(pool.zuzReserve > 0 && pool.ethReserve > 0, "No liquidity");
        
        // 1% филантропия
        uint256 philanthropy = msg.value / 100;
        uint256 amountInAfterFee = msg.value - philanthropy;
        
        // Рассчитываем по формуле x*y=k
        zuzAmount = (pool.zuzReserve * amountInAfterFee) / (pool.ethReserve + amountInAfterFee);
        require(zuzAmount > 0, "Insufficient output");
        
        // Обновляем резервы
        pool.ethReserve += amountInAfterFee;
        pool.zuzReserve -= zuzAmount;
        
        // Отправляем филантропию
        if (philanthropy > 0) {
            payable(PHILANTHROPY_WALLET).transfer(philanthropy);
        }
        
        // Отправляем ZUZ пользователю
        require(IERC20(ZUZ_TOKEN).transfer(msg.sender, zuzAmount), "ZUZ transfer failed");
        
        emit Swapped(msg.sender, false, msg.value, zuzAmount, philanthropy);
        return zuzAmount;
    }
    
    // Продать ZUZ за ETH
    function sellZuz(uint256 zuzAmount) external returns (uint256 ethAmount) {
        require(zuzAmount > 0, "ZUZ amount required");
        require(pool.zuzReserve > 0 && pool.ethReserve > 0, "No liquidity");
        
        // 1% филантропия
        uint256 philanthropy = zuzAmount / 100;
        uint256 amountInAfterFee = zuzAmount - philanthropy;
        
        // Рассчитываем по формуле x*y=k
        ethAmount = (pool.ethReserve * amountInAfterFee) / (pool.zuzReserve + amountInAfterFee);
        require(ethAmount > 0, "Insufficient output");
        
        // Переводим ZUZ от пользователя
        require(IERC20(ZUZ_TOKEN).transferFrom(msg.sender, address(this), zuzAmount), "ZUZ transfer failed");
        
        // Отправляем филантропию
        if (philanthropy > 0) {
            require(IERC20(ZUZ_TOKEN).transfer(PHILANTHROPY_WALLET, philanthropy), "Philanthropy transfer failed");
        }
        
        // Обновляем резервы
        pool.zuzReserve += amountInAfterFee;
        pool.ethReserve -= ethAmount;
        
        // Отправляем ETH пользователю
        payable(msg.sender).transfer(ethAmount);
        
        emit Swapped(msg.sender, true, zuzAmount, ethAmount, philanthropy);
        return ethAmount;
    }
    
    // Получить цену покупки ZUZ
    function getBuyPrice(uint256 ethAmount) external view returns (uint256) {
        if (pool.zuzReserve == 0 || pool.ethReserve == 0) return 0;
        uint256 amountInAfterFee = ethAmount * 99 / 100;
        return (pool.zuzReserve * amountInAfterFee) / (pool.ethReserve + amountInAfterFee);
    }
    
    // Получить цену продажи ZUZ
    function getSellPrice(uint256 zuzAmount) external view returns (uint256) {
        if (pool.zuzReserve == 0 || pool.ethReserve == 0) return 0;
        uint256 amountInAfterFee = zuzAmount * 99 / 100;
        return (pool.ethReserve * amountInAfterFee) / (pool.zuzReserve + amountInAfterFee);
    }
    
    // Получить информацию о пуле
    function getPoolInfo() external view returns (uint256 zuzReserve, uint256 ethReserve, uint256 totalLiquidity) {
        return (pool.zuzReserve, pool.ethReserve, pool.totalLiquidity);
    }
    
    // Получить ликвидность пользователя
    function getUserLiquidity(address user) external view returns (uint256) {
        return pool.liquidity[user];
    }
    
    // Вспомогательная функция для квадратного корня
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
    
    // Получить баланс контракта
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Получить баланс ZUZ контракта
    function getContractZUZBalance() external view returns (uint256) {
        return IERC20(ZUZ_TOKEN).balanceOf(address(this));
    }
    
    // Только владелец может вывести ETH (для emergency)
    function withdrawETH(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(amount);
    }
    
    // Принимаем ETH (для пополнения пула)
    receive() external payable {}
}
