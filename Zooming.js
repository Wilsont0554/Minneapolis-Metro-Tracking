

    window.onload = function(){
        var touchScreen = false;
        var oldX = 0;
        var oldY = 0;
        var numberOfTouches = 0;
        var touchValues = [
            [0,0],
            [0,0]
        ];

        
        
        var WMIN = 480;
        var NF = 1;
        let nav = null;
        let tg = Array(4);
        let f =0;
        let rID = null;

        function update(){

            let k = ++f/NF;
            let j = 1-k;
      
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
