import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import audioTrack from "../../Assets/sounds/test.wav";

import { CiPlay1, CiPause1 } from "react-icons/ci";

function AudioTract(props) {
  const [played, setPlayed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef();

  useEffect(() => {
    const audio = new Audio(audioTrack);
    audio.setAttribute("muted", "muted");

    audio.addEventListener("timeupdate", (e) => {
      setTime(audioRef.current.currentTime.toFixed(2));
      setDuration(audioRef.current.duration);
    });

    audioRef.current = audio;
  }, []);

  // useEffect(()=> {

  // },[time,duration])
  function playTrack() {
    audioRef.current.play();
    setPlayed(true);
  }

  function pauseTrack() {
    audioRef.current.pause();
    setPlayed(false);
  }
  return (
    <Wrapper>
      <Time dir="ltr">{getSeconds(duration)}</Time>

      <Progress
        onClick={(e) => {
          audioRef.current.currentTime = e.target.value;
          console.log(e.target.value);
        }}
        type="range"
        max={duration}
      />
      <div style={{ margin: "0 10px 0 10px" }}>
        {(played && (
          <div onClick={pauseTrack}>
            <CiPause1 size={29} />
          </div>
        )) || (
          <div onClick={playTrack}>
            <CiPlay1 size={29} />
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default AudioTract;

export const Wrapper = styled.div`
  position: relative;
  height: 100px;
  width: 400px;
  z-index: 1000000;
  background-color: #fff;
  top: 100px;
  right: 100px;
  border-radius: 10px;
  border: solid 1px #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Time = styled.p`
  width: 120px;
  height: 20px;
  position: absolute;
  bottom: 0;
  left: 20px;
`;

export const Progress = styled.input`
  width: 100%;
  margin-right: 10px;
`;

function getSeconds(sec) {
  let minutes = 0;
  let seconds = Math.ceil(sec);
  while (seconds > 59) {
    minutes = minutes + 1;
    seconds = seconds - 60;
  }
  if (String(minutes).length === 1) {
    minutes = "0" + minutes;
  }
  if (String(seconds).length === 1) {
    seconds = "0" + seconds;
  }
  return `${minutes} : ${seconds}`;
}
