# Overview

ProofChain PRO is an enhanced blockchain-based digital notary service for creators with international payment support. It provides a web interface where users can register copyright proofs for their creative works using multiple currencies (RUB, USD, EUR, USDT, BTC, ETH), storing them permanently in a blockchain. Each registration costs 100 rubles with automatic currency conversion and payment processing fees.

# Recent Changes

**September 30, 2025**: Upgraded to ProofChain PRO v2.0 with international payment system supporting 6 currencies (RUB, USD, EUR, USDT, BTC, ETH), enhanced blockchain with transaction support, payment history tracking, blockchain statistics display, and improved fee calculation logic with proper handling of percentage fees, flat fees, and crypto fees.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Application Components

### Web Interface (index.html)
- **Blockchain Statistics**: Real-time display of blocks, transactions, and chain validity status
- **User Account Management**: Shows user ID and balance in RUB
- **International Payment System**: Currency selector (RUB, USD, EUR, USDT, BTC, ETH) with 4 payment methods
- **Payment Methods**: Bank card (RUB), Stripe (USD/EUR), USDT (TRC20), Bitcoin
- **Copyright Registration**: Form to submit creative work with description (100 RUB per registration)
- **History Dashboard**: Combined view of registered proofs and payment history
- **Design**: Enhanced card-based layout with gradient background and statistics grid

### Backend Server (server.js)
- **Framework**: Express.js running on port 5000
- **Static File Serving**: Serves frontend HTML/CSS/JS from root directory
- **In-Memory Storage**: Users, proofs, blockchain, and payment history stored in server memory

## Blockchain Implementation

### Block Structure
- **Properties**: timestamp, transactions (array), previousHash, nonce, hash
- **Transaction Support**: Each block now stores an array of transactions instead of single data
- **Hashing**: SHA-256 with proper nonce initialization and hash recalculation
- **Chain Linkage**: Hash includes previousHash, timestamp, transactions array, and nonce
- **Mining Feedback**: Console logging when blocks are successfully mined

### Blockchain Class Enhancements
- **Pending Transactions**: Array to hold transactions before they're mined into blocks
- **Mining Reward**: Set to 100 (prepared for future mining reward system)
- **addBlock Method**: Accepts transaction array, creates block, recalculates hash after setting previousHash, mines block, adds to chain

### Proof-of-Work Mining
- **Difficulty**: Set to 2 (requires hash to start with "00")
- **Mining Process**: Iteratively increments nonce until hash meets difficulty target
- **Console Output**: Displays mined block hash for monitoring

### Chain Validation
- **Method**: isChainValid() verifies each block's hash and previousHash linkage
- **Immutability**: Any tampering invalidates the chain and is detectable

### Genesis Block
- **Initialization**: Created on server startup with timestamp "01/01/2024" and transactions ["Genesis Block"]
- **Previous Hash**: Set to "0" as it has no predecessor

## International Payment System

### Supported Currencies
- **RUB**: Russian Ruble (base currency)
- **USD**: US Dollar (1 USD = 90 RUB)
- **EUR**: Euro (1 EUR = 98 RUB)
- **USDT**: Tether (1 USDT = 90 RUB)
- **BTC**: Bitcoin (1 BTC = 4,500,000 RUB)
- **ETH**: Ethereum (1 ETH = 250,000 RUB)

### Payment Methods & Fees
- **Bank Card (RUB)**: 0% fee
- **Stripe (USD/EUR)**: 3% percentage fee
- **USDT (TRC20)**: 1 RUB flat fee
- **Bitcoin**: 0.0001 BTC fee (converted to RUB)
- **Ethereum**: 0.001 ETH fee (converted to RUB)

### Fee Calculation Logic
- **Percentage Fees**: fee = round(amountInRub × feePercentage) for card/Stripe payments
- **Flat Fees**: fee = fixed RUB amount for USDT
- **Crypto Fees**: fee = round(cryptoFee × exchangeRate) for BTC/ETH
- **Final Amount**: finalAmount = amountInRub - fee

### Payment Processing Flow
1. User selects currency and payment method
2. System converts amount to RUB using exchange rates
3. Calculates appropriate fee based on payment method type
4. Deducts fee from converted amount
5. Credits final amount to user balance
6. Records payment in history with all details

## API Endpoints

