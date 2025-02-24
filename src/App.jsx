import React, { useState, useEffect, useRef } from "react";
import InfoBox from "./components/InfoBox"
import MetroMap from "./components/MetroMap"
import { scryRenderedDOMComponentsWithTag } from "react-dom/test-utils";

var currentLineID = 0; //represents the line_id who's information is being dispalyed
var currentLinesStops = [];
var displayedTripID = 0;
var tracking = 0;
var zoomAmount = 1;

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
    if (document.getElementById('hide').style.display == 'flex')
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
    if (document.getElementById('hide').style.display == 'flex')
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

  function setCurrentLinesStops(stationStops){
    currentLinesStops = stationStops;
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
    document.body.style.setProperty("--infoBx-background", lineColors.get(lineID));    

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
    document.body.style.setProperty("--infoBx-background", lineColors.get(lineID));    

    setCount(1);
    displayInfoBox(lineID, moveBox, placeCode, placeCode);
  }

    /*
    *   First, get a specific line's planned stops for a specific station (placeCode)
    *   Then, Check for the alternate diretion
    *   Then disaply the text for the next train/bus going both direction
    */
  async function displayInfoBox(lineID, moveBox, direction0PlaceCode, direction1PlaceCode){
    currentLineID = lineID;
    var currentStopBound = [];
    var currentPlaceCode = direction0PlaceCode;

    if (direction0PlaceCode != 0){
      //gets data from one direction    
      const currentStop0BoundFetch = await fetch('https://svc.metrotransit.org/nextrip/' + lineID + '/0/' + direction0PlaceCode);
      var currentStop0Bound = await currentStop0BoundFetch.json();
      var current0BoundDirection = currentStop0Bound.departures[0].direction_text;
      document.getElementById('current0Direction').innerHTML = current0BoundDirection;
      document.getElementById("placeCode0Arrival").innerHTML = (currentStop0Bound.departures[0].departure_text);
      currentStopBound = currentStop0Bound;
      displayedTripID = currentStopBound.departures[0].trip_id;
    }
    else if (direction0PlaceCode == 0){
      displayedTripID = currentStopBound.departures[0].trip_id;
      currentPlaceCode = direction1PlaceCode;
    }
    
    if (direction1PlaceCode != 0){
      //gets data for the opposite direction
      const currentStop1BoundFetch = await fetch('https://svc.metrotransit.org/nextrip/' + lineID + '/1/' + direction1PlaceCode);
      var currentStop1Bound = await currentStop1BoundFetch.json();
      var current1BoundDirection = currentStop1Bound.departures[0].direction_text;
      document.getElementById('current1Direction').innerHTML = current1BoundDirection;
      document.getElementById("placeCode1Arrival").innerHTML = (currentStop1Bound.departures[0].departure_text);
      currentStopBound = currentStop1Bound;
    }                
       
    var infoBoxCoords = document.getElementById('hide');

    var currentStopName = currentStopBound.stops[0].description;
    var currentLineName = currentStopBound.departures[1].route_short_name;
    
    document.getElementById('stopName').innerHTML = currentStopName;
    document.getElementById('currentLine').innerHTML = currentLineName;
    
    if (moveBox)
    {
      disaplyInitialLineIcon(lineID);
      moveInfoBox(currentPlaceCode);
    }
    //display on info to user
    infoBoxCoords.style.display = 'flex';
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

    if (screen.width > 1000){
      infoBoxCoords.style.left = Math.max(((circleRect.right - (circleElement.getAttribute('r'))) - (infoBoxCenterLeftRight/2)),0) + 'px';
      infoBoxCoords.style.top = Math.max(((circleRect.top) - infoBoxCenterUpDown),0) + 'px';
    }
    else{
      infoBoxCoords.style.bottom = 0 + 'px';
    }
  }  

  //Moves train to next station
  async function trackTransport(directionCode){
    for (let i = 0; i < currentLinesStops.length; i++){
      
      if (displayedPlaceCode == currentLinesStops[i].place_code){
        
        //gets data from one direction    
        const nextStopFetch = await fetch('https://svc.metrotransit.org/nextrip/' + currentLineID + '/' + directionCode + '/' + currentLinesStops[i+1].place_code);
        var nextStop = await nextStopFetch.json();        
        
        if (tracking == 0 && nextStop.departures[0].trip_id == displayedTripID){
          tracking = 1;
          //console.log(nextStop.departures[0].trip_id);
          displayInfoBox(currentLineID, false, currentLinesStops[i+1].place_code, 0);
          setPlaceCode(currentLinesStops[i+1].place_code);
        }
      }
    }
  }
  
  function zoom(direction){
    console.log(zoomAmount);
      if (direction == 1 && zoomAmount > 0.75){
        zoomAmount -= 0.25
      }
      else if (direction == 0 && zoomAmount < 2) {
        zoomAmount += 0.25
      }
      document.getElementById('newMap').style.scale = zoomAmount;
    
  }

  return (
    <>
      
      <MetroMap setCurrentLinesStops = {setCurrentLinesStops} moveInfoBox={moveInfoBox} getDisplayedPlaceCode= {getDisplayedPlaceCode} currentLineID ={currentLineID} setPlaceCode={setPlaceCode} placeCode = {displayedPlaceCode} displayInfoBox ={displayInfoBox} stationsStops={stationLines} updateLinesAtStation={updateLinesAtStation}/>
      <div className="zoomControll">      
        <button className = 'zoom' onClick={() => zoom(1)}> - </button>
        <button className = 'zoom' onClick={() => zoom(0)}> + </button>

      </div><InfoBox trackTransport = {trackTransport} changeLine = {changeLine} lineColors= {lineColors} placeCode = {displayedPlaceCode} stationsStops={stationLines} displayInfoBox ={displayInfoBox}/>
    </>
  )
}

export default App
