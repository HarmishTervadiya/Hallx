import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mnemonic, index } = body;

    if (!mnemonic) {
      return Response.json(
        { error: "Mnemonic phrase is required" },
        { status: 400 },
      );
    }

    if (!validateMnemonic(mnemonic, wordlist)) {
      return Response.json(
        { error: "Invalid mnemonic phrase" },
        { status: 400 },
      );
    }

    const walletIndex = index ? parseInt(index) : 0;

    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${walletIndex}'/0'`;

    const seedHex = Buffer.from(seed).toString("hex");
    const derived = derivePath(path, seedHex);

    const keypair = Keypair.fromSeed(new Uint8Array(derived.key));

    return Response.json({
      index: walletIndex,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
      path,
    });
  } catch (error) {
    console.error("Derivation error:", error);
    return Response.json({ error: "Failed to derive wallet" }, { status: 500 });
  }
}
