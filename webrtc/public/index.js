const socket = io();
const button = document.querySelector("button");
const input = document.querySelector("#peerId");

/**
 * @type {RTCPeerConnection}
 */
let peer; // peer connection
let dc; // data channel
let ul; // just to keep a list of available peers

button.onclick = connectToPeer;

function connectToPeer() {
  let peerId = input.value;
  if (!peerId) return alert("Please input a peer id to connect.");

  // check if peer is available through socket.io
  socket.emit("ping-peer", peerId, async (connected) => {
    if (!connected) return alert("Peer is not connected.");

    peer = new RTCPeerConnection();

    peer.onicecandidate = (e) => {
      // not sure why we want to return, just following https://owebio.github.io/serverless-webrtc-chat/noserv.create.html
      if (e.candidate) return;

      // when this event is triggered, the local description is likely to have changed.
      // emit offer now.
      socket.emit(
        "offer", // event type
        JSON.stringify(peer.localDescription), // offer
        peerId, // peer to connect
        socket.id // my own id
      );
    };

    peer.oniceconnectionstatechange = (e) => {
      document.querySelector("#status").innerText = peer.iceConnectionState;
    };

    dc = peer.createDataChannel("channel");

    dc.onopen = () => {
      console.log("data channel opened!");
      dc.onmessage = (e) => console.log(e.data);
    };

    // create offer
    try {
      let offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      console.log("offer set!");
    } catch (error) {
      console.error(error);
    }
  });
}

function createPeerIdLi(id) {
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(id));
  li.className = "online";
  return li;
}

function createPeerList(peers) {
  if (!ul) {
    ul = document.createElement("ul");
    document.querySelector("body").appendChild(ul);
  }
  for (let peer of peers) {
    let li = createPeerIdLi(peer);
    ul.appendChild(li);
  }
}

// Receiving an offer from peer.
socket.on("offer", async (offer, from) => {
  let offerDesc = new RTCSessionDescription(JSON.parse(offer));

  peer = new RTCPeerConnection();

  peer.onicecandidate = (e) => {
    if (e.candidate) return; // again, not sure why 🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️
  };

  peer.oniceconnectionstatechange = (e) => {
    document.querySelector("#status").innerText = peer.iceConnectionState;
  };

  peer.ondatachannel = (e) => {
    // assuming the offerer has a data channel
    dc = e.channel;
    dc.onopen = () => {
      console.log("data channel opened!");
      dc.onmessage = (e) => console.log(e.data);
    };
  };

  try {
    await peer.setRemoteDescription(offerDesc);
    console.log("offer set!");
    let answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
  } catch (error) {
    console.error(error);
  }

  console.log("answer set!");
  console.log("signal answer to", from);
  socket.emit("answer", JSON.stringify(peer.localDescription), from);
});

// Receive answer from a peer, setRemoteDescription
socket.on("answer", (answer) => {
  console.log("Receive answer");
  let answerDesc = new RTCSessionDescription(JSON.parse(answer));

  peer.setRemoteDescription(answerDesc).then(() => console.log("answer set!"));
});

socket.on("greetings", (msg, id) => {
  if (socket.id !== id) socket.id = id;
  console.log(msg);
  document.querySelector("#myId").innerText = socket.id;
  socket.emit("find-peers", socket.id, createPeerList);
});

socket.on("new-peer", (peerId) => {
  if (!ul) createPeerList([peerId]);
  else {
    let li = createPeerIdLi(peerId);
    ul.appendChild(li);
  }
});

socket.on("bye-peer", (peerId) => {
  if (!ul) return;

  for (let li of ul.childNodes) {
    if (li.textContent === peerId) {
      li.className = "offline";
      return;
    }
  }
});
