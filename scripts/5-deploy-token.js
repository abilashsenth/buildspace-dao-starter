import {AddressZero} from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    //Try deploying an ERC20 token
    const tokenAddress = await sdk.deployer.deployToken({
      //The governance token name
      name: "MemeDAO",
      //The governance token symbol
      symbol: "MDAO",
      //this will be in case we want to sell our token.
      //becaue we don't have a token to sell, we'll just use the address zero
      //which is a constant that represents the empty address
      primary_sale_recipient: AddressZero,

    });

    console.log("💰 Token module deployed at:", tokenAddress);
    
  } catch (error) {
    console.log("Error:", error);
  }
})();