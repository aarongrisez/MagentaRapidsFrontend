import React from "react";
import { SketchContainer } from "./Sketch/SketchContainer"
import { Audio } from "./Audio/Audio"
import { AudioSend } from "./Audio/AudioSend"

export const HomePage = () => {

  return (
    <div>
      <h1>Magenta Rapids</h1>
      <SketchContainer />
      <Audio />
      <AudioSend />
    </div> 
  )
  
}
