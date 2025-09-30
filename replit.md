# Overview

ProofChain is a blockchain-based digital notary service for creators. It provides a simple web interface where users can register copyright proofs for their creative works, storing them permanently in a blockchain. Each registration costs 100 rubles and creates an immutable proof of authorship with a timestamp.

# Recent Changes

**September 30, 2025**: Complete ProofChain implementation with blockchain backend, Express API server, and web frontend. Fixed blockchain integrity issue where hash recalculation ensures proper chain linkage after previousHash assignment. System includes user balance management, proof registration API, and proof history tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Application Components

### Web Interface (index.html)
- **User Account Management**: Shows user ID, balance display, and balance top-up functionality
- **Copyright Registration**: Form to submit creative work name and description (100 rubles per registration)
- **Proof History**: Displays all registered proofs for a user with timestamps and block hashes
- **Design**: Clean card-based layout with blue gradient background, responsive interface

### Backend Server (server.js)
- **Framework**: Express.js running on port 5000
- **Static File Serving**: Serves frontend HTML/CSS/JS from root directory
- **In-Memory Storage**: Users, proofs, and blockchain stored in server memory (resets on restart)

## Blockchain Implementation

### Block Structure
- **Properties**: timestamp, data, previousHash, nonce, hash
- **Hashing**: SHA-256 with proper nonce initialization before hash calculation
- **Chain Linkage**: Hash includes previousHash, timestamp, data, and nonce
- **Critical Fix**: addBlock method recalculates hash after setting previousHash to ensure proper chain integrity

### Proof-of-Work Mining
- **Difficulty**: Set to 2 (requires hash to start with "00")
- **Mining Process**: Iteratively increments nonce until hash meets difficulty target
- **Purpose**: Adds computational cost to block creation, preventing spam

### Chain Validation
- **Method**: isChainValid() verifies each block's hash matches recalculation and previousHash links correctly
- **Immutability**: Tampering with any block invalidates subsequent blocks

### Genesis Block
- **Initialization**: Created on server startup with timestamp "01/01/2024" and data "Genesis Block"
- **Previous Hash**: Set to "0" as it has no predecessor

## API Endpoints

### GET /api/chain
- **Purpose**: Returns complete blockchain and chain length
- **Response**: JSON with chain array and length

### POST /api/register-proof
- **Purpose**: Registers copyright proof in blockchain
- **Parameters**: userId, creativeWork, description
- **Validation**: Checks sufficient balance (100 rubles required)
- **Process**: Deducts 100 from balance, creates block with proof data, mines block, adds to chain
- **Response**: Success message, remaining balance, and block hash

### POST /api/add-balance
- **Purpose**: Adds funds to user account
- **Parameters**: userId, amount
- **Process**: Creates user if doesn't exist, adds amount to balance
- **Response**: Success message and new balance

### GET /api/proofs/:userId
- **Purpose**: Retrieves all proofs registered by a specific user
- **Response**: Array of proof objects with creative work details and block hashes

## Business Model

### Pricing
- **Copyright Registration**: 100 rubles per proof
- **Initial Balance**: Demo user starts with 1000 rubles
- **Balance Top-up**: Users can add funds through the interface

### User Management
- **Demo Account**: Pre-configured "demo-user" with 1000 ruble balance
- **Account Creation**: New users created automatically when adding balance
- **Storage**: In-memory (resets when server restarts)

## Technical Stack

- **Runtime**: Node.js 20
- **Backend Framework**: Express.js 4.18.2
- **Cryptography**: Node.js native crypto module for SHA-256
- **Frontend**: Vanilla JavaScript with async/await for API calls
- **Language**: JavaScript (ES6 classes, template literals)

## Design Patterns

- **MVC-like Structure**: Separation between frontend view, backend controllers (API), and model (blockchain/data)
- **RESTful API**: Clear endpoint design with appropriate HTTP methods
- **Object-Oriented**: Block and Blockchain classes encapsulate blockchain logic
- **Chain of Responsibility**: Each block maintains reference to previous block

## Security Considerations

- **Hash Integrity**: SHA-256 ensures cryptographic security
- **Chain Validation**: isChainValid() method detects tampering
- **Balance Validation**: API checks sufficient funds before registration
- **Immutability**: Blockchain structure makes historical records tamper-evident

## External Dependencies

- **express (^4.18.2)**: Web server framework for API and static file serving
- **crypto (Node.js native)**: SHA-256 hashing for blockchain integrity

## Deployment Notes

- **Port**: Server runs on port 5000 (Replit requirement)
- **Workflow**: "ProofChain Server" workflow runs `node server.js`
- **Output**: Webview for user interface access
