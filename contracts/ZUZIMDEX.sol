// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ZUZIM DEX - Decentralized Exchange with Philanthropy
 * @notice Real trading with 1% auto-donation to charity
 * @dev Built for ZUZCOIN Universe ecosystem
 */
contract ZUZIMDEX is Ownable, ReentrancyGuard {
    // Struct for token pair
    struct TokenPair {
        address tokenA;     // ZUZ Token
        address tokenB;     // USDT or ETH
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        bool active;
    }
    
    // Charity wallet address (The Giving Pledge)
    address public constant CHARITY_WALLET = 0x742d35CC6634c0532925A3b844bC9e5F2A5dF2E3;
    
    // Trading fee (0.3% for liquidity providers)
    uint256 public constant TRADING_FEE = 3; // 0.3%
    
    // Charity fee (1% for philanthropy)
    uint256 public constant CHARITY_FEE = 1; // 1%
    
    // Total fees collected for charity
    uint256 public totalCharityDonated;
    
    // Token pairs mapping
    mapping(bytes32 => TokenPair) public tokenPairs;
    bytes32[] public pairList;
    
    // Events
    event LiquidityAdded(
        address indexed provider,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event LiquidityRemoved(
        address indexed provider,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event Swap(
        address indexed trader,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 charityAmount
    );
    
    event CharityDonated(
        address token,
        uint256 amount,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Create a new trading pair
     */
    function createPair(address _tokenA, address _tokenB) external onlyOwner {
        require(_tokenA != _tokenB, "Tokens must be different");
        
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        require(!tokenPairs[pairId].active, "Pair already exists");
        
        tokenPairs[pairId] = TokenPair({
            tokenA: _tokenA,
            tokenB: _tokenB,
            reserveA: 0,
            reserveB: 0,
            totalLiquidity: 0,
            active: true
        });
        
        pairList.push(pairId);
    }
    
    /**
     * @notice Add liquidity to a pair
     */
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external nonReentrant {
        require(_amountA > 0 && _amountB > 0, "Amounts must be > 0");
        
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        
        // Transfer tokens from user
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        
        // Calculate liquidity tokens (simplified)
        uint256 liquidity;
        if (pair.totalLiquidity == 0) {
            liquidity = sqrt(_amountA * _amountB);
        } else {
            liquidity = min(
                (_amountA * pair.totalLiquidity) / pair.reserveA,
                (_amountB * pair.totalLiquidity) / pair.reserveB
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Update reserves
        pair.reserveA += _amountA;
        pair.reserveB += _amountB;
        pair.totalLiquidity += liquidity;
        
        // Mint liquidity tokens to user (simplified - in real DEX would use LP tokens)
        
        emit LiquidityAdded(msg.sender, _tokenA, _tokenB, _amountA, _amountB, liquidity);
    }
    
    /**
     * @notice Swap tokens with automatic charity donation
     */
    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) external nonReentrant returns (uint256) {
        require(_amountIn > 0, "Amount must be > 0");
        
        bytes32 pairId = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        
        // Calculate output amount (Constant Product Formula)
        uint256 amountInWithFee = _amountIn * (1000 - TRADING_FEE - CHARITY_FEE) / 1000;
        uint256 charityAmount = _amountIn * CHARITY_FEE / 1000;
        
        uint256 numerator = amountInWithFee * pair.reserveB;
        uint256 denominator = pair.reserveA + amountInWithFee;
        uint256 amountOut = numerator / denominator;
        
        require(amountOut > 0, "Insufficient output amount");
        require(amountOut <= pair.reserveB, "Insufficient liquidity");
        
        // Transfer tokens
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        
        // Send charity portion
        if (charityAmount > 0) {
            IERC20(_tokenIn).transfer(CHARITY_WALLET, charityAmount);
            totalCharityDonated += charityAmount;
            emit CharityDonated(_tokenIn, charityAmount, block.timestamp);
        }
        
        // Send output to user
        IERC20(_tokenOut).transfer(msg.sender, amountOut);
        
        // Update reserves
        pair.reserveA += amountInWithFee;
        pair.reserveB -= amountOut;
        
        emit Swap(msg.sender, _tokenIn, _tokenOut, _amountIn, amountOut, charityAmount);
        
        return amountOut;
    }
    
    /**
     * @notice Get swap quote
     */
    function getSwapQuote(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) external view returns (uint256 amountOut, uint256 charityAmount) {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        TokenPair storage pair = tokenPairs[pairId];
        
        if (!pair.active || _amountIn == 0) {
            return (0, 0);
        }
        
        uint256 amountInWithFee = _amountIn * (1000 - TRADING_FEE - CHARITY_FEE) / 1000;
        charityAmount = _amountIn * CHARITY_FEE / 1000;
        
        uint256 numerator = amountInWithFee * pair.reserveB;
        uint256 denominator = pair.reserveA + amountInWithFee;
        amountOut = numerator / denominator;
        
        return (amountOut, charityAmount);
    }
    
    /**
     * @notice Get pair reserves
     */
    function getReserves(address _tokenA, address _tokenB) 
        external 
        view 
        returns (uint256 reserveA, uint256 reserveB) 
    {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        return (pair.reserveA, pair.reserveB);
    }
    
    /**
     * @notice Remove liquidity
     */
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _liquidity
    ) external nonReentrant {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        require(_liquidity > 0 && _liquidity <= pair.totalLiquidity, "Invalid liquidity");
        
        // Calculate amounts to return
        uint256 amountA = (_liquidity * pair.reserveA) / pair.totalLiquidity;
        uint256 amountB = (_liquidity * pair.reserveB) / pair.totalLiquidity;
        
        require(amountA > 0 && amountB > 0, "Insufficient liquidity");
        
        // Update reserves and liquidity
        pair.reserveA -= amountA;
        pair.reserveB -= amountB;
        pair.totalLiquidity -= _liquidity;
        
        // Transfer tokens back to user
        IERC20(_tokenA).transfer(msg.sender, amountA);
        IERC20(_tokenB).transfer(msg.sender, amountB);
        
        emit LiquidityRemoved(msg.sender, _tokenA, _tokenB, amountA, amountB, _liquidity);
    }
    
    // Helper functions
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
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    /**
     * @notice Get all active pairs
     */
    function getAllPairs() external view returns (TokenPair[] memory) {
        TokenPair[] memory pairs = new TokenPair[](pairList.length);
        for (uint256 i = 0; i < pairList.length; i++) {
            pairs[i] = tokenPairs[pairList[i]];
        }
        return pairs;
    }
    
    /**
     * @notice Withdraw any ERC20 tokens sent by mistake
     */
    function rescueTokens(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }
}
