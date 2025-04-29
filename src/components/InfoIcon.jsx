import React from "react"
import ExternalLinkContainer from "./Links/ExternalLinkContainer.jsx"
import ExternalLink from "./Links/ExternalLink.jsx"

export default function LineIcon(props) {

    /*
        Toggles to about me box
    */
    function aboutMeAppear(){
        var aboutMeBox = document.getElementById("aboutMeToggle");
        if (aboutMeBox.style.opacity == "0" || aboutMeBox.style.opacity == ""){
            aboutMeBox.style.display = "block";
            aboutMeBox.style.opacity = "1";
        }
        else{
            aboutMeBox.style.display = "none";
            aboutMeBox.style.opacity = "0";
        }
    }

    return (  
        <>
            <div className="dispalyInfoWrapper"> 
                <img src = "src\assets\infoIcon.webp" className="infoIcon" onClick={() => aboutMeAppear() }></img>

                <div id="aboutMeToggle" className="aboutMeToggle">
                    <div className="aboutMe">
                        Hi! I'm Thomas Wilson.
                        <br/> <br/>
                        This is a simplified map of Minneapolis' Blue, Green, Red, and Orange public transit lines. By clicking on any of the stations, 
                        A menu will appear showing when the next train or bus is arriving at that station. 
                        <br/> <br/>
                        If there are multiple lines that stop at a station, you can switch which line's information is disaply by clicking on the
                        station circle on the right panel in the menu after clicking on the station.
                        <br/> <br/>
                        This project is made using Minneapolis' public API called NexTrip. All of the graphics were made by me!
                        <br/> <br/>
                        <ExternalLinkContainer>
                            <ExternalLink text = "Github"                    link = "https://github.com/Wilsont0554"                                                  />
                            <ExternalLink text = "Portfolio"                 link = "https://portfolio-seven-dusky-13.vercel.app/"                                                />
                            <ExternalLink text = "thomasawilson04@gmail.com" link = "mailto:thomasawilson04@gmail.com"                                                />

                        </ExternalLinkContainer>
                    </div>
                </div>
            </div>
        </>
    )
}