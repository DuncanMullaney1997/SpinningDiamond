// get random color
function getRandomColor() {
    // var letters = '0123456789ABCDEF'.split('');
    var letters = '123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * letters.length)];
    }
    return color;
}

// prepare object
// ...by creating normals and colors for each normal
function prepareObject(o) {
    o.colors = new Array();

    // prepare normals
    // ...by looping through faces and populating the
    // normals array with zeros
    o.normals = new Array();
    for (var i = 0; i < o.faces.length; i++) {
        o.normals[i] = [0, 0, 0];
        o.colors[i] = '#ff0000';
        // o.colors[i] = getRandomColor();
    }

    // prepare centers: calculate max positions
    // sum all positions of each vertex for x, y and
    // z coordinates and store in "o.center"
    o.center = [0, 0, 0];

    for (var i = 0; i < o.points.length; i++) {
        o.center[0] += o.points[i][0];
        o.center[1] += o.points[i][1];
        o.center[2] += o.points[i][2];
    }

    // calculate average center positions
    o.points_number = o.points.length;
    o.center[0] = o.center[0] / (o.points_number - 1);
    o.center[1] = o.center[1] / (o.points_number - 1);
    o.center[2] = o.center[2] / (o.points_number - 1);
    // console.log('center[0]',o.center[0]);
    // console.log('center[1]',o.center[1]);
    // console.log('center[2]',o.center[2]);

    // prepare distances
    // make space for a distance Array
    o.distances = new Array();
    for (var i = 1; i < o.points.length; i++) {
        o.distances[i] = 0;
    }

    o.faces_number = o.faces.length;
    o.axis_x = [1, 0, 0];
    o.axis_y = [0, 1, 0];
    o.axis_z = [0, 0, 1];
}

// Cube object
function diamond(n) {
    // prepare points and faces for cube
    // ...points are the vertices of the cube
    var numSides = n;
    var sideLength = 100
    var scaler_z = 1.1;
    var scaler_r = 0.8;
    var height = sideLength*1.3;
    var pi = Math.PI;
    // console.log('>>',pi);
    // console.log('>>',Math.cos(pi/4)*sideLength);
    var temp_pts = new Array([0,0,0]);

    // console.log('0:',temp_pts);

    // first level of vertices
    for(var el = 0; el < numSides; el++){

        temp_pts.push([
            Math.cos(el*360/numSides*pi/180)*sideLength,
            height,
            Math.sin(el*360/numSides*pi/180)*sideLength
        ]);

    }
    // console.log('1:',temp_pts);

    // 2nd level of vertices
    for(var el = 0; el < numSides; el++){

        temp_pts.push([
            Math.cos(el*360/numSides*pi/180)*sideLength*scaler_r,
            height*scaler_z,
            Math.sin(el*360/numSides*pi/180)*sideLength*scaler_r
        ]);

    }

    // midpoint vertices (i.e. midpoint of edges on first level)
    for(var el = 0; el < numSides; el++){

        temp_pts.push([
            Math.cos((el*360/numSides-360/(numSides*2))*pi/180)*sideLength*Math.sin((180-90-360/(numSides*2))*pi/180),
            height,
            Math.sin((el*360/numSides-360/(numSides*2))*pi/180)*sideLength*Math.sin((180-90-360/(numSides*2))*pi/180)
        ]);

    }
    // console.log('2:',temp_pts);
    temp_pts.push([0,0,0]);//add vertex
    // console.log('3:',temp_pts);

    this.points = temp_pts;
    // this.points=[
    //
    //     [Math.cos(0*360/numSides*pi/180)*sideLength,height,Math.sin(0*360/numSides*pi/180)*sideLength],
    //     [Math.cos(1*360/numSides*pi/180)*sideLength,height,Math.sin(1*360/numSides*pi/180)*sideLength],
    //     [Math.cos(2*360/numSides*pi/180)*sideLength,height,Math.sin(2*360/numSides*pi/180)*sideLength],
    //     [Math.cos(3*360/numSides*pi/180)*sideLength,height,Math.sin(3*360/numSides*pi/180)*sideLength],
    //     [Math.cos(4*360/numSides*pi/180)*sideLength,height,Math.sin(4*360/numSides*pi/180)*sideLength],
    //
    //     [0,0,0]
    // ];
    // console.log(this.points);

    // faces are the triangular elements that make up
    // the surface of the cube
    // 1,2,3,4,5,6
    var temp_fcs = new Array();

    // 1/4
    for(var elf=1;elf<=numSides;elf++){

        temp_fcs.push([elf,0,elf==numSides ? 1 : elf+1]);

    }

    // 2/4 and 3/4
    var vert1 = 1+2*numSides;
    for(var elf=1;elf<=numSides;elf++){

        // console.log(elf+'.1:',vert1);

        temp_fcs.push([
            elf,
            elf+numSides,
            vert1//elf+2*numSides==3*numSides ? elf+2*numSides : elf+2*numSides+1
        ]);

        vert1++;
        // console.log(elf+'.2:',vert1);

        vert1==3*numSides+1 ? vert1 = vert1-numSides : vert1;
        // vert1==3*numSides+1 ? console.log('TRUE') : console.log('FALSE');

        // console.log(elf+'.3:',vert1);

        temp_fcs.push([
            elf,
            elf+numSides,
            vert1//elf+2*numSides==numSides ? 1 : elf+1
        ]);

    }

    // 4/4
    var vert2 = 1+2*numSides;
    for(var elf=1;elf<=numSides;elf++){

        vert2++;

        temp_fcs.push([
            elf+numSides,
            elf+numSides==2*numSides ? elf+1 : elf+numSides+1,
            vert2==3*numSides+1 ? vert2-numSides : vert2//elf+2*numSides==3*numSides ? elf+2*numSides : elf+2*numSides+1
        ]);

    }

    // console.log(temp_fcs);
    this.faces = temp_fcs;
    // this.faces=[
    //
    //     [1,0,2],
    //     [2,0,3],
    //     [3,0,4],
    //     [4,0,5],
    //     [5,0,1],
    //
    //     [2,1,7],
    //     [6,1,7],
    //     [3,2,8],
    //     [7,2,8],
    //     [4,3,9],
    //     [8,3,9],
    //     [5,4,10],
    //     [9,4,10],
    //     [1,5,6],
    //     [10,5,6],
    // ];

    prepareObject(this);
    // gets the following:
    // 1. normals and their colors
    // 2. distances
    // 3. center position
    // 4. number of faces
    // 5. x y and z axes
}

