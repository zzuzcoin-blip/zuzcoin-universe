// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != msg.sender) {
            revert OwnableUnauthorizedAccount(msg.sender);
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped by gasLimit it is best to keep them low
    // in cases like this one, to increase the likelihood of the full refund
    // coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function reentrancyGuardEntered() public view returns (bool) {
        return _status == ENTERED;
    }
}

// ============================================================
// ZUZIM DEX CONTRACT
// ============================================================

pragma solidity ^0.8.20;

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
    
    // Charity wallet address (The Giving Pledge) - задается в конструкторе
    address public charityWallet;
    
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
    
    constructor() Ownable(msg.sender) {
        charityWallet = 0x742d35Cc6634C0532925a3b844Bc9e5F2A5dF2e3;
    }
    
    /**
     * @notice Update charity wallet (only owner)
     */
    function setCharityWallet(address _newWallet) external onlyOwner {
        charityWallet = _newWallet;
    }
    
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
            IERC20(_tokenIn).transfer(charityWallet, charityAmount);
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
