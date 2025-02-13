  window.onload = function (){
    const navMap = {
      187: {act: 'zoom', dir: 1,  name: 'in'}, // ->
      189: {act: 'zoom', dir: -1, name: 'out'}, //
      61: {act: 'zoom', dir: 1,  name: 'in'}, // ->
      173: {act: 'zoom', dir: -1, name: 'out'}, //
      39:  {act: 'move', dir: 1,  name: 'right',  axis: 0}, // ->
      40:  {act: 'move', dir: 1,  name: 'down',   axis: 1}, //
      37:  {act: 'move', dir: -1, name: 'left',   axis: 0}, //
      38:  {act: 'move', dir: -1, name: 'up',     axis: 1} //
    }, 
      _SVG = document.querySelector('svg'),
      VB = _SVG.getAttribute('viewBox').split(' ').map(c=>+c),
      DMAX = VB.slice(2), WMIN = 480, NF = 12;
    
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

    document.addEventListener('keyup', e => {
      if(e.keyCode in navMap){
        nav = navMap[e.keyCode];
        if (nav.act == 'zoom'){
          if((nav.dir == -1 && VB[2] >= DMAX[0] * 2) || (nav.dir == 1 && VB[2] <= WMIN)){
            //console.log(`cannot zoom ${nav.name} more`);
            return;
          }
        
          for (let i = 0; i < 2; i++){
            tg[i + 2] = VB[i + 2]/Math.pow(2, nav.dir);
            tg[i] = 0.5 * (DMAX[i] - tg[i + 2]);
          }
        }

        //panning
        else if (nav.act == 'move'){
          //console.log(DMAX[nav.axis], VB[nav.axis + 2], VB[nav.axis]);
          if((nav.dir == -1 && VB[nav.axis] <= 0 ) || (nav.dir == 1 && VB[nav.axis] >= DMAX[nav.axis] * 2 - VB[nav.axis + 2])){
            //console.log(`cannot move ${nav.name} more`);
            return;
          }
          tg[nav.axis] = VB[nav.axis] + 0.5 * nav.dir * VB[nav.axis + 2];
          
        }
        

        update();

      }
    }, false);
  }


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