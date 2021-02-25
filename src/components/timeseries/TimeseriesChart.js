/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from "react";
import Ring from "ringjs";
import { format } from "d3-format";
import useWebSocket from "react-use-websocket"
import { WS_PROTOCOL } from "../../constants"

import {
    TimeSeries,
    TimeRange,
    TimeEvent,
} from "pondjs";

import {
    ChartContainer, 
    ChartRow, 
    Charts, 
    YAxis, 
    ScatterChart, 
    Resizable, 
} from "react-timeseries-charts"

const sec = 1000;
const minute = 60 * sec;
const rate = 1000;
const increment = 1000;

const TimeseriesChart = () => {

    const [highlight, setHighlight] = useState(null);
    const [time, setTime] = useState(new Date());
    const [events, setEvents] = useState(new Ring(2000))
    // eslint-disable-next-line
    const [socketUrl, setSocketUrl] = useState(WS_PROTOCOL + process.env.REACT_APP_BACKEND_URL + 'ws', { share: true });

    const handleReceiveMessage = (message) => {
        const data = JSON.parse(JSON.parse(message.data));
        const t = new Date();
        const event = new TimeEvent(t, data.notes[0].note);
        const newEvents = events;
        newEvents.push(event);
        setEvents(newEvents);
      }
    
    useWebSocket(socketUrl, {
        onMessage: handleReceiveMessage,
        share: true
    });

    const getNewEvent = () => {
        const t = new Date();
        return new TimeEvent(t, parseInt(Math.random() * 1000, 10));
    };
    
    const handleMouseNear = point => {
        setHighlight(point);
    };

    const handleNewEvent = event => {
        console.log(event)
        const event2 = getNewEvent();

        // Raw events
        const newEvents = events;
        newEvents.push(event2);
        setEvents(newEvents);
    }

    useEffect(() => {
        //
        // Setup our interval to advance the time
        //

        const interval = setInterval(() => {
            setTime(prevTime => new Date(prevTime.getTime() + increment))
        }, rate)

        return () => clearInterval(interval)

    }, [])

    const latestTime = `${time}`;

    const formatter = format(".2f");
    let infoValues = [];
    if (highlight) {
        const valueText = `${formatter(highlight.event.get(highlight.column))}`;
        infoValues = [{ label: "Pitch", value: valueText }];
    }

    const perEventStyle = (column, event) => {
        const color = "steelblue"; // heat[Math.floor((1 - event.get("station1") / 40) * 9)];
        return {
            normal: {
                fill: color,
                opacity: 1.0
            }
        };
    };

    //
    // Create a TimeSeries for our raw, 5min and hourly events
    //

    const eventSeries = new TimeSeries({
        name: "raw",
        events: events.toArray()
    });

    // Timerange for the chart axis
    const timeWindow = 2 * minute;
    const endTime = new Date(time.getTime() + 3 * sec);
    const beginTime = new Date(endTime.getTime() - timeWindow)
    const timeRange = new TimeRange(beginTime, endTime);

    const charts = (
        <Charts>
            <ScatterChart 
                axis="y" 
                series={eventSeries} 
                style={perEventStyle} 
                onMouseNear={p => handleMouseNear(p)}
                highlight={highlight}
                info={infoValues}
                infoHeight={28}
                infoWidth={110}
                infoOffsetY={10}
                infoStyle={{ box: {
                    fill: "black",
                    color: "#DDD"
                }}}
            />
        </Charts>
    );

    const dateStyle = {
        fontSize: 12,
        color: "#AAA",
        borderWidth: 1,
        borderColor: "#F4F4F4"
    };

    return (
        <div>
            <button onClick={handleNewEvent}>FIRE TEST EVENT</button>
            <div className="row">
                <div className="col-md-8">
                    <span style={dateStyle}>{latestTime}</span>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-12">
                    <Resizable>
                        <ChartContainer timeRange={timeRange} timeAxisAngledLabels={true}>
                            <ChartRow height="150">
                                <YAxis
                                    id="y"
                                    label="Pitch"
                                    min={0}
                                    max={1500}
                                    width="70"
                                    type="linear"
                                />
                                {charts}
                            </ChartRow>
                        </ChartContainer>
                    </Resizable>
                </div>
            </div>
        </div>
    );
}

// Export example
export default TimeseriesChart;
