import fs from "fs";
import fetch from "node-fetch";
import { processTransfers } from "./mass_transfer.js";

// IMPORT FROM .ENV
const API_KEY = process.env.API_KEY;
const url = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;

interface TokenAccount {
  address: string; // ATA address
  mint: string;
  owner: string;
  amount: string;
}

interface APIResponse {
  result?: {
    token_accounts: TokenAccount[];
  };
}

interface HolderInfo {
  ata: string;
  amount: bigint;
  proportion: number;
}

export const findHoldersWithProportions = async (mint: string): Promise<void> => {
  let page = 1;
  const holders = new Map<string, HolderInfo>();
  let totalSupply = BigInt(0);

  while (true) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getTokenAccounts",
        id: "helius-test",
        params: {
          page,
          limit: 1000,
          displayOptions: {},
          mint: mint,
        },
      }),
    });

    const data = (await response.json()) as APIResponse;

    if (!data.result || data.result.token_accounts.length === 0) {
      console.log(`No more results. Total pages: ${page - 1}`);
      break;
    }

    console.log(`Processing results from page ${page}`);
    
    data.result.token_accounts.forEach((account) => {
      const amount = BigInt(account.amount);
      totalSupply += amount;
      holders.set(account.owner, {
        ata: account.address,
        amount: amount,
        proportion: 0, // Will calculate after getting total supply
      });
    });
    
    page++;
  }

  // Calculate proportions
  for (const [owner, info] of holders) {
    const proportion = Number(info.amount) / Number(totalSupply);
    holders.set(owner, { ...info, proportion });
  }

  // Example: Distribute 1000 tokens
  const distributionAmount = Number(totalSupply);
  const distributions = Array.from(holders.entries()).map(([owner, info]) => ({
    owner,
    ata: info.ata,
    amount: info.amount.toString(),
    proportion: info.proportion,
    reflectionAmount: (distributionAmount * info.proportion).toFixed(4)
  }));

  fs.writeFileSync(
    "holders_with_proportions.json", 
    JSON.stringify({
      totalSupply: totalSupply.toString(),
      totalHolders: holders.size,
      distributions
    }, null, 2)
  );
  
  console.log("Holders and proportions saved to holders_with_proportions.json");
  await processTransfers(mint);
};

// Run the function
// findHoldersWithProportions().catch(console.error);