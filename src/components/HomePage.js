import React from "react";
import { SketchContainer } from "./Sketch/SketchContainer"
import { Audio } from "./Audio/Audio"
import { AudioSend } from "./Audio/AudioSend"

export const HomePage = () => {

  return (
    <div>
      <h1>magenta rapids</h1>
      <SketchContainer />
      <Audio />
      <AudioSend />
    </div> 
  )
  
}
