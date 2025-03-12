# Solana Token Reflections System

An off-chain system for managing and distributing token reflections to holders of SPL tokens on Solana.

## Overview

This system implements a reflection mechanism for Solana tokens, where a portion of transaction fees are collected and redistributed to token holders proportionally to their holdings. The process runs off-chain for efficiency but executes the actual transfers on-chain.

## Architecture

### Components

1. **Token Holder Scanner** (`src/findholders.ts`)
   - Queries the Solana blockchain for current token holders
   - Maps holder addresses to their associated token accounts (ATAs)
   - Calculates holding proportions for each account

2. **Fee Harvester** (`src/harvest.ts`)
   - Monitors withheld transfer fees from Token-2022 program
   - Triggers distribution when threshold is reached
   - Maintains accurate fee accounting

3. **Mass Transfer System** (`src/mass_transfer.ts`)
   - Handles bulk token transfers to multiple recipients
   - Implements batching to stay within Solana's transaction limits
   - Provides transaction confirmation and error handling

### Data Flow

1. System periodically scans for token holders and their balances
2. Calculates proportion of holdings for each wallet
3. Monitors accumulated transfer fees
4. When fee threshold is reached:
   - Calculates reflection amounts based on proportions
   - Executes batched transfers to holder wallets

## Technical Implementation

### Token Holder Data Structure

```typescript
interface Distribution {
    owner: string;        // Wallet address
    ata: string;         // Associated Token Account
    amount: string;      // Current token balance
    proportion: number;  // Share of total supply
    reflectionAmount: string; // Amount to receive
}
```

### Batch Processing

- Transactions are processed in batches of 5 transfers
- Uses Token-2022 program for efficient transfers
- Implements retry logic for failed transactions

## Configuration

### Required Files

- `wallet.json`: Distributor wallet keypair
- `holders_with_proportions.json`: Current holder data
- Environment variables for RPC endpoints and configuration

### Network Settings

- Default RPC: Mainnet Beta
- Confirmation level: Confirmed
- Transaction retry attempts: 3

## Usage

1. Install dependencies:
```bash
npm install
```

2. Configure wallet and network:
```bash
# Set up your distributor wallet
cp wallet.example.json wallet.json
# Edit wallet.json with your keypair
```

3. Run the system:
```bash
npm run dev
```

## Security Considerations

- Private keys never leave the local system
- RPC endpoints should be private/authenticated
- Transaction signing happens locally
- Proper error handling prevents double-payments

## Monitoring and Maintenance

The system provides monitoring through:
- Transaction logs
- Distribution records
- Error reporting
- Balance tracking

## Development

### Prerequisites
- Node.js v16+
- TypeScript
- Solana CLI tools

### Testing
```bash
npm test
```

### Building
```bash
npm run build
```

## License

MIT License - No damn License, clone and enjoy your code!