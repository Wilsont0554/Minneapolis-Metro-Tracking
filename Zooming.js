

    window.onload = function(){
        
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
