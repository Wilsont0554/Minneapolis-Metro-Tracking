import React, { useState, useEffect, useRef } from "react";
import InfoBox from "./components/InfoBox"
import MetroMap from "./components/MetroMap"

var currentLineID = 0; //represents the line_id who's information is being dispalyed

function App() {

  
  const [stationLines, setStationStops] = useState([]); //represents all line that stop at this station
  const [count, setCount] = useState(0);
  const [displayedPlaceCode, setPlaceCode] = useState([]); //represents the place code that the user has sleected

  //Used for keeping track of the line_id and it's color
  const lineColors = new Map([
    ['901', '#7dbef9'],
    ['902', '#70a580'],
    ['903', '#fa7369'],
    ['904', '#eeb071']
  ]);

  useEffect(() => {
    //document.addEventListener('wheel', Zoom);
    
    //document.addEventListener('mousedown', pan);
    //document.addEventListener('mouseup', endPan);

  });

  //interval for updating 
  function useInterval(callback, delay) {
    const savedCallback = useRef();
   
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  /*
  * Updates the fetch every 10 seconds while the infobox is displayed
  */
  useInterval(() => {
    if (document.getElementById('hide').style.display == 'inline')
    {
      var direction0PlaceCode = displayedPlaceCode;
      var direction1PlaceCode = displayedPlaceCode;
      //if there is more than one place code
      if (displayedPlaceCode.length > 4){
        direction0PlaceCode = displayedPlaceCode.substring(0,4);
        direction1PlaceCode = displayedPlaceCode.substring(4,8);
      }

      displayInfoBox(currentLineID, false, direction0PlaceCode, direction1PlaceCode);
    }
    setCount(count + 1);
  }, 10000);

  /*
  * Used for making sure the infobox in above the station, updates every 10ms
  */
  useInterval(() => {
    if (document.getElementById('hide').style.display == 'inline')
    {
      moveInfoBox(displayedPlaceCode);
    }
    setCount(count + 1);
  }, 10);


  function getDisplayedPlaceCode(){
    return displayedPlaceCode;
  }

  /*
  * Updating assigns all the lines at the current staion that was previously calcualted in MetroMap.jsx to the stationLines array.
  */
  function updateLinesAtStation(linesAtCurrentStation) {
    
    //remove all previous line_ids
    stationLines.length = 0;

    //add current line_ids
    linesAtCurrentStation.forEach(currentLine => {
      stationLines.push(currentLine);
    });
    setStationStops(stationLines);
  }

  /*
  * Resets all line icon backgrouns
  * Then, sets the background color of the first, currently showing line information to the previsouly assigned color in the lineColors array
  */
  function disaplyInitialLineIcon(lineID){
    for (let i = 1; i <stationLines.length; i++){
      document.getElementById(stationLines[i]).style.setProperty("--background-color", 'rgb(234, 234, 234)');
    }    
    document.getElementById(lineID).style.setProperty("--background-color", lineColors.get(lineID));
    setCount(1);
  }

  /*
  * Changes the display on the line icon colors
  */
  function changeLine(lineID, placeCode, moveBox) {

    //Resets all background colors
    for (let i = 0; i < stationLines.length; i++) {
      const element = document.getElementById(stationLines[i]);
      element.style.setProperty("--background-color", 'rgb(234, 234, 234)');
    }

    //sets correct background color to the selected icon
    document.getElementById(lineID).style.setProperty("--background-color", lineColors.get(lineID));
    
    setCount(1);
    displayInfoBox(lineID, moveBox, placeCode, placeCode);
  }

    /*
    *   First, get a specific line's planned stops for a specific station (placeCode)
    *   Then, Check for the alternate diretion
    *   Then disaply the text for the next train/bus going both direction
    */
  async function displayInfoBox(lineID, moveBox, direction0PlaceCode, direction1PlaceCode ){
    currentLineID = lineID;

    //gets data from one direction    
    const currentStop0BoundFetch = await fetch('https://svc.metrotransit.org/nextrip/' + lineID + '/0/' + direction0PlaceCode);
    var currentStop0Bound = await currentStop0BoundFetch.json();            
    
    //gets data for the opposite direction
    const currentStop1BoundFetch = await fetch('https://svc.metrotransit.org/nextrip/' + lineID + '/1/' + direction1PlaceCode);
    var currentStop1Bound = await currentStop1BoundFetch.json();
    
    var infoBoxCoords = document.getElementById('hide');

    var currentStopName = currentStop0Bound.stops[0].description;
    var currentLineName = currentStop0Bound.departures[1].route_short_name;

    var current0BoundDirection = currentStop0Bound.departures[0].direction_text;
    var current1BoundDirection = currentStop1Bound.departures[0].direction_text;

    //display on info to user
    infoBoxCoords.style.display = 'inline';
    
    document.getElementById('stopName').innerHTML = currentStopName;
    
    document.getElementById('currentLine').innerHTML = currentLineName;
    
    document.getElementById('current0Direction').innerHTML = current0BoundDirection;
    document.getElementById("placeCode0Arrival").innerHTML = (currentStop0Bound.departures[0].departure_text);


    document.getElementById('current1Direction').innerHTML = current1BoundDirection;
    document.getElementById("placeCode1Arrival").innerHTML = (currentStop1Bound.departures[0].departure_text);
    
    if (moveBox)
    {
      disaplyInitialLineIcon(lineID);
      moveInfoBox(direction0PlaceCode);
    }
  }

  /*
  * Moves the box to the station that the user clicked.
  * Adjusted height based on the radius of the station icon
  */
  function moveInfoBox(placeCode){

    var direction0PlaceCode = placeCode;

    //if there is more than one place code
    if (placeCode.length > 4){
      direction0PlaceCode = placeCode.substring(0,4);
    }
    
    var circleElement = document.getElementById(direction0PlaceCode);
    var infoBoxCoords = document.getElementById('hide');
    
    var circleRect = circleElement.getBoundingClientRect();
    var infoBoxRect = infoBoxCoords.getBoundingClientRect();

    var infoBoxCenterLeftRight = (infoBoxRect.right - infoBoxRect.left);
    var infoBoxCenterUpDown = (infoBoxRect.bottom - infoBoxRect.top);

    infoBoxCoords.style.left = Math.max(((circleRect.right - (circleElement.getAttribute('r'))) - (infoBoxCenterLeftRight/2)),0) + 'px';
    infoBoxCoords.style.top = Math.max(((circleRect.top) - infoBoxCenterUpDown),0) + 'px';

    
  }  

  return (
    <>
      <MetroMap moveInfoBox={moveInfoBox} getDisplayedPlaceCode= {getDisplayedPlaceCode} currentLineID ={currentLineID} setPlaceCode={setPlaceCode} placeCode = {displayedPlaceCode} displayInfoBox ={displayInfoBox} stationsStops={stationLines} updateLinesAtStation={updateLinesAtStation}/>
      <InfoBox changeLine = {changeLine} lineColors= {lineColors} placeCode = {displayedPlaceCode} stationsStops={stationLines} displayInfoBox ={displayInfoBox}/>
    </>
  )
}

export default App
