import {ThirdwebSDK} from '@thirdweb-dev/sdk';
import ethers from "ethers";

import dotenv from "dotenv";
dotenv.config();

//some quick checks to make our environment variables are set

if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === ""){
  console.error("PRIVATE_KEY is not set in your .env file. Please set it and try again");
  process.exit(1);
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
    process.env.PRIVATE_KEY,
    // RPC URL, we'll use our Alchemy API URL from our .env file.
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("✋ Address:", address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }  
})();