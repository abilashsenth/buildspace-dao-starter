import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

//this is our governance contract
const vote = sdk.getVote("0x0F5548BC60c7cD1b08CC431c9CF35de578Ec4abE");

//this is our erc20 contract
const token = sdk.getToken("0xbfe03FDEcbE0ebC4392bC58d1f00BdE7628365c4");

(async () => {
  try {
    //create a proposal to mint 420,000 new tokens into the treasury
    const amount = 420_000;
    const description = "Should the DAO mint 420,000 tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];
    await vote.propose(description, executions);
    console.log("Successfully created a new proposal to mint tokens");
  } catch (error) {
    console.log("Failed to create first proposal:", error);
    process.exit(1);
  }
})();

(async () => {
  try {
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    const amount = 6_900;
    const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();