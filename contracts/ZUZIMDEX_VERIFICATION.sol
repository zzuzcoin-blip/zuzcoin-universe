// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    modifier onlyOwner() {
        _checkOwner();
        _;
    }
    
    function owner() public view virtual returns (address) {
        return _owner;
    }
    
    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }
    
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }
    
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }
    
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _status;
    
    constructor() {
        _status = NOT_ENTERED;
    }
    
    modifier nonReentrant() {
        require(_status != ENTERED, "ReentrancyGuard: reentrant call");
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

contract ZUZIMDEX is Ownable, ReentrancyGuard {
    struct TokenPair {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        bool active;
    }
    
    address public charityWallet;
    uint256 public constant TRADING_FEE = 3;
    uint256 public constant CHARITY_FEE = 1;
    uint256 public totalCharityDonated;
    
    mapping(bytes32 => TokenPair) public tokenPairs;
    bytes32[] public pairList;
    
    event LiquidityAdded(address indexed provider, address tokenA, address tokenB, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, address tokenA, address tokenB, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed trader, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 charityAmount);
    event CharityDonated(address token, uint256 amount, uint256 timestamp);
    
    constructor() {
        charityWallet = msg.sender; // Временно владелец, потом можно изменить
    }
    
    function setCharityWallet(address _newWallet) external onlyOwner {
        charityWallet = _newWallet;
    }
    
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
    
    function addLiquidity(address _tokenA, address _tokenB, uint256 _amountA, uint256 _amountB) external nonReentrant {
        require(_amountA > 0 && _amountB > 0, "Amounts must be > 0");
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        
        uint256 liquidity;
        if (pair.totalLiquidity == 0) {
            liquidity = sqrt(_amountA * _amountB);
        } else {
            liquidity = min((_amountA * pair.totalLiquidity) / pair.reserveA, (_amountB * pair.totalLiquidity) / pair.reserveB);
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        pair.reserveA += _amountA;
        pair.reserveB += _amountB;
        pair.totalLiquidity += liquidity;
        
        emit LiquidityAdded(msg.sender, _tokenA, _tokenB, _amountA, _amountB, liquidity);
    }
    
    function swap(address _tokenIn, address _tokenOut, uint256 _amountIn) external nonReentrant returns (uint256) {
        require(_amountIn > 0, "Amount must be > 0");
        bytes32 pairId = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        
        uint256 amountInWithFee = _amountIn * (1000 - TRADING_FEE - CHARITY_FEE) / 1000;
        uint256 charityAmount = _amountIn * CHARITY_FEE / 1000;
        
        uint256 numerator = amountInWithFee * pair.reserveB;
        uint256 denominator = pair.reserveA + amountInWithFee;
        uint256 amountOut = numerator / denominator;
        
        require(amountOut > 0, "Insufficient output amount");
        require(amountOut <= pair.reserveB, "Insufficient liquidity");
        
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        
        if (charityAmount > 0) {
            IERC20(_tokenIn).transfer(charityWallet, charityAmount);
            totalCharityDonated += charityAmount;
            emit CharityDonated(_tokenIn, charityAmount, block.timestamp);
        }
        
        IERC20(_tokenOut).transfer(msg.sender, amountOut);
        pair.reserveA += amountInWithFee;
        pair.reserveB -= amountOut;
        
        emit Swap(msg.sender, _tokenIn, _tokenOut, _amountIn, amountOut, charityAmount);
        return amountOut;
    }
    
    function getSwapQuote(address _tokenIn, address _tokenOut, uint256 _amountIn) external view returns (uint256 amountOut, uint256 charityAmount) {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        TokenPair storage pair = tokenPairs[pairId];
        
        if (!pair.active || _amountIn == 0) return (0, 0);
        
        uint256 amountInWithFee = _amountIn * (1000 - TRADING_FEE - CHARITY_FEE) / 1000;
        charityAmount = _amountIn * CHARITY_FEE / 1000;
        amountOut = (amountInWithFee * pair.reserveB) / (pair.reserveA + amountInWithFee);
        
        return (amountOut, charityAmount);
    }
    
    function getReserves(address _tokenA, address _tokenB) external view returns (uint256 reserveA, uint256 reserveB) {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        return (pair.reserveA, pair.reserveB);
    }
    
    function removeLiquidity(address _tokenA, address _tokenB, uint256 _liquidity) external nonReentrant {
        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        TokenPair storage pair = tokenPairs[pairId];
        require(pair.active, "Pair not active");
        require(_liquidity > 0 && _liquidity <= pair.totalLiquidity, "Invalid liquidity");
        
        uint256 amountA = (_liquidity * pair.reserveA) / pair.totalLiquidity;
        uint256 amountB = (_liquidity * pair.reserveB) / pair.totalLiquidity;
        require(amountA > 0 && amountB > 0, "Insufficient liquidity");
        
        pair.reserveA -= amountA;
        pair.reserveB -= amountB;
        pair.totalLiquidity -= _liquidity;
        
        IERC20(_tokenA).transfer(msg.sender, amountA);
        IERC20(_tokenB).transfer(msg.sender, amountB);
        
        emit LiquidityRemoved(msg.sender, _tokenA, _tokenB, amountA, amountB, _liquidity);
    }
    
    function getAllPairs() external view returns (TokenPair[] memory) {
        TokenPair[] memory pairs = new TokenPair[](pairList.length);
        for (uint256 i = 0; i < pairList.length; i++) {
            pairs[i] = tokenPairs[pairList[i]];
        }
        return pairs;
    }
    
    function rescueTokens(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
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
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
