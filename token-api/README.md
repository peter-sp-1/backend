# Token API

This project is a simple API for generating tokens, creator wallets, and private keys. It is built using TypeScript and Express.

## Project Structure

```
token-api
├── src
│   ├── controllers
│   │   └── tokenController.ts
│   ├── routes
│   │   └── tokenRoutes.ts
│   ├── utils
│   │   └── walletGenerator.ts
│   ├── types
│   │   └── index.ts
│   └── app.ts
├── test
│   └── token.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd token-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the server, run:
```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Generate Token, Creator Wallet, and Private Key

- **Endpoint:** `POST /api/token/generate`
- **Description:** Generates a new token along with a creator wallet and private key.
- **Request Body:**
  ```json
  {
    "tokenName": "string",
    "tokenSymbol": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "creatorWallet": "string",
    "privateKey": "string"
  }
  ```

## Running Tests

To run the tests, use:
```bash
npm test
```

## License

This project is licensed under the MIT License.