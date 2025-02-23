var touchScreen = false;
var oldX = 0;
var oldY = 0;
var numberOfTouches = 0;
var touchValues = [
    [0,0],
    [0,0]
];

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

var isMobileBrowser = mobileCheck();

if (isMobileBrowser){
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
        _SVG.setAttribute('viewBox', '0 0 900 1400');
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
            numberOfTouches++;
            touchScreen = true;
            oldX = e.touches[0].clientX;   
            oldY = e.touches[0].clientY;
            
            //update first and second finger's location value at the index they are associated with in the e.touches array
            touchValues[e.touches.length - 1][0] = e.touches[e.touches.length - 1].clientX;
            touchValues[e.touches.length - 1][1] = e.touches[e.touches.length - 1].clientY;
        }, false)

        document.addEventListener('touchend', e => {
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
