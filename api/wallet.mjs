import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mnemonic, index, coin_index } = req.body;

    if (!mnemonic) {
      return res.status(400).json({ error: "Mnemonic phrase is required" });
    }

    if (!validateMnemonic(mnemonic, wordlist)) {
      return res.status(400).json({ error: "Invalid mnemonic phrase" });
    }

    const walletIndex = index ? parseInt(index) : 0;

    const seed = mnemonicToSeedSync(mnemonic);
    let publicKey;
    let privateKey;
    let currency;
    let path;

    if (coin_index === 501) {
      currency = "Solana";
      path = `m/44'/501'/${walletIndex}'/0'`;

      const seedHex = Buffer.from(seed).toString("hex");
      const derived = derivePath(path, seedHex);

      const keypair = Keypair.fromSeed(derived.key);
      publicKey = keypair.publicKey.toBase58();
      privateKey = bs58.encode(keypair.secretKey);
    } else if (coin_index === 60) {
      currency = "Ethereum";
      path = `m/44'/60'/0'/0/${walletIndex}`;

      const hdNode = HDNodeWallet.fromSeed(seed);
      const derivedWallet = hdNode.derivePath(path);

      privateKey = derivedWallet.privateKey;
      publicKey = derivedWallet.address;
    } else {
      return res.status(400).json({ error: "Unsupported path type" });
    }

    return res.status(200).json({
      index: walletIndex,
      publicKey,
      privateKey,
      path,
      currency,
    });
  } catch (error) {
    console.error("Derivation error:", error);
    return res.status(500).json({ error: "Failed to derive wallet" });
  }
}
