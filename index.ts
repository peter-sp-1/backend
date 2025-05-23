import { gaugeWithheldFeesAndInitiateAirdrop } from "./src/check_fee_threshold.js";
import dotenv from "dotenv";
dotenv.config();

// Load the MINT_KEY from the environment variables
const MINT_KEY = process.env.MINT_KEY as string;

// run the check_fee_threshold function every 5 minutes
console.log("Enterring...");
// setInterval(() => {
//     console.log("Checking for withheld fees and initiating airdrop...");
//     gaugeWithheldFeesAndInitiateAirdrop(MINT_KEY);
// }
// , 300000); // 5 minutes
console.log("MINT_KEY: ", MINT_KEY);
gaugeWithheldFeesAndInitiateAirdrop(MINT_KEY)
.then(() => {
    console.log("Done!");
}
).catch((error) => {
    console.error(error);
});