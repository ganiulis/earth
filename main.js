import './css/style.css'

import * as THREE from 'three'

import atmosVertexShader from './assets/shaders/earth/atmosVertex.glsl'
import atmosFragmentShader from './assets/shaders/earth/atmosFragment.glsl'
import moonAtmosVertexShader from './assets/shaders/moon/moonAtmosVertex.glsl'
import moonAtmosFragmentShader from './assets/shaders/moon/moonAtmosFragment.glsl'
import sunAtmosVertexShader from './assets/shaders/sun/sunAtmosVertex.glsl'
import sunAtmosFragmentShader from './assets/shaders/sun/sunAtmosFragment.glsl'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'



const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// creation of skybox
function createPathStrings(filename) {
  const basePath = './assets/img/skybox/';
  const baseFilename = basePath + filename;
  const fileType = '.png';
  const sides = [
    'px', 'nx', 
    'py', 'ny', 
    'pz', 'nz'
  ];
  const pathStrings = sides.map(side => {
    return baseFilename + '_' + side + fileType;
  });
  return pathStrings;
}
const materialArray = createPathStrings('space')
const textureCube = new THREE.CubeTextureLoader().load(materialArray)
textureCube.mapping = THREE.CubeRefractionMapping
scene.background = textureCube

//creation of the sun
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('assets/img/sun/colormap.jpg'),
    emissive: new THREE.Color('#f0f0f0')
  })
)
scene.add(sunMesh)

/*
// some math to explain the positioning logic of the sun
// sunCoordRadians takes in a radian of where to position the sun
// that means that the radians need to be converted from days of the year for correct positioning
// 03-21 is northward equinox,  the 79th  day of the year, which is  3 * Math.PI / 2   in radians, roughly 270 degrees
// 06-22 is summer solstice,    the 172nd day of the year, which is  0                 in radians, roughly 0 degrees
// 09-21 is southward equinox,  the 263rd day of the year, which is  Math.PI / 2       in radians, roughly 90 degrees
// 12-22 is winter solstice,    the 355th day of the year, which is  Math.PI           in radians, roughly 180 degrees
// a year is roughly 365.242199 days, which is 1,01456166 days for one degree of rotation
// 1,01456166 days = 1 degree of rotation
// 91.3125th day = roughly 90 degrees
*/

//calculating the current position of the sun

var dateNow = new Date();
var dateStart = new Date(dateNow.getFullYear(), 0, 0);
var dateDiff = dateNow - dateStart;
var dateDay = Math.floor(dateDiff / 86400000);

// calculating the position of the sun based on the current season with the help of some trigonometry
var sunRadian = (dateDay - 172) * 2 / 365.242199 * Math.PI
const sunCoordRadius = 1000 // distance from Earth; arbitrary number
var sunCoordRadians = sunRadian
var sunCoordX = Math.cos(sunCoordRadians) * sunCoordRadius
var sunCoordY = -Math.sin(sunCoordRadians) * sunCoordRadius
sunMesh.position.set(sunCoordX, 0, sunCoordY)

camera.position.setX(-sunCoordX/100 - 5 - 2);
camera.position.setY(10);
camera.position.setZ(sunCoordY/100 + 11);

// camera.lookAt(sunCoordX/100 + 7, -5, sunCoordY/100)

//creation of the earth
var earthSize = 3 // will also be used to calculate the relative size of the moon

const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(earthSize, 128, 128),
  new THREE.MeshPhongMaterial({      
    specularMap: new THREE.TextureLoader().load('assets/img/earth/specmap.jpg'),
    shininess: 50,
    bumpMap: new THREE.TextureLoader().load('assets/img/earth/bumpmap.jpg'),
    bumpScale: 0.05,
    //normalMap: new THREE.TextureLoader().load('assets/img/earth/normalmap.jpg'),
    //normalScale: new THREE.Vector2(5, 5)
  })
)
  

