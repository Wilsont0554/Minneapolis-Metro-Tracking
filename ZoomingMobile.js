
var touchScreen = false;
var oldX = 0;
var oldY = 0;
var numberOfTouches = 0;
var touchValues = [
    [0,0],
    [0,0]
];

if (screen.height > screen.width){
    window.onload = function(){

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
        _SVG = document.querySelector('svg');
        VB = _SVG.getAttribute('viewBox').split(' ').map(c=>+c),
        DMAX = VB.slice(2), WMIN = 480, NF = 1;
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

        document.addEventListener('touchstart', e => {
            _SVG.setAttribute('viewBox', '0 0 900 1400');
            document.getElementById('newMap').style.backgroundColor = "rgb(255, 0, 0)";
            numberOfTouches++;
            touchScreen = true;
            oldX = e.touches[0].clientX;   
            oldY = e.touches[0].clientY;
            
            //update first and second finger's location value at the index they are associated with in the e.touches array
            touchValues[e.touches.length - 1][0] = e.touches[e.touches.length - 1].clientX;
            touchValues[e.touches.length - 1][1] = e.touches[e.touches.length - 1].clientY;
        }, false)

        document.addEventListener('touchend', e => {
            _SVG.setAttribute('viewBox', '0 0 1920 1920');
            document.getElementById('newMap').style.backgroundColor = "rgb(0, 255, 0)";
            numberOfTouches--;
            touchScreen = false;
        }, false)

        document.addEventListener('touchmove', e => {
            //panning
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
            }
            
        }, false)
        
    }
}
