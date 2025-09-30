# Overview

This is a simple blockchain implementation in Node.js that demonstrates core blockchain concepts including block creation, proof-of-work mining, and chain validation. The system creates a linked chain of blocks where each block contains data, a timestamp, a reference to the previous block's hash, and uses SHA-256 cryptographic hashing.

# Recent Changes

**September 30, 2025**: Complete blockchain prototype implementation with all requested features including Block class, Blockchain class, proof-of-work mining, SHA-256 hashing, and validation testing. Fixed nonce initialization order in Block constructor to ensure hash consistency.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Components

### Block Structure
- **Design Decision**: Each block contains timestamp, data payload, previous hash reference, nonce for mining, and calculated hash
- **Rationale**: This structure ensures immutability and cryptographic linking between blocks, making tampering detectable
- **Hashing Algorithm**: SHA-256 chosen for its security properties and wide adoption in blockchain applications

### Proof-of-Work Mining
- **Design Decision**: Implements a difficulty-based mining system where blocks must have a hash starting with a specific number of zeros
- **Implementation**: Iterative nonce incrementing until hash meets difficulty requirements
- **Rationale**: Prevents spam and ensures computational cost for adding blocks, though at a simplified level compared to production blockchains
- **Current Difficulty**: Set to 2 (configurable)

### Chain Management
- **Design Decision**: Array-based chain storage with genesis block initialization
- **Genesis Block**: Hardcoded first block with "Genesis Block" data and '0' as previous hash
- **Validation**: Complete chain integrity verification through hash recalculation and previous hash comparison in isChainValid() method
- **Rationale**: Simple in-memory storage suitable for demonstration and learning purposes

### Immutability Mechanism
- **Design Decision**: Each block's hash incorporates the previous block's hash
- **Rationale**: Creates a cryptographic chain where modifying any block invalidates all subsequent blocks

## Technical Stack

- **Runtime**: Node.js
- **Cryptography**: Native `crypto` module for SHA-256 hashing
- **Language**: JavaScript (ES6 classes)

## Design Patterns

- **Object-Oriented Design**: Separation of concerns between Block and Blockchain classes
- **Encapsulation**: Block hashing logic contained within Block class
- **Chain of Responsibility**: Each block maintains reference to previous block

# External Dependencies

## Native Node.js Modules
- **crypto**: Provides cryptographic functionality for SHA-256 hash generation
- **Purpose**: Core security mechanism for block hashing and chain integrity

## No External Packages
This implementation uses only Node.js built-in modules with no third-party npm dependencies, making it lightweight and suitable for educational purposes.