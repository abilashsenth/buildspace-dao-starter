import {
  useAddress,
  useEditionDrop,
  useMetamask,
  useToken,
  useVote,
  AddressZero,
  useNetwork,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("✋ Address:", address);

  const vote = useVote("0x0F5548BC60c7cD1b08CC431c9CF35de578Ec4abE");

  const editionDrop = useEditionDrop(
    "0x35C0B57754eA4ddd61E3d7a14e08036d716AcC96"
  );

  //initialize our token contract
  const token = useToken("0xbfe03FDEcbE0ebC4392bC58d1f00BdE7628365c4");

  //state variables for whether the user has claimed or not
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaimingNFT, setIsClaimingNFT] = useState(false);

  //holds the amount of token each momber has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  //the array holding all our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  //a fancy function to shorten someones wallet address, no need to show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    console.log("✋ Proposals:", proposals);
    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  //this useEffect grabs all the addresses of our members holding their nft
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    //grab the users who hold our nft with tokenID 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("💰 Member Addresses:", memberAddresses);
      } catch (error) {
        console.log("Failed to get all addresses:", error);
      }
    };

    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  //this useEffect grabs the amount of token each member has
  useEffect(() => {
    if (!hasClaimedNFT) return;
    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("💰 Member Balances:", amounts);
      } catch (error) {
        console.log("Failed to get all balances:", error);
      }
    };

    getAllBalances();
  }, [memberAddresses]);

  //Now, combine the momberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      //we are checking if we are finding the address in the memberTokenAmounts array
      //if we find, we return the amount of token the user has.
      //otherwise, return 0
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );
      return {
        address: address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    //if they dont have connected wallet, exit
    if (!address) return;

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 This user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("💀 This user does not have a membership NFT!");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.log("Error checking balance:", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaimingNFT(true);
      await editionDrop.claim("0", 1);
      console.log("🐸 NFT minted!");
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.log("Error minting NFT:", error);
    } finally {
      setIsClaimingNFT(false);
    }
  };

  const network = useNetwork();
  if (address && network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

  //this is the case where the user hasnt connected their wallet
  //to your web app. let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to MemeDAO</h1>
        <button className="btn-hero" onClick={connectWithMetamask}>
          Connect with metamask
        </button>
      </div>
    );
  } else {
    //this is the case where the user has connected their wallet
    //to your web app. which means they have connected their wallet to our site
    //and we can now use the address to interact with the dApp
    // Add this little piece!
    // If the user has already claimed their NFT we want to display the interal DAO page to them
    // only DAO members will see this. Render all the members + token amounts.
    if (hasClaimedNFT) {
      return (
        <div className="member-page">
          <h1>🐸MemeDAO</h1>
          <p>Congratulations gamer. You are now part of the elite meme club🤘</p>
          <div>
            <div>
              <h2>Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h2>Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  //before we do async things, we want to disable the button to prevent double clicks
                  setIsVoting(true);

                  // lets get the votes from the form for the values
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalId: proposal.proposalId,
                      //abstain by default
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      );

                      if (elem.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });

                  // first we need to make sure the user delegates their token to vote
                  try {
                    //we'll check if the wallet still needs to delegate their tokens before they can vote
                    const delegation = await token.getDelegationOf(address);
                    // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                    if (delegation === AddressZero) {
                      //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                      await token.delegateTo(address);
                    }
                    // then we need to vote on the proposals
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          // before voting we first need to check whether the proposal is open for voting
                          // we first need to get the latest state of the proposal
                          const proposal = await vote.get(proposalId);
                          // then we check if the proposal is open for voting (state === 1 means it is open)
                          if (proposal.state === 1) {
                            // if it is open for voting, we'll vote on it
                            return vote.vote(proposalId, _vote);
                          }
                          // if the proposal is not open for voting we just return nothing, letting us continue
                          return;
                        })
                      );
                      try {
                        // if any of the propsals are ready to be executed we'll need to execute them
                        // a proposal is ready to be executed if it is in state 4
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            // we'll first get the latest state of the proposal again, since we may have just voted before
                            const proposal = await vote.get(proposalId);

                            //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                            if (proposal.state === 4) {
                              return vote.execute(proposalId);
                            }
                          })
                        );
                        // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                        setHasVoted(true);
                        // and log out a success message
                        console.log("successfully voted");
                      } catch (err) {
                        console.error("failed to execute votes", err);
                      }
                    } catch (err) {
                      console.error("failed to vote", err);
                    }
                  } catch (err) {
                    console.error("failed to delegate tokens");
                  } finally {
                    // in *either* case we need to set the isVoting state to false to enable the button again
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            //default the "abstain" vote to checked
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting
                    ? "Voting..."
                    : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
                </button>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need
                    to sign.
                  </small>
                )}
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mint-nft">
          <h1>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaimingNFT} onClick={mintNft}>
            {isClaimingNFT ? "Minting..." : "Mint your nft (FREE)"}
          </button>
        </div>
      );
    }
  }
};

export default App;
