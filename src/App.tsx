import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers } from "ethers";
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
  const [postCount, setPostCount] = useState(0);
  const [miningTx, setMiningTx] = useState(false);

  const [postInput, setPostInput] = useState("");

  const contractAddress = "0x611A9Fc833672f35BcA18534432aA01bfFC49E05";
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
      await getAllPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const postMessage = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider: Web3Provider = new ethers.providers.Web3Provider(ethereum);
        const signer: JsonRpcSigner = provider.getSigner();
        const messageBoardContract: Contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const currentPostCount: BigNumber = await messageBoardContract.getPostCount();
        console.log(`total post count: ${currentPostCount}`);
        // set default gas to 300000, if that exceeds the actual amt it gets refunded
        const postTxn = await messageBoardContract.post(postInput, { gasLimit: 300000 });

        console.log(`Mining tx with hash ${postTxn.hash}`);

        setMiningTx(true);
        await postTxn.wait();
        await getAllPosts();
        setMiningTx(false);

        console.log(`Successfully mined tx: ${[postTxn.hash]}`);

        console.log(`total post count: ${postCount}`);
      } else {
        console.log("eth object not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllPosts = async () => {

    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider: Web3Provider = new ethers.providers.Web3Provider(ethereum);
        const signer: JsonRpcSigner = provider.getSigner();
        const messageBoardContract: Contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const posts: any[] = await messageBoardContract.getAllPosts();
        
        let sanitizedPosts: Post[] = posts.map((post: any) => {
          return {
            address: post.postUser,
            timestamp: new Date(post.timestamp * 1000),
            message: post.message,
          };
        });
        setAllPosts(sanitizedPosts);
        setPostCount(sanitizedPosts.length);
      } else {
        console.log("eth object not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let messageBoardContract: Contract;

    const onNewPost = (from: string, timestamp: any, message: string) => {
      console.log("NewPost", from, timestamp, message);
      setAllPosts(currentPosts => [
        ...currentPosts,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer: JsonRpcSigner = provider.getSigner();

      messageBoardContract = new ethers.Contract(contractAddress, contractABI, signer);
      messageBoardContract.on("NewPost", onNewPost);
    }

    return () => {
      if (messageBoardContract) {
        messageBoardContract.off("NewPost", onNewPost);
      }
    }
  }, []);

  useEffect(() => {
    checkWalletConnection();
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
