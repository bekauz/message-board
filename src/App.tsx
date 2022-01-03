import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import './App.css';
import abi from "./utils/MessageBoard.json";

declare var window: any

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

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

  const postMessage = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const messageBoardContract = new ethers.Contract(
          contractAddress || "",
          contractABI,
          signer
        );
        let postCount = await messageBoardContract.getPostCount();
        console.log(`total post count: ${postCount}`);

      } else {
        console.log("eth object not found");
      }
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

        <button className="postButton" onClick={postMessage}>
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
