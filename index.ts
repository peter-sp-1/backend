import { gaugeWithheldFeesAndInitiateAirdrop } from "./src/check_fee_threshold.js";

// run the check_fee_threshold function every 5 minutes
setInterval(() => {
    console.log("Checking for withheld fees and initiating airdrop...");
    gaugeWithheldFeesAndInitiateAirdrop("3v3Gw3BhgPKJSavbiTpB4KpfDmTz1VfmWW3NjNstDP8h");
}
, 300000); // 5 minutes