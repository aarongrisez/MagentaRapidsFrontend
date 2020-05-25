import { useRef, useEffect, useState } from "react";
import React from "react";
import p5 from "p5";
import { Sketch } from "./Sketch"

export const SketchContainer = (props) => {
  const [myP5, setP5] = useState();
  const ref = useRef(null);

  useEffect(() => {
    const sketch = new p5(Sketch, ref.current)
    setP5(sketch)
  }, [ref])

  return (
    <div ref={ref}>
    </div> 
  )
  
}
