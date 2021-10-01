import*as e from"https://cdn.skypack.dev/three@0.132.2";import{OrbitControls as W}from"https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";import{Lensflare as X,LensflareElement as l}from"https://cdn.skypack.dev/three@0.132.2/examples/jsm/objects/Lensflare.js";import{GUI as Z}from"https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js";const K=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function c(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=c(t);fetch(t.href,n)}};K();var J="varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",Q="varying vec3 vNormal;void main(){float intensity=pow(0.7-dot(vNormal,vec3(0,0,1.0)),1.5);gl_FragColor=vec4(0.1,0.3,0.6,1.0)*intensity;}",$="varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",ee="varying vec3 vNormal;void main(){float intensity=pow(0.5-dot(vNormal,vec3(0,0,1.0)),1.5);gl_FragColor=vec4(0.25,0.25,0.25,1.0)*intensity;}";const d=new e.Scene,v=new e.PerspectiveCamera(80,window.innerWidth/window.innerHeight,.1,1e3),g=new e.WebGLRenderer({canvas:document.querySelector("#bg"),antialias:!0});g.setPixelRatio(window.devicePixelRatio);g.setSize(window.innerWidth,window.innerHeight);const h=new W(v,g.domElement);h.minDistance=4;h.maxDistance=20;h.mouseButtons={LEFT:e.MOUSE.ROTATE,MIDDLE:e.MOUSE.DOLLY};function oe(o){const c="./assets/img/skybox/"+o,s=".png";return["px","nx","py","ny","pz","nz"].map(a=>c+"_"+a+s)}const te=oe("space"),A=new e.CubeTextureLoader().load(te);A.mapping=e.CubeRefractionMapping;d.background=A;const f=new e.Mesh(new e.SphereGeometry(5,32,32),new e.MeshLambertMaterial({map:new e.TextureLoader().load("assets/img/sun/colormap.jpg"),emissive:new e.Color("#f0f0f0")}));d.add(f);var E=new Date,ne=new Date(E.getFullYear(),0,0),re=E-ne,ae=Math.floor(re/864e5),G=(ae-172)*2/365.242199*Math.PI;const D=1e3;var O=G,w=Math.cos(O)*D,x=-Math.sin(O)*D;f.position.set(w,0,x);v.position.setX(-w/100-5-2);v.position.setY(10);v.position.setZ(x/100+11);var z=3;const u=new e.Mesh(new e.SphereGeometry(z,128,128),new e.MeshPhongMaterial({specularMap:new e.TextureLoader().load("assets/img/earth/specmap.jpg"),shininess:50,bumpMap:new e.TextureLoader().load("assets/img/earth/bumpmap.jpg"),bumpScale:.05}));u.material.onBeforeCompile=o=>{o.uniforms.sunPosition={value:new e.Vector3(w,0,x)},o.uniforms.dayTexture={value:new e.TextureLoader().load("assets/img/earth/colormap.jpg")},o.uniforms.nightTexture={value:new e.TextureLoader().load("assets/img/earth/nightmap.jpg")},o.vertexShader=o.vertexShader.replace("#define PHONG",["#define PHONG",`
        uniform vec3 sunPosition;
        varying vec3 v_vertToLight;
      `].join(`
`)),o.vertexShader=o.vertexShader.replace("#include <project_vertex>",["#include <project_vertex>",`
        vec4 viewSunPos = viewMatrix * vec4(sunPosition, 1.0);
        v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
      `].join(`
`)),o.fragmentShader=o.fragmentShader.replace("#define PHONG",["#define PHONG",`
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        varying vec3 v_vertToLight;
      `].join(`
`)),o.fragmentShader=o.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );",[`
        float intensity = 1.20 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.1, 0.3, 0.6) * pow(intensity, 1.8);

        vec3 dayColor = texture2D(dayTexture, vUv).xyz;
        vec3 nightColor = texture2D(nightTexture, vUv).xyz * vec3(3.2);
        
        float cosineAngleSunToNormal = dot(normalize(vNormal), v_vertToLight);
        cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);
        float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;
        vec3 color = mix(nightColor, dayColor, mixAmountDaylight);
        vec4 diffuseColor = vec4( color + atmosphere, opacity );
      `].join(`
