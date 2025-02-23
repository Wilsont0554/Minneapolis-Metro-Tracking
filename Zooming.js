  
  window.onload = function (){

    var touchScreen = false;
    var oldX = 0;
    var oldY = 0;
    var numberOfTouches = 0;
    var touchValues = [
        [0,0],
        [0,0]
  ];

    var zoomAmount = 1.5;

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
      /*
      if (!(f%NF)) {
        cancelAnimationFrame(rID);
        rID = null;
        nav = null;
        f = 0;
        VB.splice(0,4, ...cvb);
        tg = Array(4);
        return;
      }

      rID = requestAnimationFrame(update);*/
    }
/*
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
          console.log("can't go right anymore");
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
          console.log("can't go left anymore");
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
          console.log("can't go down anymore");
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
        }*
        else{
          //tg[1] = DMAX[nav.axis] * -1 + 500;
          console.log("can't go up anymore");
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

  document.addEventListener('wheel', e => {
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

  }, false);
  }
*/
  document.addEventListener('touchstart', e => {
            
    /*numberOfTouches++;
            touchScreen = true;
            oldX = e.touches[0].clientX;   
            oldY = e.touches[0].clientY;
            
            //update first and second finger's location value at the index they are associated with in the e.touches array
            touchValues[e.touches.length - 1][0] = e.touches[e.touches.length - 1].clientX;
            touchValues[e.touches.length - 1][1] = e.touches[e.touches.length - 1].clientY;
        }, false)

        document.addEventListener('touchend', e => {
            //numberOfTouches--;
            //touchScreen = false;*/
        }, false)
    
        document.addEventListener('touchmove', e => {
            /*panning
            if (touchScreen && numberOfTouches == 1){
                //swipe right
                if (e.touches[0].clientX < oldX) {
                    var moveAmount = oldX - e.touches[0].clientX;
                    nav = navMap[39];
                    
                    if (nav.dir == 1 && VB[nav.axis] <= DMAX[nav.axis]  * 2.5 - VB[nav.axis + 2]){
                        tg[0] = VB[0] + moveAmount * 2;
                        update();
                    }

                } 

                //swipe left
                else if (e.touches[0].clientX > oldX) {
                    var moveAmount = e.touches[0].clientX - oldX;
                    nav = navMap[37];
            
                    if ((nav.dir == -1 && VB[nav.axis] > 0)){
                        tg[0] = VB[0] + moveAmount * -2;
                        update();
                    }
                } 

                //swipe down
                if (e.touches[0].clientY < oldY) {
                    var moveAmount = oldY - e.touches[0].clientY;
                    nav = navMap[40];

                    if (nav.dir == 1 && VB[nav.axis] <= DMAX[nav.axis] * 1.5 - VB[nav.axis + 2]){
                        tg[1] = VB[1] + moveAmount * 2;
                        update();
                    }                    
                } 

                //up
                else if (e.touches[0].clientY > oldY) {
                    var moveAmount = e.touches[0].clientY - oldY;
                    nav = navMap[38];       
                
                    if ((nav.dir == -1 && VB[nav.axis] > 0)) {
                        tg[1] = VB[1] + moveAmount * -2;
                        update();
                    }
                }
                
                oldY = e.touches[0].clientY;   
                oldX = e.touches[0].clientX;
            }
            
            //zooming
            else if (numberOfTouches == 2){
                var oldHypot = Math.hypot(touchValues[0][0] - touchValues[1][0], touchValues[0][1] - touchValues[1][1]);
                var newHypot = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                
                if (oldHypot > newHypot){
                    nav = navMap[900];

                    if((nav.dir == -1 && VB[2] >= DMAX[0] * 2) || (nav.dir == 1 && VB[2] <= WMIN)){
                        return;
                    }

                    for (let i = 0; i < 2; i++){
                        tg[i + 2] = VB[i + 2]/Math.pow(1.02, nav.dir);
                        tg[i] = 0.1 * (DMAX[i] - tg[i+2]) ;
                    }
                    tg[0] = VB[0];
                    tg[1] = VB[1];
                    update(); 
                }
                else if (oldHypot < newHypot){
                    nav = navMap[1000];

                    if((nav.dir == -1 && VB[2] >= DMAX[0] * 2) || (nav.dir == 1 && VB[2] <= WMIN)){
                        return;
                    }

                    for (let i = 0; i < 2; i++){
                        tg[i + 2] = VB[i + 2]/Math.pow(1.02, nav.dir);
                        tg[i] = 0.1 * (DMAX[i] - tg[i+2]) ;
                    }
                    tg[0] = VB[0];
                    tg[1] = VB[1];
                    update(); 
                }
                
                touchValues[0][0] = e.touches[0].clientX;
                touchValues[0][1] = e.touches[0].clientY;
            
                touchValues[1][0] = e.touches[1].clientX;
                touchValues[1][1] = e.touches[1].clientY;
            }*/
                nav = navMap[39];
                tg[0] = VB[0] + 2;
            update()
        }, false)

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
