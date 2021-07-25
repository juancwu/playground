import "./PeerField.css";
import Peer from "./Peer";

const PeerField = ({ peerList }) => {
  return (
    <div className="peer-field">
      <Peer fruitName="watermelon" whoAmI="you" className="user" />
      {peerList.map((peer, i) => {
        return (
          <Peer key={i} fruitName={peer.fruitName} className={peer.className} />
        );
      })}
    </div>
  );
};

export default PeerField;
