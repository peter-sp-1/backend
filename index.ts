import { gaugeWithheldFeesAndInitiateAirdrop } from "./src/check_fee_threshold.js";
const MINT_KEY = process.env.MINT_KEY as string;

// run the check_fee_threshold function every 5 minutes
console.log("Enterring...");
setInterval(() => {
    console.log("Checking for withheld fees and initiating airdrop...");
    gaugeWithheldFeesAndInitiateAirdrop(MINT_KEY);
}
, 300000); // 5 minutes