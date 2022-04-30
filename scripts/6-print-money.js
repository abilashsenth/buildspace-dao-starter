import sdk from "./1-initialize-sdk.js";

//this is the address of our erc20 token  (MDAO)
const tokenAddress = "0xbfe03FDEcbE0ebC4392bC58d1f00BdE7628365c4";
const token = sdk.getToken(tokenAddress);

(async () => {
  try {
    //What's the max supply you want to set? 1,000,000 is a nice number
    const maxSupply = 1000000;
    //intereact with erc20 contract and mint the token
    await token.mint(maxSupply);
    const totalSupply = await token.totalSupply();

    //print out the total supply
    console.log("💰 Token module deployed at:", tokenAddress);
    console.log("💰 Total supply of $MDAO :", totalSupply.displayValue);
  } catch (error) {
    console.log("Failed to print money:", error);
  }
})();
