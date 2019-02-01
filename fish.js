// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 300;


// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

//Move camera on mouse move
var controls = new THREE.OrbitControls( camera );

// Configure renderer
renderer.setPixelRatio( window.devicePixelRatio );
//renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( '#b2e2ff', 1 );

// Configure renderer size
renderer.setSize( 450, 450 );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );
renderer.render (scene, camera);


var fishies = [];



function fish() {
	var material = new THREE.MeshBasicMaterial( { color : 'orange' } );
	var fishBody;
	var tween;
	var direction;

	//make the two triangle halves that make up the fish body
	this.makeTop = () => {
		//create a triangular geometry
		var topGeo = new THREE.Geometry();
		topGeo.vertices.push( new THREE.Vector3( -35, 0, 0 ) );
		topGeo.vertices.push( new THREE.Vector3(  30, 0, 0 ) );
		topGeo.vertices.push( new THREE.Vector3(  16, 6, 0 ) );

		//create a new face using vertices 0, 1, 2
		var topFace = new THREE.Face3( 0, 1, 2 );

		//add the face to the geometry's faces array
		topGeo.faces.push( topFace );
		var topShape = new THREE.Mesh( topGeo);

		//scene.add( topShape );
		return topGeo;
		
	}
	this.makeBottom = () => {
		var bottomGeo = new THREE.Geometry();
		bottomGeo.vertices.push( new THREE.Vector3( -35, 0, 0 ) );
		bottomGeo.vertices.push( new THREE.Vector3(  16, -6, 0 ) )
		bottomGeo.vertices.push( new THREE.Vector3(  30, 0, 0 ) );

		var bottomFace = new THREE.Face3( 0, 1, 2 );

		bottomGeo.faces.push( bottomFace );
		var bottomShape = new THREE.Mesh( bottomGeo);
		//scene.add( bottomShape );
		return bottomGeo;
	}

	this.makeFish = () => {
		topFace = this.makeTop();
		bottomFace = this.makeBottom();
		console.log(topFace);
		var fishGeo = new THREE.Geometry();
		fishGeo.merge(topFace, topFace.matrix);
		fishGeo.merge(bottomFace, bottomFace.matrix)
		fishBody = new THREE.Mesh( fishGeo, material );
		scene.add(fishBody);

		direction = new THREE.Vector3(Math.random(), Math.random(), 0);
		console.log(fishBody.matrix)
	}
	this.makeFish();

	this.move = () => {
		let x = fishBody.position.x,
			y = fishBody.position.y;
		let dX = direction.x,
			dY = direction.y;

		var magnitude = Math.sqrt( (dX*dX) + (dY*dY) );
		newX = x + dX * 1.3 / magnitude;
		newY = y + dY * 1.3 / magnitude;

		//fishBody.lookAt( direction.x, direction.y, 0 );

		//fishBody.rotateZ( Math.PI / 100);
		fishBody.position.set(newX, newY, 0);

		//random direction changes
		


		var frustum = new THREE.Frustum();
		frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)); 

		//change fish direction when fish reaches edge of pond
		var pos = new THREE.Vector3(fishBody.position.x + 5, fishBody.position.y + 5, 0);
		if (Math.abs(pos.x) > 200) {
			console.log("x limit");
			let randX = Math.random() * 0.4,
				randY = Math.random() * 3;
			randX = [-randX, randX][Math.floor(Math.random()) * 2];
			randY = [-randY, randY][Math.floor(Math.random()) * 2];
			console.log(randX,randY);


			direction.x = -direction.x + randX;
			//direction.y = direction.y + randY;

		}
		if (Math.abs(pos.y) > 200) {
			console.log("y limit");
			let randX = Math.random() * 3,
				randY = Math.random() * 0.4;
			randX = [-randX, randX][Math.floor(Math.random()) * 2];
			randY = [-randY, randY][Math.floor(Math.random()) * 2];
			console.log(randX,randY);

			//direction.x = direction.x + randX;
			direction.y = -direction.y + randY;
		}

	}

}



fish = new fish();


render = () => {
	requestAnimationFrame( render );
	fish.move();
	renderer.render (scene, camera);
}
render();


