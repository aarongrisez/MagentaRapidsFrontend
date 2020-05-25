import React, { useRef, useEffect, useState } from "react";
import { AMSynth, PolySynth, Transport, Event } from 'tone';
import useWebSocket from "react-use-websocket"

export const Audio = () => {
  const [channels, setChannels] = useState(2);
  const [channelPoly, setChannelPoly] = useState(4);
  const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/ws');
  const [debug, setDebug] = useState(true)
  const [releaseDisabled, setReleaseDisabled] = useState(false)
  const synths = useRef([]);
  const [events, setEvents] = useState([])

  const handleReceiveMessage = (message) => {
    const data = JSON.parse(message.data);
    data.forEach((message, index) => {
      events.push(new Event((time) => {
        synths.current[message.channel].triggerAttackRelease(
          message.note,
          message.duration,
        )
      }).start(Transport.nextSubdivision(message.time)))
      console.log(Transport.nextSubdivision(message.time));
    });
  }

  useWebSocket(socketUrl, {
    onMessage: handleReceiveMessage,
    share: true
  });

  useEffect(() => {
    Transport.start()
    for (var i = 0; i < channels; i++) {
      synths.current.push(new PolySynth(channelPoly, AMSynth).toMaster());
    }
  }, []);

  const handleReleaseAll = () => {
    console.log("Releasing all pitches")
    setReleaseDisabled(true);
    events.forEach((event) => {
      event.dispose();
    })
    synths.current.forEach((synth) => {
      synth.releaseAll();
    })
  }

  if (debug) {
    return (
      <button onClick={handleReleaseAll} disabled={releaseDisabled}>Release All</button>
    )
  }
  else {
    return null
  }

};