earthMesh.material.onBeforeCompile = shader => {
  shader.uniforms.sunPosition = {
      value: new THREE.Vector3(sunCoordX, 0.0, sunCoordY)
  }
  shader.uniforms.dayTexture = {
    value: new THREE.TextureLoader().load('assets/img/earth/colormap.jpg')
  }
  shader.uniforms.nightTexture = {
    value: new THREE.TextureLoader().load('assets/img/earth/nightmap.jpg')
  }
  shader.vertexShader = shader.vertexShader.replace('#define PHONG',
    [
      '#define PHONG',
      `
        uniform vec3 sunPosition;
        varying vec3 v_vertToLight;
      `
    ].join( '\n' )
  )
  shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>',
    [
      '#include <project_vertex>',
      `
        vec4 viewSunPos = viewMatrix * vec4(sunPosition, 1.0);
        v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
      `
    ].join( '\n' )
  )
  shader.fragmentShader = shader.fragmentShader.replace('#define PHONG',
    [
      '#define PHONG',
      `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        varying vec3 v_vertToLight;
      `
    ].join( '\n' )
  )
  shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
    [ 
      `
        float intensity = 1.20 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.1, 0.3, 0.6) * pow(intensity, 1.8);

        vec3 dayColor = texture2D(dayTexture, vUv).xyz;
        vec3 nightColor = texture2D(nightTexture, vUv).xyz * vec3(3.2);
        
        float cosineAngleSunToNormal = dot(normalize(vNormal), v_vertToLight);
        cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);
        float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;
        vec3 color = mix(nightColor, dayColor, mixAmountDaylight);
        vec4 diffuseColor = vec4( color + atmosphere, opacity );
      `
    ].join( '\n' )
  )
}

var earthTiltRadians = 23.44 * Math.PI / 180; // tilt of Earth in radians
const earthTiltGroup = new THREE.Group() // applies tilt so that rotation is applied correctly
earthTiltGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), -earthTiltRadians)
earthTiltGroup.add(earthMesh)
scene.add(earthTiltGroup)

const earthAtmos = new THREE.Mesh(
  new THREE.SphereGeometry(3.1, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader: atmosVertexShader,
    fragmentShader: atmosFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
earthMesh.add(earthAtmos);

const earthCloudLayer = new THREE.Mesh(
  new THREE.SphereGeometry(3.02, 128, 128),
  new THREE.MeshPhongMaterial({      
    map: new THREE.TextureLoader().load('assets/img/earth/cloudmap.jpg'),
    alphaMap: new THREE.TextureLoader().load('assets/img/earth/cloudmap.jpg'),
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true,
    depthWrite: false
  })
);

var v, j = sunCoordX, sunCoordY

earthCloudLayer.material.onBeforeCompile = shader => {
  shader.uniforms.sunPosition = { 
    value: new THREE.Vector3(v, 0.0, j) 
  }
  shader.vertexShader = shader.vertexShader.replace('#define PHONG',
    [
      '#define PHONG',`
        varying vec3 sunPosition;
        varying vec3 v_vertToLight;
        varying vec2 normalScale;
      `
    ].join( '\n' )
  )
  shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>',
    [
      `
      vec4 mvPosition = vec4( transformed, 1.0 );
      vec4 viewSunPos = viewMatrix * vec4(vec3(-165.91479381383044, 0.0, -986.1400920729843), 1.0); // it does work, but it doesn't wanna
      v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
      #endif
      mvPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * mvPosition;
      `
    ].join('\n')
  )
  shader.fragmentShader = shader.fragmentShader.replace('#define PHONG',
    [
      '#define PHONG',`
        varying vec3 v_vertToLight;
        uniform sampler2D cloudTexture;
      `
    ].join( '\n' )
  )
  shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
    [ 
      'vec3 cloudText = texture2D(cloudTexture, vUv).xyz;',
      'float cosineAngleSunToNormal = dot(normalize(vNormal), v_vertToLight);',
      'cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);',
      'float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;',
      'vec3 cloudColor = mix( vec3(0), cloudText - vec3(0), mixAmountDaylight);',
      'vec4 diffuseColor = vec4( cloudColor, opacity );'
    ].join( '\n' )
  )
}
earthMesh.add(earthCloudLayer);
earthCloudLayer.geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(-earthTiltRadians));

var moonSize = earthSize * (3475 / 12756) // used to calculate the relative size of the Moon

