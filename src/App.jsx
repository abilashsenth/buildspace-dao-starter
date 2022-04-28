import { useAddress, useMetamask } from "@thirdweb-dev/react";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("✋ Address:", address);

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
    return (
      <div className="landing">
        <h1>Wallet connected successfully 😎</h1>
      </div>
    );
  }
};

export default App;
