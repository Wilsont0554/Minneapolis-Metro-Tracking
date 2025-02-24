

window.onload = function(){

    const navMap = { //not the issue
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
      };
    var _SVG = document.getElementById('newMap');
    _SVG.setAttribute('viewBox', '0 0 900 1400');
    var horizontalMovement = 0;

    var WMIN = 480;
    var NF = 1;
    let nav = null;
    let tg = Array(4);
    let f =0;


    function update(){

        let k = ++f/NF;
        let j = 1-k;
        let cvb = VB.slice();
  
        if (nav.act == 'zoom'){
          for (let i = 0; i < 4; i++) {
            //cvb[i] = j * VB[i] + k * tg[i];
          }
        }
  
        else if (nav.act == 'move') {
          cvb[nav.axis] = j * VB[nav.axis] + k * tg[nav.axis];
        }
  
        _SVG.setAttribute('viewBox', cvb.join(' '));
    } 

    document.addEventListener('touchstart', e => {
        document.getElementById('newMap').style.backgroundColor = ('rgb(218, 218, 218)');
        
        //nav = navMap[39];
        //update();
    }, false)

    /*
    document.addEventListener('touchend', e => {
        numberOfTouches--;
        touchScreen = false;
    }, false)*/

    document.addEventListener('touchmove', e => {
        //nav = navMap[39];
        horizontalMovement += 10;
        _SVG.setAttribute('viewBox',  "100 0 900 1400");
        document.getElementById('newMap').style.backgroundColor = ('rgb(152, 192, 223)');
        
        //tg[0] = VB[0] + 10;
        //update();

    }, false)
    
}