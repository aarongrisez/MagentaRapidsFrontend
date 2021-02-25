import React, { Fragment } from "react";
import { SketchContainer } from "../sketch/SketchContainer";
import { Audio } from "../audio/Audio";
import { LastPlayedNote } from "../text/LastPlayedNote";
import BaseLayout from "../layout/BaseLayout";
import TimeseriesChart from "../timeseries/TimeseriesChart"

export const HomePage = () => {
  
  const branding = {
    name: "magenta rapids"
  }

  const links = [
    {
      title: "about",
      href: "/about"
    },
    {
      title: "support",
      href: "/support"
    },
    {
      title: "contact",
      href: "/contact"
    }
  ]

  return (
    <Fragment>
      <BaseLayout 
        headerProps={{branding: branding, links: links}}
        chart={<TimeseriesChart/>}
        audio={<Audio />}
        latestNote={<LastPlayedNote/>}
      />
    </Fragment>
  )
  
}
