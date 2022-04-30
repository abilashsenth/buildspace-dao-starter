import sdk from "./1-initialize-sdk.js";
//governance contract
(async ()=>{
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      //name for the governance contract
      name: "My MemeDAO",
      //the location of the governance token, our ERC-20 Contract
      voting_token_address: "0xbfe03FDEcbE0ebC4392bC58d1f00BdE7628365c4",
      
      //these parameters are specified in number of blocks
      //assuming block time of around 15 seconds for Ethereum

      //after a proposal is created, when can members start voting?
      //we will set it to 1 day = 6570 blocks
      voting_period_in_blocks:6570,

      //minimum number of total supply that needs to vote for
      //the proposal to be valid after the time for the proposal has ended
      voting_quorum_fraction:0,

      //minimum number of tokens a user needs to be allowed to create a proposal
      proposal_token_threshold:0,
    });

    console.log("💰 Governance module deployed at:", voteContractAddress);
    
  } catch (error) {
    console.log("Failed to Deploy vote contract:", error);
  }
})();