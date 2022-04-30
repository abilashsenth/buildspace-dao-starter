import { useAddress, useEditionDrop, useMetamask } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("✋ Address:", address);

  const editionDrop = useEditionDrop(
    "0x35C0B57754eA4ddd61E3d7a14e08036d716AcC96"
  );
  //state variables for whether the user has claimed or not
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaimingNFT, setIsClaimingNFT] = useState(false);

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
    if (hasClaimedNFT) {
      return (
        <div className="member-page">
          <h1>🍪DAO Member Page</h1>
          <p>Congratulations on being a member</p>
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
