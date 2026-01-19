# Requirements Document

## Introduction

This document specifies the requirements for a non-custodial wallet authentication system for Cedra Quest, a Telegram Mini App game. The system enables secure wallet creation and authentication while maintaining user control over private keys, following a three-phase flow: initialization and user check, client-side key generation, and on-chain wallet registration.

## Glossary

- **Telegram_Mini_App**: Web application running within Telegram messenger
- **InitData**: Authentication string provided by Telegram containing user information
- **Wallet_Address**: Public blockchain address in format username.hot.tg
- **Seed_Phrase**: 12-word BIP-39 mnemonic phrase for wallet recovery
- **Private_Key**: Secret cryptographic key used for transaction signing
- **Public_Key**: Cryptographic key derived from private key for wallet creation
- **Master_Wallet**: Server-controlled wallet used to pay gas fees for user wallet creation
- **Users_Table**: Database table storing Telegram ID to wallet address mappings
- **RPC_Check**: Remote procedure call to blockchain for address verification

## Requirements

### Requirement 1: Telegram Authentication and User Identification

**User Story:** As a Telegram user, I want to authenticate using my Telegram identity, so that I can access the game without additional login steps.

#### Acceptance Criteria

1. WHEN a user opens the Mini App, THE Authentication_System SHALL receive the initData from Telegram
2. WHEN initData is received, THE Server SHALL decode it to extract the Telegram ID
3. WHEN the Telegram ID is extracted, THE Server SHALL validate the initData authenticity
4. IF the initData is invalid, THEN THE Server SHALL reject the authentication request
5. WHEN authentication succeeds, THE Server SHALL proceed to wallet lookup

### Requirement 2: Existing User Login Flow

**User Story:** As a returning user with an existing wallet, I want instant access to my dashboard, so that I can continue playing without delays.

#### Acceptance Criteria

1. WHEN a valid Telegram ID is received, THE Server SHALL query the Users_Table for existing wallet records
2. WHEN a wallet record exists, THE Server SHALL retrieve the wallet_address and current balance
3. WHEN wallet information is retrieved, THE Server SHALL return the complete user profile to the client
4. WHEN the client receives existing user data, THE Frontend SHALL display the user dashboard immediately
5. THE Server SHALL complete the login process within 2 seconds for existing users

### Requirement 3: New User Registration Initialization

**User Story:** As a new user without a wallet, I want the system to guide me through wallet creation, so that I can start playing the game.

#### Acceptance Criteria

1. WHEN no wallet record exists for a Telegram ID, THE Server SHALL initiate the registration process
2. WHEN registration begins, THE Server SHALL generate a suggested wallet name based on the user's Telegram username or ID
3. WHEN generating the suggested name, THE Server SHALL check for duplicates in both the internal database and blockchain
4. IF the suggested name exists, THEN THE Server SHALL append a numeric suffix (_1, _2, etc.) until a unique name is found
5. WHEN a unique name is determined, THE Server SHALL return it to the Frontend in the format username.hot.tg

### Requirement 4: Client-Side Seed Phrase Generation

**User Story:** As a security-conscious user, I want my wallet's seed phrase generated on my device, so that the server never has access to my recovery keys.

#### Acceptance Criteria

1. WHEN the user proceeds with wallet creation, THE Frontend SHALL generate a 12-word seed phrase using BIP-39 standard
2. WHEN the seed phrase is generated, THE Frontend SHALL display it to the user with clear backup instructions
3. WHEN displaying the seed phrase, THE Frontend SHALL require user confirmation that they have saved the words
4. THE Frontend SHALL NOT proceed until the user explicitly confirms seed phrase backup
5. THE Server SHALL NOT receive or store the seed phrase at any point in the process

### Requirement 5: Client-Side Key Pair Generation

**User Story:** As a user creating a wallet, I want my private keys generated securely on my device, so that I maintain full control over my funds.

#### Acceptance Criteria

