import React, { useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"


export const AudioSend = () => {
  const [socketUrl, setSocketUrl] = useState('ws://mr-dev-1227.aarongrisez.com/backend/ws', { share: true });

  const {
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, { share: true });

  const handleClickSendMessage = useCallback(() =>
    sendJsonMessage(
      [{
        "channel": 5,
        "note": [JSON.stringify(Math.floor(120 + Math.random() * Math.floor(2000)))],
        "duration": "2n",
        "time": "4n",
        "velocity": "1"
      }]
  ), [sendJsonMessage]);

  const data = lastMessage ? JSON.parse(lastMessage.data) : ""
  const pretty_json = JSON.stringify(data, null, 2) 

  return (
    <div>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        send a note
      </button>
      <br />
      <div><pre>last note: {pretty_json}</pre></div>
    </div>
  );

}