

    window.onload = function(){
        var touchScreen = false;
        var oldX = 0;
        var oldY = 0;
        var numberOfTouches = 0;
        var touchValues = [
            [0,0],
            [0,0]
        ];

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
          };
        var _SVG = document.querySelector('svg');
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
            document.getElementById('newMap').style.backgroundColor = ('rgb(120, 120, 120)');
            //nav = navMap[39];
            //tg[0] = VB[0] + 20;
            //update();
        }, false)

        /*
        document.addEventListener('touchend', e => {
            numberOfTouches--;
            touchScreen = false;
        }, false)*/

        document.addEventListener('touchmove', e => {
            document.getElementById('newMap').style.backgroundColor = ('rgb(217, 223, 152)');

        }, false)
        
    }
