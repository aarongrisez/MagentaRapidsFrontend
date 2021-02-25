import React, { useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WS_PROTOCOL } from "../../constants"

export const AudioSend = () => {
  // eslint-disable-next-line
  const [socketUrl, setSocketUrl] = useState(WS_PROTOCOL + process.env.REACT_APP_BACKEND_URL + 'ws', { share: true });

  const {
    sendJsonMessage,
    readyState,
  } = useWebSocket(socketUrl, { share: true });

  const handleClickSendMessage = useCallback(() =>
    sendJsonMessage(
      {
        "channel": 5,
        "notes": [
          {
            "note": JSON.stringify(Math.floor(120 + Math.random() * Math.floor(2000))),
            "duration": "2",
            "time": "4",
            "velocity": "1"
          }
        ]
      }
  ), [sendJsonMessage]);

  return (
    <div>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        send a note
      </button>
    </div>
  );

}