// Cube object
function cube() {

    // prepare points and faces for cube
    // ...points are the vertices of the cube
    this.points=[
        [0,0,0],
        [100,0,0],
        [100,100,0],
        [0,100,0],
        [0,0,100],
        [100,0,100],
        [100,100,100],
        [0,100,100],
        // [50,50,100],
        // [50,50,0],
    ];

    // faces are the triangular elements that make up
    // the surface of the cube
    this.faces=[
        [0,4,5],
        [0,5,1],

        [1,5,6],
        [1,6,2],

        [2,6,7],
        [2,7,3],

        [3,7,4],
        [3,4,0],
        // [8,5,4],
        // [8,6,5],
        // [8,7,6],
        // [8,4,7],
        // [9,5,4],
        // [9,6,5],
        // [9,7,6],
        // [9,4,7],

        [4,6,5],
        [4,6,7],
        [0,2,1],
        [0,2,3],
    ];

    prepareObject(this);
}

// Sphere object
function sphere(n) {
    var delta_angle = 2 * Math.PI / n;

    // prepare vertices (points) of sphere
    var vertices = [];
    for (var j = 0; j < n / 2 - 1; j++) {
        for (var i = 0; i < n; i++) {
            vertices[j * n + i] = [];
            vertices[j * n + i][0] = 100 * Math.sin((j + 1) * delta_angle) * Math.cos(i * delta_angle);
            vertices[j * n + i][1] = 100 * Math.cos((j + 1) * delta_angle);
            vertices[j * n + i][2] = 100 * Math.sin((j + 1) * delta_angle) * Math.sin(i * delta_angle);
        }
    }
    vertices[(n / 2 - 1) * n] = [];
    vertices[(n / 2 - 1) * n + 1] = [];

    vertices[(n / 2 - 1) * n][0] = 0;
    vertices[(n / 2 - 1) * n][1] =  100;
    vertices[(n / 2 - 1) * n][2] =  0;

    vertices[(n / 2 - 1) * n + 1][0] = 0;
    vertices[(n / 2 - 1) * n + 1][1] = -100;
    vertices[(n / 2 - 1) * n + 1][2] = 0;

    this.points = vertices;

    // prepare faces
    var faces = [];
    for (var j = 0; j < n / 2 - 2; j++) {
        for (var i = 0; i < n - 1; i++) {
            faces[j * 2 * n + i] = [];
            faces[j * 2 * n + i + n] = [];

            faces[j * 2 * n + i][0] = j * n + i;
            faces[j * 2 * n + i][1] = j * n + i + 1;
            faces[j * 2 * n + i][2] = (j + 1) * n + i + 1;
            faces[j * 2 * n + i + n][0] = j * n + i;
            faces[j * 2 * n + i + n][1] = (j + 1) * n + i + 1;
            faces[j * 2 * n + i + n][2] = (j + 1) * n + i;
        }

        faces[j * 2 * n + n - 1] = [];
        faces[2 * n * (j + 1) - 1] = [];

        faces[j * 2 * n + n - 1  ][0] = (j + 1) * n - 1;
        faces[j * 2 * n + n - 1  ][1] = (j + 1) * n;
        faces[j * 2 * n + n - 1  ][2] = j * n;
        faces[2 * n * (j + 1) - 1][0] = (j + 1) * n - 1;
        faces[2 * n * (j + 1) - 1][1] = j * n + n;
        faces[2 * n * (j + 1) - 1][2] = (j + 2) * n - 1;
    }
    for (var i = 0; i < n - 1; i++) {
        faces[n * (n - 4) + i] = [];
        faces[n * (n - 3) + i] = [];

        faces[n * (n - 4) + i][0] = (n / 2 - 1) * n;
        faces[n * (n - 4) + i][1] = i;
        faces[n * (n - 4) + i][2] = i + 1;
        faces[n * (n - 3) + i][0] = (n / 2 - 1) * n + 1;
        faces[n * (n - 3) + i][1] = (n / 2 - 2) * n + i + 1;
        faces[n * (n - 3) + i][2] = (n / 2 - 2) * n + i;
    }

    faces[n * (n - 3) - 1] = [];
    faces[n * (n - 2) - 1] = [];

    faces[n * (n - 3) - 1][0] = (n / 2 - 1) * n;
    faces[n * (n - 3) - 1][1] = n - 1;
    faces[n * (n - 3) - 1][2] = 0;
    faces[n * (n - 2) - 1][0] = (n / 2 - 1) * n + 1;
    faces[n * (n - 2) - 1][1] = (n / 2 - 2) * n;
    faces[n * (n - 2) - 1][2] = (n / 2 - 2) * n + n - 1;

    this.faces=faces;

    prepareObject(this);
}
