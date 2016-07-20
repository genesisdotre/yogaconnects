app.controller("DetailCtrl", function($routeParams, $scope) {

  THREE.ImageUtils.crossOrigin = '';

  var init = true;
  var pressed = false;
  var timeout; // after 20 seconds of inactivity we re-enable rotation... (best guess about web usability)

  var longitude = 0;
  var latitude = 0;
  var savedX;
  var savedY;
  var savedLongitude;
  var savedLatitude;

  // setting up the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // creating a new scene
  var scene = new THREE.Scene();

  // adding a camera
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.target = new THREE.Vector3(0, 0, 0);

  // creation of a big sphere geometry
  var sphere = new THREE.SphereGeometry(100, 100, 40);
  sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

  // creation of the sphere material
  var sphereMaterial = new THREE.MeshBasicMaterial();
  sphereMaterial.map = THREE.ImageUtils.loadTexture( "big/" + $routeParams.img + ".JPG");

  // geometry + material = mesh (actual object)
  var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
  scene.add(sphereMesh);

  // listeners
  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);

  document.addEventListener("touchstart", onDocumentMouseDown, false);
  document.addEventListener("touchmove", onDocumentMouseMove, false);
  document.addEventListener("touchend", onDocumentMouseUp, false);
    
  render();
           
  function render() {
    
    requestAnimationFrame(render);
    
    if(init){
      longitude += 0.1;
    }

    // limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
    latitude = Math.max(-85, Math.min(85, latitude));

    // moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
    camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
    camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
    camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
    camera.lookAt(camera.target);

    // calling again render function
    renderer.render(scene, camera);
  }

  // when the mouse is pressed, we switch to manual control and save current coordinates
  function onDocumentMouseDown(event){
    event.preventDefault();
    init = false;
    pressed = true;

    savedX = event.targetTouches ? event.targetTouches[0].clientX : event.clientX;
    savedY = event.targetTouches ? event.targetTouches[0].clientY : event.clientY;

    savedLongitude = longitude;
    savedLatitude = latitude;
  }

  // when the mouse moves, if in manual contro we adjust coordinates
  function onDocumentMouseMove(event){
    var clientX = event.targetTouches ? event.targetTouches[0].clientX : event.clientX;
    var clientY = event.targetTouches ? event.targetTouches[0].clientY : event.clientY;

    if(pressed){
      longitude = (savedX - clientX) * 0.1 + savedLongitude;
      latitude = (clientY - savedY) * 0.1 + savedLatitude;
    }
  }

  function onDocumentMouseUp(event){
    pressed = false;
  }

  $scope.$on("$destroy", function() {
    renderer.domElement.remove()
  })

});