  
if (screen.height > 700){
  window.onload = function (){

    var oldX = 0;
    var oldY = 0;
    var zoomAmount = 1.5;
    var inInfoBox = false;

    var isMouseDown = false

    const navMap = {
      187: {act: 'zoom', dir: 1,  name: 'in'}, // ->
      189: {act: 'zoom', dir: -1, name: 'out'}, //
      61: {act: 'zoom', dir: 1,  name: 'in'}, // ->
      173: {act: 'zoom', dir: -1, name: 'out'}, //
      1000:  {act: 'zoom', dir: 1, name: 'in'}, //scroll up
      900:  {act: 'zoom', dir: -1, name: 'out'}, //scroll down
      39:  {act: 'move', dir: 1,  name: 'right',  axis: 0}, // ->
      40:  {act: 'move', dir: 1,  name: 'down',   axis: 1}, //
      37:  {act: 'move', dir: -1, name: 'left',   axis: 0}, //
      38:  {act: 'move', dir: -1, name: 'up',     axis: 1} //
    }, 
      _SVG = document.querySelector('svg'),
      VB = _SVG.getAttribute('viewBox').split(' ').map(c=>+c),
      DMAX = VB.slice(2), WMIN = 960, NF = 1;
    
    let nav = null, tg = Array(4), f =0, rID = null;

    function update(){

      let k = ++f/NF, j = 1-k, cvb = VB.slice();

      if (nav.act == 'zoom'){
        for (let i = 0; i < 4; i++) {
          cvb[i] = j * VB[i] + k * tg[i];
        }
      }

      else if (nav.act == 'move') {
        cvb[nav.axis] = j * VB[nav.axis] + k * tg[nav.axis];
      }

      _SVG.setAttribute('viewBox', cvb.join(' '));

      if (!(f%NF)) {
        cancelAnimationFrame(rID);
        rID = null;
        nav = null;
        f = 0;
        VB.splice(0,4, ...cvb);
        tg = Array(4);
        return;
      }

      rID = requestAnimationFrame(update);
    }

  document.addEventListener('mousemove', e => {  
    if (isMouseDown){

      //right
      if (e.pageX < oldX) {
        var moveAmount = oldX - e.pageX;
        nav = navMap[39];

        if (nav.dir == 1 && VB[nav.axis] <= DMAX[nav.axis]  * 2 - VB[nav.axis + 2]){
          tg[0] = VB[0] + moveAmount * 1;
          update();
        }
        else{
          //tg[0] = DMAX[nav.axis] * 2 - VB[nav.axis + 2] - 500;
          //console.log("can't go right anymore");
        }
      } 
      
      //left
      else if (e.pageX > oldX) {
        var moveAmount = e.pageX - oldX;
        nav = navMap[37];

        if ((nav.dir == -1 && VB[nav.axis] > 0)){
          tg[0] = VB[0] + moveAmount * -1;
          update();
        }
        else{
          //tg[0] = (DMAX[nav.axis] * 2 - VB[nav.axis + 2] - 500) * -1;
          //console.log("can't go left anymore");
        }
      }

      //down
      if (e.pageY < oldY) {
        var moveAmount = oldY - e.pageY;
        nav = navMap[40];

        //console.log((VB[nav.axis]), Math.abs(DMAX[nav.axis] * 2 - VB[nav.axis + 2]));

        if (nav.dir == 1 && VB[nav.axis] <= DMAX[nav.axis] * 1.5 - VB[nav.axis + 2]){
          tg[1] = VB[1] + moveAmount * 1;
          update();
        }
        else{
          //tg[1] = (DMAX[nav.axis] - 500);
          //console.log("can't go down anymore");
        }
      } 
      
      //up
      else if (e.pageY > oldY) {
        var moveAmount = e.pageY - oldY;
        nav = navMap[38];       
       
        if ((nav.dir == -1 && VB[nav.axis] > 0)) {
            tg[1] = VB[1] + moveAmount * -1;
            update();
          }
          /*
        if(((VB[nav.axis] * -1) <= (DMAX[nav.axis] * zoomAmount - VB[nav.axis + 2]))){ //!
        }*/
        else{
          //tg[1] = DMAX[nav.axis] * -1 + 500;
          //console.log("can't go up anymore");
        }

      }

    }
    oldY = e.pageY;
    oldX = e.pageX;   
  }, false);

  document.addEventListener('mousedown', e => {
    document.body.style.cursor = "grabbing";
    isMouseDown = true;
    oldY = e.pageY;
    oldX = e.pageX;
  }, false);

  document.addEventListener('mouseup', e => {
    document.body.style.cursor = "grab";

    isMouseDown = false;
  }, false);

  if (screen.width > 1000){

  document.getElementById('aboutMeToggle').addEventListener("mouseover", function(){ 
       inInfoBox = true;
  });

  document.getElementById('aboutMeToggle').addEventListener("mouseleave", function(){ 
    inInfoBox = false;
  });

  document.addEventListener('wheel', e => {
    if (!inInfoBox){
      //zoom in
      if(e.deltaY < 0){
        nav = navMap[1000];
        
        if (nav.act == 'zoom'){
          if((nav.dir == -1 && VB[2] >= DMAX[0] * 2) || (nav.dir == 1 && VB[2] <= WMIN)){
            //console.log(`cannot zoom ${nav.name} more`);
            return;
          }
          zoomAmount += 0.1;

          for (let i = 0; i < 2; i++){
            tg[i + 2] = VB[i + 2]/Math.pow(1.1, nav.dir);
            tg[i] = 0.5 * (DMAX[i] - tg[i+2]);
          }
        }
      }

      // zoom out
      else if(e.deltaY > 0){
        nav = navMap[900];
        zoomAmount -= 0.1;

        if (nav.act == 'zoom'){
          if((nav.dir == -1 && VB[2] >= DMAX[0] * 2) || (nav.dir == 1 && VB[2] <= WMIN)){
            //console.log(`cannot zoom ${nav.name} more`);
            return;
          }
        
          for (let i = 0; i < 2; i++){
            tg[i + 2] = VB[i + 2]/Math.pow(1.1, nav.dir);
            tg[i] = 0.5 * (DMAX[i] - tg[i+2]);
          }
        }
      }
    
      tg[0] = VB[0];
      tg[1] = VB[1];
      update();
    }
  }, false);
  }
  }
}
/* OLD panning
        if (nav.act == 'move'){
          //console.log(DMAX[nav.axis], VB[nav.axis + 2], VB[nav.axis]);
          if((nav.dir == -1 && VB[nav.axis] <= 0 ) || (nav.dir == 1 && VB[nav.axis] >= DMAX[nav.axis] * 2 - VB[nav.axis + 2])){
            //console.log(`cannot move ${nav.name} more`);
            return;
          }
          tg[nav.axis] = VB[nav.axis] + 0.25 * nav.dir * VB[nav.axis + 2];
        }       
        */

/*var zoomAmount = 0.75;
var panAmount = 0.75;

document.addEventListener('mousedown mouseup', function mouseState(e) {
  if (e.type == "mousedown") {
      //code triggers on hold
      console.log("hold");
  }
});

function Zoom(event){
  if (event.deltaY < 0 && zoomAmount < 2) {
    zoomAmount += 0.25;
  }
  //minus key zooming out
  else if (event.deltaY > 0 && zoomAmount > 0.5 ){
    zoomAmount -= 0.25;
  }
  

  document.getElementById('newMap').style.setProperty("--mapZoom", zoomAmount); // zoom in
  console.log(document.getElementById('newMap').style.getPropertyValue('--mapZoom'));
}*/