1. WHEN the seed phrase is confirmed, THE Frontend SHALL derive a cryptographic key pair from the seed phrase
2. WHEN keys are generated, THE Frontend SHALL store the private key securely in device LocalStorage
3. WHEN keys are generated, THE Frontend SHALL prepare the public key for transmission to the server
4. THE Private_Key SHALL remain on the client device and never be transmitted to the server
5. THE Frontend SHALL use industry-standard cryptographic libraries for key generation

### Requirement 6: On-Chain Wallet Creation

**User Story:** As a new user, I want my wallet created on the blockchain without paying gas fees, so that I can start using the system immediately.

#### Acceptance Criteria

1. WHEN the user confirms wallet creation, THE Frontend SHALL send the Telegram ID, requested wallet address, and public key to the server
2. WHEN the server receives the creation request, THE Server SHALL verify the wallet name is still available
3. WHEN availability is confirmed, THE Server SHALL use the Master_Wallet to execute blockchain wallet creation
4. WHEN creating the wallet, THE Server SHALL assign ownership to the received public key
5. WHEN the transaction succeeds, THE Server SHALL save the Telegram ID to wallet address mapping in the Users_Table
6. THE Server SHALL pay all gas fees for the initial wallet creation

### Requirement 7: Race Condition Handling

**User Story:** As a user, I want the system to handle conflicts gracefully when multiple users try to claim the same wallet name, so that my registration process completes successfully.

#### Acceptance Criteria

1. WHEN multiple users attempt to create the same wallet address simultaneously, THE Server SHALL process requests sequentially
2. WHEN a wallet creation fails due to name conflict, THE Server SHALL return an appropriate error to the client
3. WHEN the client receives a name conflict error, THE Frontend SHALL automatically request a new suggested name from the server
4. WHEN a new name is suggested, THE Frontend SHALL retry the wallet creation process automatically
5. THE System SHALL continue retrying with incremented suffixes until successful creation

### Requirement 8: Wallet Recovery from Seed Phrase

**User Story:** As a user who lost access to my device, I want to recover my wallet using my seed phrase, so that I can regain access to my funds and game progress.

#### Acceptance Criteria

1. WHEN a user selects wallet recovery, THE Frontend SHALL provide an interface to enter the 12-word seed phrase
2. WHEN the seed phrase is entered, THE Frontend SHALL validate it against BIP-39 standards
3. WHEN the seed phrase is valid, THE Frontend SHALL recalculate the public key from the seed phrase
4. WHEN the public key is calculated, THE Frontend SHALL send it to the server to locate the associated wallet
5. WHEN the wallet is found, THE Server SHALL return the wallet address and user data to complete recovery

### Requirement 9: Data Security and Privacy

**User Story:** As a security-conscious user, I want my sensitive wallet data protected according to non-custodial principles, so that I maintain full control over my assets.

#### Acceptance Criteria

1. THE Server SHALL store only Telegram IDs, wallet addresses, and public keys
2. THE Server SHALL NOT store or have access to seed phrases or private keys
3. WHEN storing user data, THE Server SHALL use appropriate database security measures
4. WHEN transmitting data, THE System SHALL use HTTPS encryption for all communications
5. THE Frontend SHALL store private keys only in secure local storage with appropriate encryption

### Requirement 10: Error Handling and User Feedback

**User Story:** As a user, I want clear feedback when errors occur during wallet operations, so that I understand what happened and how to proceed.

#### Acceptance Criteria

1. WHEN any wallet operation fails, THE System SHALL provide clear, user-friendly error messages
2. WHEN blockchain operations fail, THE System SHALL distinguish between temporary and permanent failures
3. WHEN network errors occur, THE System SHALL provide retry options for recoverable failures
4. WHEN displaying errors, THE Frontend SHALL avoid exposing technical details that could confuse users
5. THE System SHALL log detailed error information for debugging while showing simplified messages to users