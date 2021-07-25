import "./App.css";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import PeerField from "./components/PeerField";
import { getRandomFruitName } from "./utils";

function App() {
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    let _peers = [];
    for (let i = 0; i < 20; i++) {
      _peers.push({
        fruitName: getRandomFruitName(),
        className: "other",
      });
    }
    setPeers(_peers);
  }, []); // todo: add dependency when new peer/found peers from socket event

  return (
    <React.Fragment>
      <Header></Header>
      <PeerField peerList={peers} />
    </React.Fragment>
  );
}

export default App;
