import "./Peer.css";
import Fruit from "./Fruit";
import { useState } from "react";

const Peer = ({ fruitName, whoAmI, className }) => {
  const [file, setFile] = useState(null);

  const openFilePicker = async (e) => {
    try {
      let [fileHandle] = await window.showOpenFilePicker({ multiple: false });
      let selectedFile = await fileHandle.getFile();
      setFile(selectedFile);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className + " peer"}>
      {whoAmI ? <p className="whoami fade-in">{whoAmI}</p> : null}
      <div
        className={
          "round-wrapper scale-up-center" +
          (className === "user" ? " pulse" : " scale-up-center-delay")
        }
        onClick={typeof whoAmI !== "undefined" ? null : openFilePicker}
      >
        <Fruit name={fruitName} className="avatar"></Fruit>
        {className === "user" ? (
          <div className="mini-pulse under-layer"></div>
        ) : null}
      </div>
      <p className="avatar-name fade-in">{fruitName}</p>
    </div>
  );
};

export default Peer;