### GET /api/blockchain-stats
- **Purpose**: Returns blockchain statistics
- **Response**: blocks count, difficulty, total transactions, chain validity status

### GET /api/pricing
- **Purpose**: Returns service cost in all supported currencies
- **Response**: Pricing object with converted amounts for each currency

### POST /api/process-payment
- **Purpose**: Processes international payment with automatic conversion
- **Parameters**: userId, amount, currency, method
- **Validation**: Checks payment method support
- **Process**: Converts to RUB, calculates fees, credits balance, records payment
- **Response**: Payment details, final amount, success message

### POST /api/register-proof
- **Purpose**: Registers copyright proof in blockchain as transaction
- **Parameters**: userId, creativeWork, description
- **Validation**: Checks sufficient balance (100 rubles required)
- **Process**: Deducts cost, creates proof transaction, mines block, stores in user's proofs array
- **Response**: Success message, remaining balance, block hash, proof data

### GET /api/payments/:userId
- **Purpose**: Retrieves payment history for specific user
- **Response**: Array of payment objects with amounts, fees, timestamps, methods

### GET /api/user/:userId
- **Purpose**: Retrieves complete user data
- **Response**: User object with balance, currency, and proofs array

### GET /api/proofs/:userId
- **Purpose**: Retrieves all proofs registered by specific user
- **Response**: Array of proof objects from user's proofs array

### POST /api/add-balance
- **Purpose**: Direct balance addition (for testing/admin)
- **Parameters**: userId, amount
- **Process**: Creates user if doesn't exist, adds amount to balance
- **Response**: Success message and new balance

### GET /api/chain
- **Purpose**: Returns complete blockchain
- **Response**: JSON with chain array and length

## Business Model

### Pricing
- **Copyright Registration**: 100 rubles per proof (fixed in all currencies)
- **Initial Balance**: Demo user starts with 1000 rubles
- **Payment Processing**: Accepts 6 currencies with automatic conversion
- **Transaction Fees**: Vary by payment method (0% to 3% plus crypto fees)

### User Management
- **Demo Account**: Pre-configured "demo-user" with 1000 RUB balance, RUB currency, empty proofs array
- **Account Creation**: New users created automatically when adding balance or processing payment
- **User Data Structure**: { balance, currency, proofs[] }
- **Storage**: In-memory (resets when server restarts)

### Payment History
- **Tracking**: All payments stored with ID, timestamp, method, fees, status
- **Display**: Shows in user dashboard with formatted details
- **Purpose**: Transparency and audit trail for all transactions

## Technical Stack

- **Runtime**: Node.js 20
- **Backend Framework**: Express.js 4.18.2
- **Cryptography**: Node.js native crypto module for SHA-256
- **Frontend**: Vanilla JavaScript with async/await for API calls, DOM manipulation
- **Language**: JavaScript (ES6 classes, template literals, arrow functions)
- **Version**: 2.0.0

## Design Patterns

- **MVC-like Structure**: Clear separation between view (HTML), controllers (API endpoints), model (blockchain/data)
- **RESTful API**: Consistent endpoint design with appropriate HTTP methods
- **Object-Oriented**: Block and Blockchain classes with proper encapsulation
- **Transaction-Based**: Blocks store arrays of transactions for scalability
- **Fee Strategy Pattern**: Different fee calculation strategies by payment method type

## Security Considerations

- **Hash Integrity**: SHA-256 ensures cryptographic security
- **Chain Validation**: isChainValid() method detects any tampering
- **Balance Validation**: API checks sufficient funds before registration
- **Immutability**: Blockchain structure makes historical records tamper-evident
- **Fee Transparency**: All fees calculated and displayed to users
- **Payment Tracking**: Complete audit trail of all payment transactions

## External Dependencies

- **express (^4.18.2)**: Web server framework for API and static file serving
- **crypto (Node.js native)**: SHA-256 hashing for blockchain integrity

## Deployment Notes

- **Port**: Server runs on port 5000 (Replit requirement)
- **Workflow**: "ProofChain Server" workflow runs `node server.js`
- **Output**: Webview for user interface access
- **Startup Messages**: Displays supported currencies and stats endpoint

## Future Enhancements Prepared

- **Pending Transactions**: Infrastructure ready for transaction pool
- **Mining Rewards**: Mining reward value configured (100 RUB)
- **Scalability**: Transaction array structure supports multiple transactions per block
