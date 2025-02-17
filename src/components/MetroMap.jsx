import * as React from "react";

var allRoutes = []; //represents avery route
const numberOfRoutes = 5;

export default function MetroMap (props) {
    
  const {moveInfoBox, setPlaceCode, displayInfoBox, updateLinesAtStation, displayedPlaceCode, getDisplayedPlaceCode, setCurrentLinesStops} = props;

  //st1701
  //const apiKey = '204c7b0b6e7c4dfda32729879714dcf4';
  //const apiURL = 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=204c7b0b6e7c4dfda32729879714dcf4&mapid=40380&max=5'
  //const apiURL = 'http://swopenapi.seoul.go.kr/api/subway/sample/xml/realtimePosition/0/5/1%ED%98%B8%EC%84%A0';

  /*
  * @placeCode represents the palce code of the stop, or sometimes, two place codes in the same string
  * The function checks if there are more than one place code, if there is, then sperate them into two variables, 
  *     otherwise, it doesn't matter if we use direction0PlaceCode or direction1PlaceCode
  * Then, go through the different lines to get every route_id
  * Then check if any of those routes stop at the desired station that the user has selected.
  */
  async function checkForMultipleRoutes(placeCode){

    //these place codes are used for when a route has different station names for differing directions
    var direction0PlaceCode = placeCode;
    var direction1PlaceCode = placeCode;

    //if there is more than one place code
    if (placeCode.length > 4){
      direction0PlaceCode = placeCode.substring(0,4);
      direction1PlaceCode = placeCode.substring(4,8);
    }

    //makes sure it only runs once
    if (allRoutes.length == 0){
      const allRoutesFetch = await fetch ('https://svc.metrotransit.org/nextrip/routes');
      var tempRoutes = await allRoutesFetch.json(); //every route
      allRoutes = tempRoutes;
    }
      
    var linesAtCurrentStation = []; //represents the routs at the station(placeCode)

    //Go through the first x number of routes
    for (let i = 0; i < numberOfRoutes; i++) {
      var currentRouteID = allRoutes[i];
      if (currentRouteID.route_id == 425){ //station 425 does not show up on the official map
        continue
      }
      const checkRoutesStopsFetch = await fetch('https://svc.metrotransit.org/nextrip/stops/' + currentRouteID.route_id + '/0');
      var checkRoutesStops = await checkRoutesStopsFetch.json();
      

      //check to see if this route stops at the desired station(s)
      checkRoutesStops.forEach(currentPlaceCode => {
        if (direction0PlaceCode == currentPlaceCode.place_code || direction1PlaceCode == currentPlaceCode.place_code){
          setCurrentLinesStops(checkRoutesStops);
          linesAtCurrentStation.push(currentRouteID.route_id);
        }
      });
    }

    //represents ALL lins that stop at this station
    updateLinesAtStation(linesAtCurrentStation);
    
    //sets placeCode for the one the user has selected
    setPlaceCode(placeCode);

    //alter text box size based on the number of lines at this station
    //document.getElementById('hide').style.height = (linesAtCurrentStation.length * 45); 

    //toggle the info box with the first station dispalyed. (changing the '0' value will change which station is disaplyed first)
    toggleInfoBox(linesAtCurrentStation[0], direction0PlaceCode, direction1PlaceCode);
  }
  
  /*
  *  Ddispaly or hide the box when the use clicks on the station
  */
  function toggleInfoBox(lineID, direction0PlaceCode, direction1PlaceCode){

    var hidden = document.getElementById("hide").style.display == '';
    var infoBoxCoords = document.getElementById('hide');
    
    if (hidden || getDisplayedPlaceCode().substring(0,4) != direction0PlaceCode){
      displayInfoBox(lineID, true, direction0PlaceCode, direction1PlaceCode);
    }
    else{
      infoBoxCoords.style.display = '';
      infoBoxCoords.style.left = 0;
      infoBoxCoords.style.top = 0;
    }
  }

  function dispalyErrorBox(errorCode){
    
    var infoBoxCoords = document.getElementById('hide');

    if (infoBoxCoords.style.display == '' || getDisplayedPlaceCode().substring(0,4) != errorCode){
      infoBoxCoords.style.display = 'flex';
      moveInfoBox(errorCode);
      document.body.style.setProperty("--infoBx-background", 'rgb(194, 194, 194)');    
      document.getElementById('stopName').innerHTML = 'No Stop Information';
  
      document.getElementById('currentLine').innerHTML = '';
  
      document.getElementById('current0Direction').innerHTML = '';
      document.getElementById("placeCode0Arrival").innerHTML = '';
      
      document.getElementById('current1Direction').innerHTML = '';
      document.getElementById("placeCode1Arrival").innerHTML = '';
      document.getElementById('hide').style.height = (200) + 'px';     
    }
    else{
      infoBoxCoords.style.display = '';
      infoBoxCoords.style.left = 0;
      infoBoxCoords.style.top = 0;
    }

    updateLinesAtStation([]);
    setPlaceCode(errorCode);
  }

 
  //Map SVG
  return (
  <div className="svgWrapperWrapper" id="svgWrapperWrapper">
    <div className="svgWrapper" id = 'svgWrapper'>
      
      <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 1920 1920"
      className="newMap"
      id = "newMap"
      style = {{}}

    >
      <style type = "text/css">
        @import url("https://use.typekit.net/pki1cei.css");
        {
          ".st0,.st1,.st2,.st3,.st4,.st5{fill:none;stroke:#eeb071;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}.st1,.st2,.st3,.st4,.st5{fill:#fff}.st2,.st3,.st4,.st5{fill:none;stroke:#85bbe5}.st3,.st4,.st5{fill:#fff}.st4,.st5{fill:none;stroke:#70a580}.st5{fill:#fff}.st6{font-family:&apos;LunatixOT-Light&apos;}.st7{font-size:13.6312px}.st8,.st9{fill:none;stroke:#f37369;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}.st9{fill:#fff}.st10{font-size:15px}.st14{font-size:25px}"
        }
      </style>
      <g id="Orange_Line">
        <path
          className="st0"
          d="M531.95 528.35l-25.48 25.48-24.75 24.75-160.83 160.83a84.386 84.386 0 00-24.72 59.68v605.32"
        />
        <path className="st0" d="M628.03 434.5L541.28 519.02" />
        <circle className="st1" id = 'EROR' onClick={ () => dispalyErrorBox('EROR')} cx={494.1} cy={566.2} r={17.5} />
        <circle className="st1" id = '7S2A' onClick={ () => checkForMultipleRoutes('7S2A7SMA')} cx={413.51} cy={647.4} r={17.5} />
        <circle className="st1" id = 'WA2A' onClick={ () => checkForMultipleRoutes('WA2AMA3S')} cx={615.46} cy={446.67} r={17.5} />
        <circle className="st1" id = '112A' onClick={ () => checkForMultipleRoutes('112A11MA')} cx={332.93} cy={728.59} r={17.5} />
        <circle className="st1" id = 'I3LA' onClick={ () => checkForMultipleRoutes('I3LA')} cx={296.17} cy={843.9} r={17.5} />
        <circle className="st1" id = 'I346' onClick={ () => checkForMultipleRoutes('I346')} cx={296.17} cy={926.47} r={17.5} />
        <circle className="st1" id = 'I366' onClick={ () => checkForMultipleRoutes('I366')} cx={296.17} cy={1009.04} r={17.5} />
        <circle className="st1" id = 'KN76' onClick={ () => checkForMultipleRoutes('KN76')} cx={296.17} cy={1091.62} r={17.5} />
        <circle className="st1" id = 'KNAM' onClick={ () => checkForMultipleRoutes('KNAM')} cx={296.17} cy={1174.19} r={17.5} />
        <circle className="st1" id = '98ST' onClick={ () => checkForMultipleRoutes('98ST')} cx={296.17} cy={1256.76} r={17.5} />
        <circle className="st1" id = 'BHOC' onClick={ () => checkForMultipleRoutes('BHOC')} cx={296.17} cy={1339.34} r={17.5} />
        <circle className="st1" id = 'BVPK' onClick={ () => dispalyErrorBox('BVPK')} cx={296.17} cy={1421.91} r={17.5} />
      </g>
      <g id="Blue_Line">
        <path className="st2" d="M718.05 1275.5L674.87 1275.5" />
        <path
          className="st2"
          d="M833.88 1275.5h24.95c28.25 0 51.92-19.64 58.1-46"
        />
        <path className="st2" d="M918.5 1146.54L918.5 1118.53" />
        <path className="st2" d="M627.09 819.54L627.09 760.17" />
        <path className="st2" d="M627.09 732.66L627.09 677.03" />
        <path className="st2" d="M918.5 1202.07L918.5 1174.06" />
        <path className="st2" d="M810.55 1275.5L732.9 1275.5" />
        <circle className="st3" id = '30AV' onClick={ () => checkForMultipleRoutes('30AV')} cx={735.55} cy={1275.5} r={17.5} />
        <circle className="st3" id = 'BLCT' onClick={ () => checkForMultipleRoutes('BLCT')} cx={828.05} cy={1275.5} r={17.5} />
        <circle className="st3" id = 'AM34' onClick={ () => checkForMultipleRoutes('AM34')} cx={918.5} cy={1215.83} r={17.5} />
        <circle className="st3" id = 'HHTE' onClick={ () => checkForMultipleRoutes('HHTE')} cx={918.5} cy={1160.3} r={17.5} />
        <circle className="st3" id = 'FRHI' onClick={ () => checkForMultipleRoutes('FRHI')} cx={626.97} cy={746.42} r={17.5} />
        <path
          className="st2"
          d="M626.97 853.89v5.79c0 14.64 7.8 28.18 20.46 35.54l249.44 144.89a43.444 43.444 0 0121.62 37.57v6.95"
        />
        <circle className="st3" id = 'FTSN' onClick={ () => checkForMultipleRoutes('FTSN')} cx={856.1} cy={1016.54} r={17.5} />
        <circle className="st3" id = 'LAHI' onClick={ () => checkForMultipleRoutes('LAHI')} cx={626.97} cy={833.3} r={17.5} />
        <circle className="st3" id = 'VAMC' onClick={ () => checkForMultipleRoutes('VAMC')} cx={795.6} cy={981.15} r={17.5} />
        <circle className="st3" id = '50HI' onClick={ () => checkForMultipleRoutes('50HI')} cx={735.1} cy={945.76} r={17.5} />
        <circle className="st3" id = '38HI' onClick={ () => checkForMultipleRoutes('38HI')} cx={674.6} cy={910.37} r={17.5} />
        <path className="st2" d="M554.18 550.58L500.41 496.81" />
        <path className="st2" d="M469.82 466.22L416.06 412.46" />
        <path className="st2" d="M385.48 381.88L331.71 328.11" />
        <path className="st2" d="M301.13 297.53L247.37 243.77" />
        <path
          className="st2"
          d="M584.76 581.16l33.54 33.54c5.55 5.55 8.67 13.09 8.67 22.13v5.29"
        />
        <circle className="st3" id = 'LIND' onClick={ () => checkForMultipleRoutes('LIND')} cx={916.93} cy={1104.77} r={17.5} />
        <circle className="st3" id = 'CDRV' onClick={ () => checkForMultipleRoutes('CDRV')} cx={626.97} cy={659.53} r={17.5} />
      </g>
      
      
      <g id="Green_Line">
        <path className="st4" d="M310.12 288.65L256.25 234.78" />
        <path
          className="st4"
          d="M1583.28 970.47c0 14.9 12.07 26.96 26.96 26.96h112.81c7.15 0 14.01-2.84 19.06-7.89l14.08-14.08c5.05-5.06 11.92-7.9 19.06-7.9h33.38M1557.91 779.59c14.15.81 25.37 12.55 25.37 26.9v103.28"
        />
        <path className="st4" d="M1583.28 909.77L1583.28 970.47" />
        <circle className="st5" id = 'ROST' onClick={ () => checkForMultipleRoutes('ROST')} cx={1583.28} cy={839.76} r={17.5} />
        <circle className="st5" id = '10CE' onClick={ () => checkForMultipleRoutes('10CE')} cx={1583.28} cy={938.67} r={17.5} />
        <circle className="st5" id = 'CNST' onClick={ () => checkForMultipleRoutes('CNST')} cx={1667.48} cy={997.44} r={17.5} />
        <circle className="st5" id = 'UNDP' onClick={ () => checkForMultipleRoutes('UNDP')} cx={1808.64} cy={970.47} r={17.5} />
        <text transform="translate(1789.212 921.168)">
          <tspan x={0} y={0} className="st6 st7">
            {"Union "}
          </tspan>
          <tspan x={2.3} y={16.36} className="st6 st7">
            {"Debot"}
          </tspan>
        </text>
        <path className="st4" d="M955.39 641.61L949.48 627.47" />
        <path className="st4" d="M994.14 734.45L988.24 720.31" />
        <path className="st4" d="M1134.59 779.53L1095 779.53" />
        <path className="st4" d="M1289.92 779.53L1249.82 779.53" />
        <path className="st4" d="M1387.53 780.22L1356.86 780.22" />
        <path className="st4" d="M1522.91 779.53L1480 779.53" />
        <path className="st4" d="M1457.42 779.53L1402.59 779.53" />
        <path className="st4" d="M1356.86 780.22L1326.23 780.22" />
        <path className="st4" d="M1212.26 779.53L1170.04 779.53" />
        <path
          className="st4"
          d="M1008.65 766.28a33.672 33.672 0 0020.22 12.6c2.16.43 4.37.65 6.59.65h28.45"
        />
        <path className="st4" d="M973.75 685.6L969.76 676.01" />
        <path
          className="st4"
          d="M593.64 572.17l29.03 29.03a35.14 35.14 0 0024.87 10.3h193.48c7.15 0 14.01-2.84 19.07-7.9l19.27-19.27a34.524 34.524 0 0116.79-9.26l.41-.09c16.33-3.7 31.96 2.69 38.46 18.1"
        />
        <path className="st4" d="M394.46 372.99L340.6 319.13" />
        <path className="st4" d="M450.7 429.23L424.94 403.47" />
        <path className="st4" d="M478.82 457.35L450.7 429.23" />
        <path className="st4" d="M563.16 541.69L509.3 487.83" />
        
        <circle className="st5" id = 'UNRI' onClick={ () => checkForMultipleRoutes('UNRI')} cx={1540.41} cy={779.53} r={17.5} />
        <circle className="st5" id = 'RAST' onClick={ () => checkForMultipleRoutes('RAST')} cx={981.86} cy={704.01} r={17.5} />
        <circle className="st5" id = 'WGAT' onClick={ () => checkForMultipleRoutes('WGAT')} cx={961.83} cy={657.88} r={17.5} />
        <circle className="st5" id = 'PSPK' onClick={ () => checkForMultipleRoutes('PSPK')} cx={941.79} cy={611.75} r={17.5} />
        <circle className="st5" id = 'FAUN' onClick={ () => checkForMultipleRoutes('FAUN')} cx={1001.89} cy={750.14} r={17.5} />
        <circle className="st5" id = 'SNUN' onClick={ () => checkForMultipleRoutes('SNUN')} cx={1074.43} cy={779.99} r={17.5} />
        <circle className="st5" id = 'HMUN' onClick={ () => checkForMultipleRoutes('HMUN')} cx={1152.09} cy={780.22} r={17.5} />
        <circle className="st5" id = 'LXUN' onClick={ () => checkForMultipleRoutes('LXUN')} cx={1229.76} cy={780.45} r={17.5} />
        <circle className="st5" id = 'VIUN' onClick={ () => checkForMultipleRoutes('VIUN')} cx={1307.42} cy={780.69} r={17.5} />
        <circle className="st5" id = 'UNDA' onClick={ () => checkForMultipleRoutes('UNDA')} cx={1385.09} cy={780.92} r={17.5} />
        <circle className="st5" id = 'WEUN' onClick={ () => checkForMultipleRoutes('WEUN')} cx={1462.75} cy={781.15} r={17.5} />
        <circle className="st5" id = 'WEBK' onClick={ () => checkForMultipleRoutes('WEBK')} cx={702.23} cy={611.75} r={17.5} />
        <circle className="st5" id = 'EABK' onClick={ () => checkForMultipleRoutes('EABK')} cx={787.7} cy={611.75} r={17.5} />
        <circle className="st5" id = 'STVI' onClick={ () => checkForMultipleRoutes('STVI')} cx={873.89} cy={589.86} r={17.5} />
      
      </g>


      <g id="Red_Line">
        <path className="st8" d="M582.96 1294.27L582.96 1560.98" />
        <path
          className="st8"
          d="M582.96 1294.27v-.55c0-10.06 8.16-18.22 18.22-18.22h33.29"
        />
      </g>

      
      <g id="Intersecting_Stations">
        <circle className="st9" id = 'APNB' onClick={ () => checkForMultipleRoutes('APNBAPSB')} cx={582.96} cy={1576.36} r={17.5} />
        <circle className="st9" id = 'CE47' onClick={ () => checkForMultipleRoutes('CE47')} cx={582.96} cy={1496.66} r={17.5} />
        <circle className="st9" id = 'CE14' onClick={ () => checkForMultipleRoutes('CE14')} cx={582.96} cy={1416.96} r={17.5} />
        <circle className="st9" id = 'CGTR' onClick={ () => checkForMultipleRoutes('CGTR')} cx={582.96} cy={1337.26} r={17.5} />
        
        
        <g className="intersectLines" style = {{'--offsetX' : 648.97 + 'px', '--offsetY' : 1275.5 + 'px'}} id = 'MAAM' onClick={ () => checkForMultipleRoutes('MAAM')}>
          <circle className="st9" cx={648.97} cy={1275.5} r={22.5} />
          <circle className="st3 intersectCircle" cx={648.97} cy={1275.5} r={15} />
        </g>

        <g className="intersectLines" style = {{'--offsetX' : 243.96 + 'px', '--offsetY' : 231.59 + 'px'}} id = 'TF1' onClick={ () => checkForMultipleRoutes('TF1')}>
          <circle className="st5" cx={243.96} cy={231.59} r={22.5} />
          <circle className="st3 intersectCircle" cx={243.96} cy={231.59} r={15} />
        </g>
        
        <g className="intersectLines" style = {{'--offsetX' : 320.81 + 'px', '--offsetY' : 308.44 + 'px'}} id = 'WARE' onClick={ () => checkForMultipleRoutes('WARE')}>
          <circle className="st5" cx={320.81} cy={308.44} r={22.5} />
          <circle className="st3 intersectCircle" cx={320.81} cy={308.44} r={15} />
        </g>

        <g className="intersectLines" style = {{'--offsetX' : 405.16 + 'px', '--offsetY' : 392.79 + 'px'}} id = '5SNI' onClick={ () => checkForMultipleRoutes('5SNI')}>
          <circle className="st5" cx={405.16} cy={392.79} r={22.5} />
          <circle className="st3 intersectCircle" cx={405.16} cy={392.79} r={15} />
        </g>
        <g className="intersectLines" style = {{'--offsetX' : 489.5 + 'px', '--offsetY' : 477.14 + 'px'}} id = 'GOVT' onClick={ () => checkForMultipleRoutes('GOVT')}>
          <circle className="st5" cx={489.5} cy={477.14} r={22.5} />
          <circle className="st3 intersectCircle" cx={489.5} cy={477.14} r={15} />
        </g>
        <g className="intersectLines" style = {{'--offsetX' : 573.85 + 'px', '--offsetY' : 561.49 + 'px'}} id = 'USBA' onClick={ () => checkForMultipleRoutes('USBA')}>
          <circle className="st5" cx={573.85} cy={561.49} r={22.5} />
          <circle className="st3 intersectCircle" cx={573.85} cy={561.49} r={15} />
        </g>
      </g>
      <g id="Station_Names">
        <text transform="rotate(-45.001 375.027 -217.11)" className="st6 st10">
          {"Target Field"}
        </text>
        <text transform="rotate(-45.001 509.134 -274.617)">
          <tspan x={0} y={0} className="st6 st10">
            {"Warehouse/"}
          </tspan>
          <tspan x={0} y={21} className="st6 st10">
            {"Hennepin"}
          </tspan>
        </text>
        <text transform="rotate(-45.001 660.241 -338.977)" className="st6 st10">
          {"Nicollet Mall"}
        </text>
        <text transform="rotate(-45.001 803.529 -397.015)" className="st6 st10">
          {"Government Plaza"}
        </text>
        <text transform="rotate(-45.001 939.136 -456.635)">
          <tspan x={0} y={0} className="st6 st10">
            {"U.S Bank "}
          </tspan>
          <tspan x={0} y={21} className="st6 st10">
            {"Stadium"}
          </tspan>
        </text>
        <text transform="translate(662.82 661.482)" className="st6 st10">
          {"Cedar-Riverside"}
        </text>
        <text transform="translate(662.115 750.142)" className="st6 st10">
          {"Franklin"}
        </text>
        <text transform="translate(660.976 826.395)">
          <tspan x={0} y={0} className="st6 st10">
            {"Lake St /"}
          </tspan>
          <tspan x={-1.6} y={21} className="st6 st10">
            {"Midtown"}
          </tspan>
        </text>
        <text transform="translate(607.344 943.157)" className="st6 st10">
          {"38th St"}
        </text>
        <text transform="translate(771.585 892.875)">
          <tspan x={0} y={0} className="st6 st10">
            {"50th St /"}
          </tspan>
          <tspan x={-26.32} y={21} className="st6 st10">
            {"Minnehaha Park"}
          </tspan>
        </text>
        <text transform="translate(707.477 1016.541)">
          <tspan x={0} y={0} className="st6 st10">
            {"Va Mecial"}
          </tspan>
          <tspan x={11.83} y={21} className="st6 st10">
            {"Canter"}
          </tspan>
        </text>
        <text transform="translate(880.989 990.422)" className="st6 st10">
          {"Fort Snelling"}
        </text>
        <text transform="translate(949.652 1105.679)" className="st6 st10">
          {"Terminal 1"}
        </text>
        <text transform="translate(950.177 1163.582)" className="st6 st10">
          {"Terminal 2"}
        </text>
        <text transform="translate(950.701 1220.35)" className="st6 st10">
          {"Amercian BLvd"}
        </text>
        <text transform="translate(784.98 1313.716)">
          <tspan x={0} y={0} className="st6 st10">
            {"Bloomington"}
          </tspan>
          <tspan x={19.79} y={21} className="st6 st10">
            {"Central"}
          </tspan>
        </text>
        <text transform="translate(720.95 1316.85)">
          <tspan x={0} y={0} className="st6 st10">
            {"30th"}
          </tspan>
          <tspan x={2.47} y={21} className="st6 st10">
            {"Ave"}
          </tspan>
        </text>
        <text transform="translate(625.812 1214.886)">
          <tspan x={0} y={0} className="st6 st10">
            {"Mall of"}
          </tspan>
          <tspan x={-2.87} y={21} className="st6 st10">
            {"America"}
          </tspan>
        </text>
        <text transform="translate(471.171 1339.267)" className="st6 st10">
          {"Cedar Grove"}
        </text>
        <text transform="translate(501.533 1422.23)" className="st6 st10">
          {"140th St"}
        </text>
        <text transform="translate(497.926 1501.35)" className="st6 st10">
          {"147th St"}
        </text>
        <text transform="translate(541.792 1624.155)">
          <tspan x={0} y={0} className="st6 st10">
            {"Apple Valley"}
          </tspan>
          <tspan x={-6.84} y={21} className="st6 st10">
            {"Transit Station"}
          </tspan>
        </text>
        <text transform="translate(687.585 558.855)">
          <tspan x={0} y={0} className="st6 st10">
            {"West"}
          </tspan>
          <tspan x={-2.23} y={21} className="st6 st10">
            {"Bank"}
          </tspan>
        </text>
        <text transform="translate(774.54 558.855)">
          <tspan x={0} y={0} className="st6 st10">
            {"East"}
          </tspan>
          <tspan x={-3.72} y={21} className="st6 st10">
            {"Bank"}
          </tspan>
        </text>
        <text transform="translate(847.367 535.942)">
          <tspan x={0} y={0} className="st6 st10">
            {"Stadium"}
          </tspan>
          <tspan x={3.9} y={21} className="st6 st10">
            {"Village"}
          </tspan>
        </text>
        <text transform="translate(968.873 594.253)" className="st6 st10">
          {"Prospect Park"}
        </text>
        <text transform="translate(1008.653 686.512)" className="st6 st10">
          {"Raymond"}
        </text>
        <text transform="translate(988.243 640.382)" className="st6 st10">
          {"Westgate"}
        </text>
        <text transform="translate(1027.825 732.642)" className="st6 st10">
          {"Fairview"}
        </text>
        <text transform="translate(1050.612 816.947)" className="st6 st7">
          {"Snelling"}
        </text>
        <text transform="translate(1127.179 753.052)" className="st6 st7">
          {"Hamline"}
        </text>
        <text transform="translate(1200.736 816.947)" className="st6 st7">
          {"Lexington"}
        </text>
        <text transform="translate(1283.813 753.052)" className="st6 st7">
          {"Victoria"}
        </text>
        <text transform="translate(1370.34 816.947)" className="st6 st7">
          {"Dale"}
        </text>
        <text transform="translate(1436.103 753.052)" className="st6 st7">
          {"Western"}
        </text>
        <text transform="translate(1514.938 734.45)">
          <tspan x={0} y={0} className="st6 st7">
            {"Capitol /"}
          </tspan>
          <tspan x={11.83} y={16.36} className="st6 st7">
            {"Rice"}
          </tspan>
        </text>
        <text transform="translate(1615.603 843.93)" className="st6 st10">
          {"Robert"}
        </text>
        <text transform="translate(1614.411 944.26)" className="st6 st10">
          {"10th St"}
        </text>
        <text transform="translate(1644.19 1039.71)" className="st6 st10">
          {"Central"}
        </text>
        <text transform="rotate(-45.001 827.335 -547.276)">
          <tspan x={0} y={0} className="st6 st10">
            {"Marquette & 3rd St"}
          </tspan>
          <tspan x={0} y={21} className="st6 st10">
            {"2nd Ave & Washington"}
          </tspan>
        </text>
        <text transform="rotate(-45.001 892.822 -232.841)">
          <tspan x={0} y={0} className="st6 st10">
            {"Maquette-"}
          </tspan>
          <tspan x={-37.42} y={21} className="st6 st10">
            {"2nd Ave & 5th St"}
          </tspan>
        </text>
        <text transform="rotate(-45.001 1054.055 -163.842)">
          <tspan x={0} y={0} className="st6 st10">
            {"Maquette-"}
          </tspan>
          <tspan x={-18.53} y={21} className="st6 st10">
            {"2nd Ave & 7th St"}
          </tspan>
        </text>
        <text transform="rotate(-45.001 999.27 34.783)">
          <tspan x={0} y={0} className="st6 st10">
            {"Maquette-"}
          </tspan>
          <tspan x={-20.71} y={21} className="st6 st10">
            {"2nd Ave & 11th St"}
          </tspan>
        </text>
        <text transform="translate(191.513 851.015)" className="st6 st10">
          {"I-35 & Lake"}
        </text>
        <text transform="translate(176.625 931.197)" className="st6 st10">
          {"I-35 & 46th St"}
        </text>
        <text transform="translate(176.625 1013.629)" className="st6 st10">
          {"I-35 & 66th St"}
        </text>
        <text transform="translate(168.847 1095.556)" className="st6 st10">
          {"Knox & 76th St"}
        </text>
        <text transform="translate(114.78 1178.826)" className="st6 st10">
          {"Knox & American BLvd"}
        </text>
        <text transform="translate(174.846 1262.065)" className="st6 st10">
          {"I-35 & 98th St"}
        </text>
        <text transform="translate(193.228 1333.61)">
          <tspan x={0} y={0} className="st6 st10">
            {"Burnsville "}
          </tspan>
          <tspan x={-38.14} y={21} className="st6 st10">
            {"Heart of the City"}
          </tspan>
        </text>
        <text transform="translate(207.461 1419.076)">
          <tspan x={0} y={0} className="st6 st10">
            {"I-35W & "}
          </tspan>
          <tspan x={-51.36} y={21} className="st6 st10">
            {"Burnsville Pkwy"}
          </tspan>
        </text>
      </g>
      <g id="Info_Layer">
        <path
          fill="none"
          stroke="#85bbe5"
          strokeWidth={5}
          strokeLinecap="round"
          strokeMiterlimit={10}
          d="M1137.78 271.46L1209.97 271.46"
        />
        <text transform="translate(1220.803 276.541)" className="st6 st10">
          {"Blue Line"}
        </text>
        <path
          fill="none"
          stroke="#70a580"
          strokeWidth={5}
          strokeLinecap="round"
          strokeMiterlimit={10}
          d="M1137.78 326.9L1209.97 326.9"
        />
        <text transform="translate(1220.803 331.98)" className="st6 st10">
          {"Green Line"}
        </text>
        <path
          fill="none"
          stroke="#f37369"
          strokeWidth={5}
          strokeLinecap="round"
          strokeMiterlimit={10}
          d="M1557.58 271.46L1629.77 271.46"
        />
        <text transform="translate(1639.036 276.54)" className="st6 st10">
          {"Red Line"}
        </text>
        <text transform="translate(1135 225.461)" className="st6 st14">
          {"METRO Light Rail Transit"}
        </text>
        <text transform="translate(1550 225.461)" className="st6 st14">
          {"METRO Bus Rapid Transit"}
        </text>
        <path
          fill="none"
          stroke="#eeb071"
          strokeWidth={5}
          strokeLinecap="round"
          strokeMiterlimit={10}
          d="M1557.58 326.9L1629.77 326.9"
        />
        <g className="instructions">
          <text transform="translate(1639.036 331.98)" className="st6 st10">
            {"Orange Line"}
          </text>
          <text transform="translate(1350 100)">
            {"Use the (+ / -) keys to zoom in / out"}
          </text>
          <text transform="translate(1335 125)">
            {"Use the (<-- / -->) keys to pan left / right"}
          </text>
          <text transform="translate(1295 150)">
            {"Use the (up and down arrow keys) to pan up / down"}
          </text>
        </g>
      </g>
    </svg>
  
  {/*
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    
    viewBox="0 0 2700 2700"
    style={{
      enableBackground: "new 0 0 2700 2700",
      
    }}

    xmlSpace="preserve"
  >
    <style type="text/css">
      {
        "\n\t.st0{fill:none;stroke:#36479D;stroke-miterlimit:10;}\n\t.st1{stroke:#000000;stroke-miterlimit:10;}\n"
      }
    </style>
    <line className="st0" x1={325.52} y1={233.42} x2={325.52} y2={942.52} />
    <line className="st0" x1={686.12} y1={1142.52} x2={325.52} y2={942.52} />
    <line className="st0" x1={1204.3} y1={1142.52} x2={686.12} y2={1142.52} />
    <line className="st0" x1={1664.91} y1={1491} x2={1204.3} y2={1142.52} />
    <line className="st0" x1={1661.88} y1={1966.76} x2={1661.88} y2={1491} />
    <line className="st0" x1={1961.88} y1={2218.27} x2={1661.88} y2={1966.76} />
    <line className="st0" x1={1964.91} y1={2466.76} x2={1964.91} y2={2221.3} />
    <line className="st1" x1={1646.73} y1={2466.76} x2={1964.91} y2={2466.76} />
    <circle className="station" id ='MAAM' cx={1646.73} cy={2466.76} r={95.45} onClick={ () => checkForMultipleRoutes('MAAM')} />
  </svg>*/} 
    </div>
  </div>
  );
}
