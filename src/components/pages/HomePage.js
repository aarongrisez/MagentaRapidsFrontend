import React from "react";
import { SketchContainer } from "../sketch/SketchContainer";
import { Audio } from "../audio/Audio";
import { LastPlayedNote } from "../text/LastPlayedNote";

export const HomePage = () => {

  return (
    <div>
      <h1>magenta rapids</h1>
      <SketchContainer />
      <Audio />
      <LastPlayedNote />
    </div> 
  )
  
}
