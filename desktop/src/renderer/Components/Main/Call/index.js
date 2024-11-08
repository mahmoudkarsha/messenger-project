import React, { useEffect, useState } from 'react';
import { Icon } from '../../../Assets/styled/main';
import { BiPhoneCall } from 'react-icons/bi';

export default function Call({
  showCallModal,
  setShowCallModal,
  setCallData,
  selectedChat,
  userNumber,
  peerConnectionRefrence,
  callerRingRefrence,
  remoteAudioRefrence,
  wsserver,
  video,
}) {
  async function handleCallClick() {
    try {
      if (showCallModal) return;
      setShowCallModal(true);
      const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video ? video : false,
      });
      peerConnectionRefrence.current = new RTCPeerConnection();
      localStream
        .getTracks()
        .forEach((track) =>
          peerConnectionRefrence.current.addTrack(track, localStream)
        );
      peerConnectionRefrence.current.onicecandidate = (e) => {
        if (e.candidate) {
          console.log('candidate');
          wsserver.emit('candidate', {
            sender_number: userNumber,
            reciever_number: selectedChat.contact_number,
            label: e.candidate.sdpMLineIndex,
            id: e.candidate.sdpMid,
            candidate: e.candidate.candidate,
          });
        }
      };

      peerConnectionRefrence.current.ontrack = (e) =>
        (remoteAudioRefrence.current.srcObject = e.streams[0]);

      peerConnectionRefrence.current.createOffer().then((offer) => {
        peerConnectionRefrence.current.setLocalDescription(offer);
        // peerConnectionRefrence.current.setRemoteDescription(offer);
        setCallData({
          isCaller: true,
          reciever_name: selectedChat.contact?.name,
          reciever_number: selectedChat.contact_number,
          status: 'calling',
          localStream,
          isVideo: video,
        });

        callerRingRefrence.current.currentTime = 0;
        callerRingRefrence.current.play();
        wsserver.emit('client-call', {
          sender_number: userNumber,
          reciever_number: selectedChat.contact_number,
          offer,
          isVideo: video,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Icon onClick={handleCallClick}>
      <BiPhoneCall color="#00afb9" size={24} />
    </Icon>
  );
}
