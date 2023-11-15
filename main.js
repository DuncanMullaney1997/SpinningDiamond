// five functions; sceneInit, handleKeydown,
// handleMousemove, drawScene and sortByDistance

// inner variables

var canvas, ctx;
var vAlpha = 1;//0.5;
var vShiftX,vShiftY = .0021;//speed of rotation
var distance = -2000;
// var vMouseSens = 0.05;
var iHalfX, iHalfY;
var zPos = -800;
// initialization
function sceneInit() {
    // prepare canvas and context objects
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    iHalfX = canvas.width / 2;
    iHalfY = canvas.height / 2;

    // initial scale and translate
    // console.log(obj.center);
    // scaleObj([1,1,1], obj);
    // console.log(obj.center);
    // translateObj([-obj.center[0], -obj.center[1], -obj.center[2]],obj);
    translateObj([0, -100, zPos], obj);//left/right, up/down, closer/farther

    // attach event handlers
    // document.onkeydown = handleKeydown;
    // canvas.onmousemove = handleMousemove;//set up mouse position functionality

    // main scene loop
    setInterval(drawScene,10);
    // drawScene();
}

// onKeyDown event handler
// function handleKeydown(e) {
//     kCode = ((e.which) || (e.keyCode));
//     switch (kCode) {
//         case 38: vAlpha = (vAlpha <= 0.9) ? (vAlpha + 0.1) : vAlpha; break; // Up key
//         case 40: vAlpha = (vAlpha >= 0.2) ? (vAlpha - 0.1) : vAlpha; break; // Down key
//     }
// }
//
// // onMouseMove event handler
// function handleMousemove(e) {
//     var x = e.pageX - canvas.offsetLeft;
//     var y = e.pageY - canvas.offsetTop;
//
//     if ((x > 0) && (x < canvas.width) && (y > 0) && (y < canvas.height)) {
//         vShiftY = vMouseSens * (x - iHalfX) / iHalfX;
//         vShiftX = vMouseSens * (y - iHalfY) / iHalfY;
//     }
// }

// draw main scene function
function drawScene() {
    // clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // set fill color, stroke color, line width and global alpha
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 2;
    ctx.globalAlpha= vAlpha;

    // vertical and horizontal rotate
    // var vP1x = getRotationPar([0, 0, -1000], [1, 0, 0], vShiftX);
    // var vP2x = getRotationPar([0, 0, 0], [1, 0, 0], vShiftX);
    // rotateObj(vP1x, vP2x, obj);
    var vP1y = getRotationPar([0, 0, zPos], [0, 1, 0], vShiftY);
    var vP2y = getRotationPar([0, 0, 0], [0, 1, 0], vShiftY);
    rotateObj(vP1y, vP2y, obj);

    // recalculate distances
    for (var i = 0; i < obj.points_number; i++) {//for each point calc distance from origin
        obj.distances[i] = Math.pow(obj.points[i][0],2) + Math.pow(obj.points[i][1],2) + Math.pow(obj.points[i][2],2);
        // x^2 + y^2 + z^2
    }

    // prepare array with face triangles (with calculation of max distance for every face)
    var iCnt = 0;
    var aFaceTriangles = new Array();
    for (var i = 0; i < obj.faces_number; i++) {
        var max = obj.distances[obj.faces[i][0]];
        for (var f = 1; f < obj.faces[i].length; f++) {
            if (obj.distances[obj.faces[i][f]] > max)
                max = obj.distances[obj.faces[i][f]];
        }
        aFaceTriangles[iCnt++] = {
            faceVertex:obj.faces[i],
            faceColor:obj.colors[i],
            distance:max
        };
    }
    // for(let e=0;e<aFaceTriangles.length;e++){
    //     console.log(aFaceTriangles[e]);
    // }
    aFaceTriangles.sort(sortByDistance);

    // prepare array with projected points
    var aPrjPoints = new Array();
    for (var i = 0; i < obj.points.length; i++) {
        aPrjPoints[i] = project(distance, obj.points[i], iHalfX, iHalfY);
    }

    // draw an object (surfaces)
    for (var i = 0; i < iCnt; i++) {

        ctx.fillStyle = aFaceTriangles[i].faceColor;

        // begin path
        ctx.beginPath();

        // face vertex index
        var iFaceVertex = aFaceTriangles[i].faceVertex;

        // move to initial position
        ctx.moveTo(aPrjPoints[iFaceVertex[0]][0], aPrjPoints[iFaceVertex[0]][1]);

        // and draw three lines (to build a triangle)
        for (var z = 1; z < aFaceTriangles[i].faceVertex.length; z++) {
            ctx.lineTo(aPrjPoints[iFaceVertex[z]][0], aPrjPoints[iFaceVertex[z]][1]);
        }

        // close path, strole and fill a triangle
        ctx.closePath();
        ctx.stroke();
        // ctx.fill();
    }
}

// sort function
function sortByDistance(x, y) {
    return (y.distance - x.distance);
}

// initialization
if (window.attachEvent) {
    window.attachEvent('onload', sceneInit);
}
else {
    if (window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            sceneInit();
        };
        window.onload = newonload;
    }
    else {
        window.onload = sceneInit;
    }
}
