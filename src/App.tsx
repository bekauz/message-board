import React from 'react';
import './App.css';

function App() {

  const postMsg = () => {
    console.log("postMsg call");
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

        <button className="postButton" onClick={postMsg}>
          Post something
        </button>
      </div>
    </div>
  );
}

export default App;