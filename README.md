# Hallx is a web based read-only wallet

Hallx is a web-based read-only wallet application that allows users to manage and monitor their cryptocurrency assets securely.

## Goal

The goal of this project is to make a website that lets users:

1. Generate a random seed phrase for themselves
2. Create multiple Solana wallets (ETH wallets maybe?)
3. See their Solana balance
4. See their USDC/other token balances

## Setup and Run Instructions

### Prerequisites

This project uses [Bun](https://bun.sh) as the package manager and runtime.

### Installation

1. Install dependencies using Bun:

   ```bash
   bun install
   ```

### Running the Application

Start the development server:

```bash
bun start
```

Or to update dependencies:

```bash
bun update
```

## Project Structure

- **app/** - Main application code with file-based routing
- **components/** - Reusable React components
- **constants/** - Application constants and theme configuration
- **hooks/** - Custom React hooks
- **assets/** - Static assets and images
