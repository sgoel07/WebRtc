// app.js

var VideoChat = {
  socket: io(),
  requestMediaStream: function (event) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        VideoChat.onMediaStream(stream);
      })
      .catch(error => {
        VideoChat.noMediaStream(error);
      });
  },

  onMediaStream: function (stream) {
    VideoChat.localVideo = document.getElementById('local-video');
    VideoChat.localVideo.volume = 0;
    VideoChat.localStream = stream;
    VideoChat.videoButton.setAttribute('disabled', 'disabled');
    VideoChat.localVideo.srcObject = stream;
    VideoChat.socket.emit('join', 'test');
    VideoChat.socket.on('ready', VideoChat.readyToCall);
    VideoChat.socket.on('offer', VideoChat.onOffer);
  },

  noMediaStream: function () {
    console.log('No media stream for us.');
    // Sad trombone.
  },

  readyToCall: function (event) {
    VideoChat.callButton.removeAttribute('disabled');
  },

  startCall: function (event) {
    console.log(event, "Call event")
    VideoChat.socket.on('token', VideoChat.onToken(VideoChat.createOffer));
    VideoChat.socket.emit('token');
  },

  // onToken: function(token){
  onToken: function (callback) {
    return function (token) {
      VideoChat.peerConnection = new RTCPeerConnection({
        iceServers: token.iceServers
      });

      VideoChat.peerConnection.addStream(VideoChat.localStream);
      VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
      VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
      VideoChat.socket.on('candidate', VideoChat.onCandidate);
      VideoChat.socket.on('answer', VideoChat.onAnswer);
      callback();

      // VideoChat.peerConnection.addStream(VideoChat.localStream);
      VideoChat.localStream.getTracks().forEach(function (track) {
        console.log("hi local stream", track)
        VideoChat.peerConnection.addTrack(track, VideoChat.localStream);
      });


      VideoChat.peerConnection.createOffer(
        function (offer) {
          console.log("Offer", offer.sdp)
          // VideoChat.peerConnection.setLocalDescription(offer)
          VideoChat.peerConnection.setLocalDescription(offer)
            .then((off) => {
              // Local description successfully set
              console.log('Local description successfully set',off);
            })
            .catch((error) => {
              // Failed to set local description
              console.error('Error setting local description:', error);
            });
          VideoChat.socket.emit('offer', JSON.stringify(offer));
        },
        function (err) {
          console.log(err, "offer");
        }
      );
    }
  },

  onIceCandidate: function (event) {
    if (event.candidate) {
      console.log('Generated candidate!');
      VideoChat.socket.emit('candidate', JSON.stringify(event.candidate));
    }
  },
  onCandidate: function (candidate) {
    let rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    VideoChat.peerConnection.addIceCandidate(rtcCandidate);
  },
  createOffer: function () {
    VideoChat.peerConnection.createOffer(
      function (offer) {
        console.log(VideoChat.peerConnection.setLocalDescription(offer), "Check offer")
        VideoChat.peerConnection.setLocalDescription(offer);
        VideoChat.socket.emit('offer', JSON.stringify(offer));
      },
      function (err) {
        console.log(err, "Error in create offer function");
      }
    );
  },

  createAnswer: function (offer) {
    return function () {
      var rtcOffer = new RTCSessionDescription(JSON.parse(offer));
      VideoChat.peerConnection.setRemoteDescription(rtcOffer)
      .then(() => {
        // remote description successfully set
        console.log('Remote description successfully set');
      })
      .catch((error) => {
        // failed to set remote description
        console.error('Error setting remote description:', error);
      });
      VideoChat.peerConnection.createAnswer(
        function (answer) {
          console.warn(answer, "Cehck answer")
          VideoChat.peerConnection.setLocalDescription(answer);
          VideoChat.socket.emit('answer', JSON.stringify(answer));
        },
        function (err) {
          console.log(err, "Error in create answer");
        }
      );
    }
  },

  onOffer: function (offer) {
    console.log('Got an offer')
    // console.log(offer);
    VideoChat.socket.on('token', VideoChat.onToken(VideoChat.createAnswer(offer)));
    VideoChat.socket.emit('token');
  },
  onAnswer: function (answer) {
    var rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    console.log("Check answer",rtcAnswer.RTCSessionDescription)
    VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
  },

  onAddStream: function (event) {
    VideoChat.remoteVideo = document.getElementById('remote-video');
    VideoChat.remoteVideo.srcObject = event.stream;
    console.log("Event:", event.stream)
  },

};


VideoChat.videoButton = document.getElementById('get-video');

VideoChat.videoButton.addEventListener(
  'click',
  VideoChat.requestMediaStream,
  false
);


VideoChat.callButton = document.getElementById('call');

VideoChat.callButton.addEventListener(
  'click',
  VideoChat.startCall,
  false
);