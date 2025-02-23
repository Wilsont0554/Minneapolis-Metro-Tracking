

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
   

    function update(){

        let k = ++f/NF;
        let j = 1-k;
        let cvb = VB.slice();
  
        if (nav.act == 'zoom'){
          for (let i = 0; i < 4; i++) {
            cvb[i] = j * VB[i] + k * tg[i];
            
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
        document.getElementById('newMap').style.backgroundColor = ('rgb(152, 223, 184)');
        //nav = navMap[39];
        _SVG.setAttribute('viewBox', '0 0 940 1400');
        //tg[0] = VB[0] + 10;
        //update();

    }, false)
    
}
