import React from 'react'
import LineIcon from "./LineIcon";
import MetroMap from "./MetroMap";

export default function InfoBox(props) {

    const {placeCode, displayInfoBox, stationsStops, lineColors, changeLine} = props;

    return(
        
        <div id = "hide" className = "infoBox" style={{'--infoBoxScale' : 1}}> 
            <div className = "infoCardLeft">
                <h4 id = "stopName">:  </h4>
                <span id = 'errorMessage'> </span>
                <p>Metro Line: <span id = "currentLine"></span></p>
                <p>Direction: <span id = "current0Direction"></span>
                <br/>
                Arriving in: <span id = "placeCode0Arrival"> </span>
                <br/>
                Direction: <span id = "current1Direction"></span>
                <br/>
                Arriving in: <span id = "placeCode1Arrival"> </span> </p>
            </div>
            
            <div className = "infoCardRight">
                <ul className = "lineNumberCard">
                    {stationsStops.map((line, index) => {
                        return (
                            <LineIcon changeLine = {changeLine} key = {index} index={index} line = {line} displayInfoBox ={displayInfoBox} placeCode = {placeCode} lineColors= {lineColors}>
                                {line}
                            </LineIcon>
                        )
                    })}
                    
                </ul>
            </div>
        
        </div>
    )
}