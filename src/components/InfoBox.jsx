import React from 'react'
import LineIcon from "./LineIcon";
import MetroMap from "./MetroMap";

export default function InfoBox(props) {

    const {placeCode, displayInfoBox, stationsStops, lineColors, changeLine, trackTransport} = props;

    function closeInfoBox(){
        document.getElementById('hide').style.display = '';
    }

    return(
        
        <div id = "hide" className = "infoBox" style={{'--infoBoxScale' : 1}}> 
            <div id = "stationName" className = "stationName">
                <div className = 'insideStationName'>
                    <div className = "infoCardLeft">
                        <p id = "stopName" className='stopName'>:  </p>
                    </div>
                    
                    <div className = "infoCardRight">
                        <button className='exit' onClick={ () => closeInfoBox()}></button>
                    </div>
                </div>
            </div>

            {/*
            <button className='trackTrain' onClick={ () => trackTransport(0)}>

            </button>
            */}
            <div className = 'insideContainter'>
                
                <div className = "infoCardLeft">
                    <span id = 'errorMessage'> </span>
                    <p className='Info'>Metro Line: <span id = "currentLine" className='Info'></span></p>

                    <p className='Info'>Direction: <span id = "current0Direction" className='Info'></span>
                    <br/>
                    Arriving in: <span id = "placeCode0Arrival" className='Info'> </span>
                    <br/>
                    Direction: <span id = "current1Direction" className='Info'></span>
                    <br/>
                    Arriving in: <span id = "placeCode1Arrival" className='Info'> </span> </p>
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

                <div className = 'pointer'>

                </div>
            </div>

        </div>
    )
}