

    window.onload = function(){
        var touchScreen = false;
        var oldX = 0;
        var oldY = 0;
        var numberOfTouches = 0;
        var touchValues = [
            [0,0],
            [0,0]
        ];

        
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
