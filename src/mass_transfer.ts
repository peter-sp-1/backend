import { TOKEN_2022_PROGRAM_ID, createTransferCheckedInstruction } from "@solana/spl-token";
import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction 
} from "@solana/web3.js";
import * as fs from "fs";

interface Distribution {
    owner: string;
    ata: string;
    amount: string;
    proportion: number;
    reflectionAmount: string;
}

interface HoldersData {
    totalSupply: string;
    totalHolders: number;
    distributions: Distribution[];
}

export async function processTransfers(
    mint: string = "9V2ns9yRUtn41GmuxZHESA6qVnfwcDrroDCVy2Kpu9E5",
    connection: Connection = new Connection("https://api.devnet.solana.com", "confirmed"),
): Promise<string[]> {
    // Load holders data
    const holdersData: HoldersData = JSON.parse(
        fs.readFileSync("holders_with_proportions.json", "utf-8")
    );
    
    // Load wallet
    const payer = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync("wallet.json", "utf-8")))
    );

    // Convert distributions to transfer parameters
    const destinationATAs = holdersData.distributions.map(
        d => new PublicKey(d.ata)
    );

    // Convert reflection amounts to lamports (assuming 9 decimals)
    const amounts = holdersData.distributions.map(d => 
        BigInt(Math.floor(parseFloat(d.reflectionAmount) * 1e9))
    );

    return await massTransferTokens(
        connection,
        payer,
        new PublicKey(mint), // Replace with your token mint
        destinationATAs,
        amounts
    );
}

async function massTransferTokens(
    connection: Connection,
    payer: Keypair,
    mint: PublicKey,
    destinationTokenAccounts: PublicKey[],
    amounts: bigint[],
) {
    try {
        const transactions: Transaction[] = [];
        const batchSize = 10; // Adjust based on RPC limits

        for (let i = 0; i < destinationTokenAccounts.length; i += batchSize) {
            const batchAccounts = destinationTokenAccounts.slice(i, i + batchSize);
            const batchAmounts = amounts.slice(i, i + batchSize);
            
            const transaction = new Transaction();
            
            for (let j = 0; j < batchAccounts.length; j++) {
                transaction.add(
                    createTransferCheckedInstruction(
                        payer.publicKey, // source
                        mint,
                        batchAccounts[j], // destination
                        payer.publicKey, // owner
                        batchAmounts[j], // amount
                        9, // decimals
                        [], // signers
                        TOKEN_2022_PROGRAM_ID
                    )
                );
            }
            transactions.push(transaction);
        }

        // Send batched transactions
        const signatures = await Promise.all(
            transactions.map(async (tx) => {
                const sig = await sendAndConfirmTransaction(
                    connection,
                    tx,
                    [payer],
                    { commitment: 'confirmed' }
                );
                console.log(`Batch transaction sent: https://solana.fm/tx/${sig}`);
                return sig;
            })
        );

        return signatures;

    } catch (err) {
        console.error("massTransferTokens::Error:", err);
        throw err;
    }
}

// Execute the transfers
// processTransfers().catch(console.error);
//testing 