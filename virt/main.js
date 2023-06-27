var camera, scene, renderer;

let fov = 85,
    texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

let mesh;

let indexPano = 0;

let currentPano = 0;

let indexSet = 0;

let currentSet = 0;

let  photo, choosing, movement_on_face, movement_behind, go_inside, go_outside;

let panorama = [['first.jpg', 'second.jpg'], ['third.jpg', 'fourth.jpg']];

movement_on_face = document.getElementById('onface');
movement_behind = document.getElementById('behind');

go_inside = document.getElementById('inside');
go_outside = document.getElementById('outside');

init();
animate();

movement_on_face.addEventListener('click', function () {
    goTo(1);
})
movement_behind.addEventListener('click', function () {
    goTo(-1);
})

go_inside.addEventListener('click', function () {
    goInOut(-1);
})
go_outside.addEventListener('click', function () {
    goInOut(1);
})

function goTo(drct) {

    let tmpCount = Math.max(0, Math.min(indexPano + drct, currentPano.length - 1));

    if (tmpCount != indexPano) {
        indexPano = tmpCount;
        console.log(indexPano);
        let filename = currentPano[indexPano];
        loadTexture(filename);
    }
}
function goInOut(drct) {

    currentPano = panorama[indexSet];
    let tmpCount = panorama[Math.max(0, Math.min(drct, panorama.length - 1))];

    if (tmpCount != currentPano) {
        currentPano = tmpCount;
        console.log(currentPano);
        let filename = currentPano[0];
        loadTexture(filename);
        indexSet = drct;
    }
}


function loadTexture(filename) {

    let texture = new THREE.ImageUtils.loadTexture(filename)
    texture.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial({ map: texture });
    mesh.material = material;
}

function init() {

    var container;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('first.jpg') }));
    mesh.scale.x = -1;
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onDocumentMouseMove(event) {

    if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
}

function onDocumentMouseUp(event) {

    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    
    if (event.wheelDeltaY) {
        fov -= event.wheelDeltaY * 0.05;
    } 
    else if (event.wheelDelta) {
        fov -= event.wheelDelta * 0.05;
    }
    else if (event.detail) {
        fov += event.detail * 1.0;
    }

    if(fov>110){
        fov = 110;
    }
    else if(fov<40){
        fov = 40;
    }

    camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
    render();
}

function animate() {

    requestAnimationFrame(animate);
    render();
}

function render() {

    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);
}

function myFunction() {

    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {

    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}