const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(moonSize, 64, 64),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('assets/img/moon/colormap.jpg'),
    displacementMap: new THREE.TextureLoader().load('assets/img/moon/displacemap.jpg'),
    displacementScale: 0.1
  })
)
var moonTiltRadians = 358.46 * Math.PI / 180; // 1.54 degree tilt of Moon away from Earth in radians
const moonTiltGroup = new THREE.Group() // applies tilt so that rotation is applied correctly
moonTiltGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), moonTiltRadians)
moonTiltGroup.add(moonMesh)
scene.add(moonTiltGroup)

const moonRadius = 1737.4
const earthRadius = 6371
const moonCoordRadius = 75 // average
const moonPerigee = moonCoordRadius * (362600 + moonRadius + earthRadius) / (384000 + moonRadius + earthRadius)
const moonApogee = moonCoordRadius * (405400 + moonRadius + earthRadius) / (384000 + moonRadius + earthRadius)
const moonOrbitEllipse = (moonApogee / moonPerigee - 1) / 2 + 1
var moonCoordDegrees, moonCoordX, moonCoordY, moonCoordZ

const moonAtmos = new THREE.Mesh(
  new THREE.SphereGeometry(moonSize * 1.1, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader: moonAtmosVertexShader,
    fragmentShader: moonAtmosFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
moonMesh.add(moonAtmos);

const pointLight = new THREE.PointLight(0xffffff);
sunMesh.add(pointLight)

const ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load( 'assets/img/sun/lensflare0.png' );
const textureFlare1 = textureLoader.load( 'assets/img/sun/lensflare3.png' );
const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement( textureFlare0, 512, 0));
lensflare.addElement(new LensflareElement( textureFlare1, 40, 0.2 ) );
lensflare.addElement(new LensflareElement( textureFlare1, 90, 0.1 ) );
lensflare.addElement(new LensflareElement( textureFlare1, 100, -0.21 ) );
lensflare.addElement(new LensflareElement( textureFlare1, 300, -0.12 ) );
lensflare.addElement(new LensflareElement( textureFlare1, 300, 0.12 ) );
lensflare.addElement(new LensflareElement( textureFlare1, 60, 0.3 ) );
sunMesh.add(lensflare);

/*
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(2000, 200);
scene.add(lightHelper, gridHelper);
*/

const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 4;
controls.maxDistance = 20;

function add(accumulator, a) {
  return accumulator + a;
}
function addStar() {
  const geometry = new THREE.SphereGeometry(0.5, 8, 8);
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );
  while (true) {
    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000)); // fills a 3d array with random floats
    const distance = Math.sqrt([x,y,z].map(a => a * a).reduce(add, 0)); // checks closeness to coordinate center
    if (-500 < distance && distance > 500) {
      star.position.set(x, y, z);
      scene.add(star);
      break;
    };
  }
}
Array(451).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.x = t * -0.01;
  camera.position.y = t * 0.002;
  camera.position.z = t * 0.0002;
  camera.rotation.y = t * 0.0002;
}

// document.body.onscroll = moveCamera;
// moveCamera();

const gui = new GUI()

var cycleSpeed = 60 // 1 Earth cycle & 1/27.322 Moon cycles in n seconds
var rotationVelocity = 2 * Math.PI / cycleSpeed
var earthCycle = 2 * Math.PI / cycleSpeed
var moonCycle = rotationVelocity / 27.322

const clockTimer = new THREE.Clock(true)

function animate(t) {
  //earthMesh.material.uniforms.sunPosition.value.x = sunCoordX
  //earthMesh.material.uniforms.sunPosition.value.z = sunCoordY

  moonCoordDegrees = (sunRadian + ( 45 * Math.PI / 180 ) + clockTimer.getElapsedTime() * moonCycle )
  moonCoordX = Math.sin(moonCoordDegrees) * moonCoordRadius
  moonCoordY = Math.cos(moonCoordDegrees) * moonCoordRadius * moonOrbitEllipse
  moonCoordZ = Math.sin(moonCoordDegrees) * 3 // used to exaggerate the moon's orbital inclination for effect
  moonMesh.position.set(moonCoordX, moonCoordZ, moonCoordY + moonOrbitEllipse)
  moonMesh.rotation.y = clockTimer.getElapsedTime() * moonCycle + Math.PI

  earthMesh.rotation.y = clockTimer.getElapsedTime() * earthCycle
  earthCloudLayer.rotation.y = clockTimer.getElapsedTime() * -0.01

  controls.update()

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();