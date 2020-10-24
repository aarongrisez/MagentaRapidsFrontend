import React, { useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WS_PROTOCOL } from "../../constants"


export const LastPlayedNote = () => {
  // eslint-disable-next-line
  const [socketUrl, setSocketUrl] = useState(WS_PROTOCOL + process.env.REACT_APP_BACKEND_URL + 'ws', { share: true });

  const { lastMessage } = useWebSocket(socketUrl, { share: true })

  const data = lastMessage ? JSON.parse(JSON.parse(lastMessage.data)) : ""
  const pretty_json = JSON.stringify(data, null, 2) 

  return (<div><pre>last note: {pretty_json}</pre></div>);
}