import React, { useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"


export const AudioSend = () => {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/ws', { share: true });

  const {
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, { share: true });

  const handleClickSendMessage = useCallback(() =>
    sendJsonMessage(
      [{
        "channel": 1,
        "note": JSON.stringify(Math.floor(120 + Math.random() * Math.floor(2000))),
        "duration": "2n",
        "time": "4n",
        "velocity": "1"
      }]
  ), []);

  return (
    <div>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send a note
      </button>
      <br />
      {lastMessage ? <span>Last note: {lastMessage.data}</span> : null}
    </div>
  );

}