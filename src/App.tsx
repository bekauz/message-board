import React, { useEffect, useState } from 'react';
import './App.css';

declare var window: any

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const postMsg = () => {
    console.log("postMsg call");
  }

  const checkWalletConnection = async () => {
    try {
      // validate window.ethereum access
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`no metamask found`);
        return;
      } else {
        console.log("eth object: ", ethereum);
      }

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("Authorized with account: ", account);
      } else {
        console.log("Authorized account not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("No Metamask found");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Connected: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, [])

  return (
    <div className="App">

      <div className="dataContainer">
        <div className="header">
          message board
        </div>

        <div className="subheader">
          decentralized and all, go on and post something
        </div>

        <button className="postButton" onClick={postMsg}>
          Post something
        </button>

        {!currentAccount && (
          <button className="postButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
