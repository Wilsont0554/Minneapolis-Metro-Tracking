import React from "react";
export default function LineIcon(props) {

    const {placeCode, displayInfoBox, line, index, lineColors, changeLine} = props;
    
    /*
    *   checks if a color has been defined for the line_id
    *   if it hasn't, then return a default grey color
    */
    function getLineColor(lineID) {
        if (lineColors.has(lineID)) {
        return lineColors.get(lineID);
        }
        else{
        return '#5e5e5e';
        }
    }

    return (
        <li className = "lineButtonList">
            <button id= {line} style={{ '--background-color' : (234, 234, 234), '--hover-color' : getLineColor(line), '--border-color' : lineColors.get(line)}} className = "switchLineButton" onClick={() => changeLine(line, placeCode, false) }>
                {line}
            </button>
        </li>

    )
}