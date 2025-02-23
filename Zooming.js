

window.onload = function(){

    
    var _SVG = document.getElementById('newMap');
    _SVG.setAttribute('viewBox', '0 0 900 1400');
    var VB = _SVG.getAttribute('viewBox').split(' ').map(c=>+c);
    var DMAX = VB.slice(2);
    var WMIN = 480;
    var NF = 1;
    let nav = null;
    let tg = Array(4);
    let f =0;
    let rID = null;

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
        _SVG.setAttribute('viewBox', '0 0 1920 1920');
        //tg[0] = VB[0] + 10;
        //update();

    }, false)
    
}
