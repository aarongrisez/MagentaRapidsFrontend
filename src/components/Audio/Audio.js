import React, { useRef, useEffect, useState } from "react";
import { AMSynth, PolySynth, Transport, Master, Event } from 'tone';
import useWebSocket from "react-use-websocket"

export const Audio = () => {
  const [channels, setChannels] = useState(8);
  const [channelPoly, setChannelPoly] = useState(4);
  const [socketUrl, setSocketUrl] = useState('ws://' + process.env.REACT_APP_BACKEND_URL + 'ws', { share: true });
  const [active, setActive] = useState(false)
  const synths = useRef([]);

  const handleReceiveMessage = (message) => {
    const data = JSON.parse(JSON.parse(message.data));
    console.log(data)
    if (active) {
      data.notes.forEach(note => {
        const event = new Event((time) => {
          synths.current[data.channel].triggerAttackRelease(
            note.note,
            note.duration,
          )
        }).start(Transport.nextSubdivision(message.time));
      })
    }
  }

  useWebSocket(socketUrl, {
    onMessage: handleReceiveMessage,
    share: true
  });

  useEffect(() => {
    if (active) {
      Master.mute = false;
      Transport.start()
      if (Array.isArray(synths) && synths.length) {}
      else {
        for (var i = 0; i < channels; i++) {
          synths.current.push(new PolySynth(channelPoly, AMSynth).toMaster());
        }
      }
    }
    else {
      Master.mute = true;
    }
  }, [channelPoly, channels, active]);

  return (
    <div>
      {active ? <p>sound is on</p> : <p>sound is off</p>}
      <button onClick={() => setActive(!active)}>toggle sound</button>
    </div>
  )

};