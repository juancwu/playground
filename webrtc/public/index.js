const socket = io();
const button = document.querySelector("button");
const input = document.querySelector("#peerId");

const config = {
  iceServers: [
    { urls: ["stun.l.google.com:19302", "stun1.l.google.com:19302"] },
  ],
};

/**
 * @type {RTCPeerConnection}
 */
let peer;
let dc;
let ul;

button.onclick = connectToPeer;

function connectToPeer(e) {
  e.preventDefault();

  let peerId = input.value;
  if (!peerId) return alert("Please insert a peerId");

  socket.emit("ping-peer", peerId, connect.bind(null, peerId));
}

function connect(peerId, connected) {
  if (!connected) return alert("Peer is not connected.");

  peer = new RTCPeerConnection(null);

  peer.onicecandidate = (e) => {
    if (e.candidate) return;
    // socket.emit("candidate", {
    //   candidate: peer.localDescription.toJSON(),
    //   target: peerId,
    //   from: socket.id,
    // });
    console.log(e);
    console.log("new ice candidate!");
    console.log(JSON.stringify(peer.localDescription));
  };

  peer.oniceconnectionstatechange = (e) => {
    console.log("ice connection change!");
    console.log(peer.iceConnectionState);
  };

  dc = peer.createDataChannel("channel");
  dc.onopen = () => {
    dc.onmessage = (e) => {
      if (e.data) console.lod(e.data);
    };
  };
  peer
    .createOffer()
    .then((offer) => peer.setLocalDescription(offer))
    .then(() => {
      console.log("Emit offer to:", peerId);
      socket.emit("offer", {
        offer: peer.localDescription.toJSON(),
        target: peerId,
        from: socket.id,
      });
    })
    .catch(console.error);
}

function createPeerList(peers) {
  ul = document.createElement("ul");
  for (let peer of peers) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(peer));
    ul.appendChild(li);
  }

  document.querySelector("body").appendChild(ul);
}

function initDc(dc) {
  dc.onopen = () => {
    console.log("data channel open!");
  };

  dc.onmessage = (e) => {
    if (e.data) console.log(e.data);
  };
}

socket.on("offer", ({ offer, from }) => {
  console.log("received offer from:", from);
  peer = new RTCPeerConnection(null);

  peer.ondatachannel = (e) => {
    dc = e.channel;
    initDc(dc);
  };
  peer.onicecandidate = (e) => {
    if (e.candidate) return;
    console.log("new ice candidate");
    console.log(JSON.stringify(peer.localDescription));
  };
  peer.oniceconnectionstatechange = (e) => {
    console.log("ice connection change");
    console.log(peer.iceConnectionState);
  };

  let offerDesc = new RTCSessionDescription(offer);
  peer
    .setRemoteDescription(offerDesc)
    .then(() => peer.createAnswer())
    .then((answer) => peer.setLocalDescription(answer))
    .then(() => {
      console.log("Emit answer to:", from);
      socket.emit("answer", {
        answer: peer.localDescription.toJSON(),
        target: from,
        from: socket.id,
      });
    });
});

socket.on("answer", ({ answer, from }) => {
  console.log("received answer from:", from);
  let answerDesc = new RTCSessionDescription(answer);
  peer
    .setRemoteDescription(answerDesc)
    .then(() => console.log("Remote description set"));
});

socket.on("greetings", (msg, id) => {
  if (socket.id !== id) socket.id = id;
  console.log(msg);

  socket.emit("find-peers", socket.id, createPeerList);
});

socket.on("new-peer", (peerId) => {
  if (!ul) createPeerList([peerId]);
  else {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(peerId));
    ul.appendChild(li);
  }
});
