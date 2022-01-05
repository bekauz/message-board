import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import './App.css';
import abi from "./utils/MessageBoard.json";

declare var window: any

interface Post {
  address: string,
  timestamp: Date,
  message: string,
}

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState(BigNumber.from("0"));
  const [miningTx, setMiningTx] = useState(false);

  const [postInput, setPostInput] = useState("");

  const contractAddress = "0x47D08d805c1330Af8D262065256Cd191868B691B";
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
        await getAllPosts();
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
          contractAddress,
          contractABI,
          signer
        );

        const currentPostCount: BigNumber = await messageBoardContract.getPostCount();
        console.log(`total post count: ${currentPostCount}`);

        const postTxn = await messageBoardContract.post(postInput);
        console.log(`Mining tx with hash ${postTxn.hash}`);

        setMiningTx(true);
        await postTxn.wait();
        await getAllPosts();
        setMiningTx(false);
        setPostCount(currentPostCount.add(1));

        console.log(`Successfully mined tx: ${[postTxn.hash]}`);

        console.log(`total post count: ${postCount}`);
      } else {
        console.log("eth object not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentPostCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const messageBoardContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const currentPostCount: BigNumber = await messageBoardContract.getPostCount();
        setPostCount(currentPostCount);

        console.log(`current post count: ${postCount}`);
      } else {
        console.log("eth object not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllPosts = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const messageBoardContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const posts: any[] = await messageBoardContract.getAllPosts();
        let sanitizedPosts: Post[] = [];
        posts.forEach(post => {
          sanitizedPosts.push({
            address: post.postUser,
            timestamp: new Date(post.timestamp * 1000),
            message: post.message,
          });
        });
        console.log(posts);
        console.log(sanitizedPosts);
        setAllPosts(sanitizedPosts);
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

  useEffect(() => {
    getCurrentPostCount();
  }, [])

  const handleInputMessageChange = (e: any) => {
    setPostInput(e.target.value);
  }

  return (
    <div className="App">
      <div className="dataContainer">
        <div className="header">
          message board
        </div>

        <div className="subheader">
          decentralized and all, go on and post something
        </div>

        <div className="postBox">
          <form>
            <label>Your message: <input
              type="text"
              onChange={handleInputMessageChange}
              value={postInput}
            />
            </label>
          </form>

          <button className="postButton" disabled={miningTx} onClick={postMessage}>
            {miningTx ? (
              "Mining tx..."
            ) : (
              "Post your message"
            )}
          </button>
        </div>


        {!currentAccount && (
          <button className="postButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <div>
            <p className="text">Current post count: {postCount.toString()}</p>

            {allPosts.map((post, index) => {
              return (
                <div key={index} className="post">
                  <div>Address: <span className="post-content">{post.address}</span></div>
                  <div>Time: <span className="post-content">{post.timestamp.toString()}</span></div>
                  <div>Message: <span className="post-content">{post.message}</span></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
