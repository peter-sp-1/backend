import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl
} from "@solana/web3.js";
import {
TOKEN_2022_PROGRAM_ID,
getTransferFeeAmount,
unpackAccount,
} from "@solana/spl-token";
import { harvestWithheldTokensToAuthority } from "./harvest.js";
import * as fs from "fs";
// Connection to devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

import { findHoldersWithProportions } from "./findholders.js";

// Threshold for withheld fees from .env
const threshHold = Number(process.env.THRESH_HOLD);

// create a Keypair from the secret key
const payer = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync("wallet.json", "utf-8")))
    );

// Retrieve all Token Accounts for the Mint Account
export async function gaugeWithheldFeesAndInitiateAirdrop(mint: string) {
    try {
        const allAccounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
            commitment: "confirmed",
            filters: [
              {
                memcmp: {
                  offset: 0,
                  bytes: mint.toString(), // Mint Account address
                },
              },
            ],
          });

        // List of Token Accounts to withdraw fees from
        const accountsToWithdrawFrom: PublicKey[] = [];

        for (const accountInfo of allAccounts) {
        const account = unpackAccount(
            accountInfo.pubkey, // Token Account address
            accountInfo.account, // Token Account data
            TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
        );
        
        // Extract transfer fee data from each account
        const transferFeeAmount = getTransferFeeAmount(account);

        // Check if fees are available to be withdrawn
        if (transferFeeAmount !== null && transferFeeAmount.withheldAmount > threshHold) {
            console.log("Transfer Fee Amount:", transferFeeAmount.withheldAmount);
            accountsToWithdrawFrom.push(accountInfo.pubkey); // Add account to withdrawal list
            console.log("Account to Withdraw From:", accountsToWithdrawFrom);

            // Harvest withheld tokens to authority Account
            await harvestWithheldTokensToAuthority(
                connection, // Connection to Solana cluster
                payer, // Transaction fee payer
                new PublicKey(mint), // Mint Account address
                accountInfo.pubkey, // Destination account for fee withdrawal
                payer.publicKey, // Authority for fee withdrawal
                accountsToWithdrawFrom, // Token Accounts to withdrawal from
            );

            // DISTRIBUTE REWARDS TO HOLDERS
            await findHoldersWithProportions(mint);
        }
    }

    } catch (err) {
        console.error(err);
    }
}

// Call the function
// getTokenAccounts("3v3Gw3BhgPKJSavbiTpB4KpfDmTz1VfmWW3NjNstDP8h").then(() => {
//     console.log("Token Accounts retrieved successfully");
//     }
// );