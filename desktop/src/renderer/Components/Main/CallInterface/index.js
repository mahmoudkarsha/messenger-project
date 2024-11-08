import React from 'react';
import './callinterface.css';
import RenderProfileImage from '../Menu/RenderProfileImage';
import { MdOutlineCallEnd, MdOutlineCall } from 'react-icons/md';
export default function CallInterface({
  showCallModal,
  setShowCallModal,
  callData,
  setCallData,
  user,
  wsserver,
  savedCandidates,
  userNumber,
  peerConnectionRefrence,
  remoteAudioRefrence,
  callRingRefrence,
  callerRingRefrence,
}) {
  async function onAccept() {
    try {
      const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callData.isVideo,
      });

      peerConnectionRefrence.current = new RTCPeerConnection();

      localStream.getAudioTracks().forEach((track) => {
        peerConnectionRefrence.current.addTrack(track, localStream);
      });

      peerConnectionRefrence.current.onicecandidate = (e) => {
        if (e.candidate) {
          wsserver.emit('candidate', {
            sender_number: userNumber,
            reciever_number: callData.sender_number,
            label: e.candidate.sdpMLineIndex,
            id: e.candidate.sdpMid,
            candidate: e.candidate.candidate,
          });
        }
      };

      peerConnectionRefrence.current.ontrack = (e) => {
        remoteAudioRefrence.current.srcObject = e.streams[0];
      };

      await peerConnectionRefrence.current.setRemoteDescription(
        new RTCSessionDescription(callData.remoteOffer)
      );

      if (savedCandidates.length) {
        console.log(callData, savedCandidates);
        savedCandidates.forEach((c) =>
          peerConnectionRefrence.current.addIceCandidate(c)
        );
      }

      const answer = await peerConnectionRefrence.current.createAnswer();
      await peerConnectionRefrence.current.setLocalDescription(answer);

      wsserver.emit('client-call-answer', {
        reciever_number: callData.sender_number,
        sender_number: userNumber,
        answer: answer,
      });

      let seconds = 0;

      callRingRefrence.current.pause();
      callRingRefrence.current.currentTime = 0;

      setCallData((prev) => {
        return {
          ...prev,
          localStream,
          status: 'connected',
          intervalId: setInterval(() => {
            seconds = seconds + 1;
            setCallData((ps) => {
              return {
                ...ps,
                seconds,
              };
            });
          }, 990),
        };
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function onCloseCall() {
    console.log('Clossing ....');
    clearInterval(callData.intervalId);
    callRingRefrence.current.pause();
    callRingRefrence.current.currentTime = 0;
    callerRingRefrence.current.pause();
    callerRingRefrence.current.currentTime = 0;
    peerConnectionRefrence.current.close();
    peerConnectionRefrence.current = null;
    if (callData.localStream && callData.localStream instanceof MediaStream)
      callData.localStream.getTracks().forEach((t) => t.stop());
    savedCandidates.filter((el) => false);
    setShowCallModal(false);
    setCallData({});

    wsserver.emit('call-ended', {
      sender_number: userNumber,
      reciever_number: callData.isCaller
        ? callData.reciever_number
        : callData.sender_number,
    });
  }

  function onCallReject() {
    callRingRefrence.current.pause();
    callRingRefrence.current.currentTime = 0;
    peerConnectionRefrence.current = null;
    setShowCallModal(false);
    savedCandidates.filter((el) => false);
    setCallData({});

    wsserver.emit('call-rejected', {
      sender_number: user.number,
      reciever_number: callData.sender_number,
    });
  }

  return (
    <div className="call-interface-wrapper">
      <RenderProfileImage
        number={
          callData.isCaller ? callData.reciever_number : callData.sender_number
        }
        height={100}
        width={100}
      />
      <br />
      {callData.isCaller && (
        <>
          <p
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: '#fff',
            }}
          >
            {callData.reciever_name}
          </p>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: '#fff',
            }}
          >
            {callData.reciever_number}
          </p>
        </>
      )}

      {!callData.isCaller && (
        <>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {callData.sender_name}
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {callData.sender_number}
          </p>
        </>
      )}

      {callData.status === 'connected' ? (
        <p>{renderSeconds(callData.seconds)}</p>
      ) : (
        renderCallStatus(callData.status)
      )}

      <div className="call-actions-wrapper">
        {!callData.isCaller && callData.status === 'calling' && (
          <div className="call-action-icon green" onClick={onAccept}>
            <MdOutlineCall color="fff" />
          </div>
        )}

        {((callData.status === 'connected' || callData.isCaller) && (
          <div className="call-action-icon red" onClick={onCloseCall}>
            <MdOutlineCallEnd color="fff" />
          </div>
        )) || (
          <div className="call-action-icon red" onClick={onCallReject}>
            <MdOutlineCallEnd color="fff" />
          </div>
        )}
      </div>

      <audio
        autoPlay
        ref={remoteAudioRefrence}
        style={{
          display: 'none',
        }}
        controls
        src=""
      ></audio>
    </div>
  );
}

function renderSeconds(sec) {
  let seconds = sec || 0;
  let minutes = 0;
  while (seconds > 59) {
    seconds = seconds - 60;
    minutes = minutes + 1;
  }
  return `${String(minutes).length === 1 ? '0' + minutes : minutes}:${
    String(seconds).length === 1 ? '0' + seconds : seconds
  }`;
}

function renderCallStatus(s) {
  if (s === 'calling')
    return (
      <p
        style={{
          color: '#07afcc',
        }}
      >
        Lê Dikeve
      </p>
    );
}