`))};var _=23.44*Math.PI/180;const N=new e.Group;N.rotateOnAxis(new e.Vector3(0,0,1),-_);N.add(u);d.add(N);const ie=new e.Mesh(new e.SphereGeometry(3.1,64,64),new e.ShaderMaterial({vertexShader:J,fragmentShader:Q,blending:e.AdditiveBlending,side:e.BackSide}));u.add(ie);const y=new e.Mesh(new e.SphereGeometry(3.02,128,128),new e.MeshPhongMaterial({map:new e.TextureLoader().load("assets/img/earth/cloudmap.jpg"),alphaMap:new e.TextureLoader().load("assets/img/earth/cloudmap.jpg"),side:e.DoubleSide,opacity:.7,transparent:!0,depthWrite:!1}));var se,le=w,x;y.material.onBeforeCompile=o=>{o.uniforms.sunPosition={value:new e.Vector3(se,0,le)},o.vertexShader=o.vertexShader.replace("#define PHONG",["#define PHONG",`
        varying vec3 sunPosition;
        varying vec3 v_vertToLight;
        varying vec2 normalScale;
      `].join(`
`)),o.vertexShader=o.vertexShader.replace("#include <project_vertex>",[`
      vec4 mvPosition = vec4( transformed, 1.0 );
      vec4 viewSunPos = viewMatrix * vec4(vec3(-165.91479381383044, 0.0, -986.1400920729843), 1.0); // it does work, but it doesn't wanna
      v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
      #endif
      mvPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * mvPosition;
      `].join(`
`)),o.fragmentShader=o.fragmentShader.replace("#define PHONG",["#define PHONG",`
        varying vec3 v_vertToLight;
        uniform sampler2D cloudTexture;
      `].join(`
`)),o.fragmentShader=o.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );",["vec3 cloudText = texture2D(cloudTexture, vUv).xyz;","float cosineAngleSunToNormal = dot(normalize(vNormal), v_vertToLight);","cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);","float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;","vec3 cloudColor = mix( vec3(0), cloudText - vec3(0), mixAmountDaylight);","vec4 diffuseColor = vec4( cloudColor, opacity );"].join(`
`))};u.add(y);y.geometry.applyMatrix4(new e.Matrix4().makeRotationZ(-_));var k=z*(3475/12756);const S=new e.Mesh(new e.SphereGeometry(k,64,64),new e.MeshStandardMaterial({map:new e.TextureLoader().load("assets/img/moon/colormap.jpg"),displacementMap:new e.TextureLoader().load("assets/img/moon/displacemap.jpg"),displacementScale:.1}));var de=358.46*Math.PI/180;const j=new e.Group;j.rotateOnAxis(new e.Vector3(0,0,1),de);j.add(S);d.add(j);const M=1737.4,T=6371,P=75,ce=P*(362600+M+T)/(384e3+M+T),me=P*(405400+M+T)/(384e3+M+T),R=(me/ce-1)/2+1;var L,F,I,H;const ve=new e.Mesh(new e.SphereGeometry(k*1.1,64,64),new e.ShaderMaterial({vertexShader:$,fragmentShader:ee,blending:e.AdditiveBlending,side:e.BackSide}));S.add(ve);const ue=new e.PointLight(16777215);f.add(ue);const pe=new e.AmbientLight(2105376);d.add(pe);const V=new e.TextureLoader,ge=V.load("assets/img/sun/lensflare0.png"),m=V.load("assets/img/sun/lensflare3.png"),i=new X;i.addElement(new l(ge,512,0));i.addElement(new l(m,40,.2));i.addElement(new l(m,90,.1));i.addElement(new l(m,100,-.21));i.addElement(new l(m,300,-.12));i.addElement(new l(m,300,.12));i.addElement(new l(m,60,.3));f.add(i);function he(o,r){return o+r}function fe(){const o=new e.SphereGeometry(.5,8,8),r=new e.MeshBasicMaterial({color:16777215}),c=new e.Mesh(o,r);for(;;){const[s,t,n]=Array(3).fill().map(()=>e.MathUtils.randFloatSpread(1e3)),a=Math.sqrt([s,t,n].map(b=>b*b).reduce(he,0));if(-500<a&&a>500){c.position.set(s,t,n),d.add(c);break}}}Array(451).fill().forEach(fe);var p={};p.value=60;var we=2*Math.PI/p.value;2*Math.PI/p.value/365.24;var xe=2*Math.PI/p.value,B=we/27.322;const C=new e.Clock(!0),U=new Z,Y=U.addFolder("Earth");Y.add(p,"value",0,120);Y.open();U.close();function q(o){u.rotation.y=C.getElapsedTime()*xe,y.rotation.y=C.getElapsedTime()*-.01,L=G+45*Math.PI/180+C.getElapsedTime()*B,F=Math.sin(L)*P,I=Math.cos(L)*P*R,H=Math.sin(L)*3,S.position.set(F,H,I+R),S.rotation.y=C.getElapsedTime()*B+Math.PI,h.update(),g.render(d,v),requestAnimationFrame(q)}q();
