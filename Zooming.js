

window.onload = function(){

    var test = document.getElementById('newMap');
    document.addEventListener('touchstart', e => {
        document.getElementById('newMap').style.backgroundColor = ('rgb(120, 120, 120)');
        test.setAttribute('viewBox', '0 0 900 1400');
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
