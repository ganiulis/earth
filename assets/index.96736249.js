import{S as ne,P as te,W as ae,O as re,M as O,C as ie,a as se,b as l,c as d,d as le,T as t,e as de,f as z,V as h,G as _,g as G,A as F,B as R,D as ce,h as me,i as ve,j as ue,k as pe,L as ge,l as c,m as fe,n as he,o as we,p as xe}from"./vendor.eebca2ba.js";const ye=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function v(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=v(o);fetch(o.href,n)}};ye();var Se="varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",Me="varying vec3 vNormal;void main(){float intensity=pow(0.7-dot(vNormal,vec3(0,0,1.0)),1.5);gl_FragColor=vec4(0.1,0.3,0.6,1.0)*intensity;}",Pe="varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",Te="varying vec3 vNormal;void main(){float intensity=pow(0.5-dot(vNormal,vec3(0,0,1.0)),1.5);gl_FragColor=vec4(0.25,0.25,0.25,1.0)*intensity;}";const m=new ne,p=new te(80,window.innerWidth/window.innerHeight,.1,1e3),w=new ae({canvas:document.querySelector("#bg"),antialias:!0});w.setPixelRatio(window.devicePixelRatio);w.setSize(window.innerWidth,window.innerHeight);const x=new re(p,w.domElement);x.minDistance=4;x.maxDistance=20;x.mouseButtons={LEFT:O.ROTATE,MIDDLE:O.DOLLY};function Ce(e){const v="./assets/img/skybox/"+e,s=".png";return["px","nx","py","ny","pz","nz"].map(r=>v+"_"+r+s)}const Ne=Ce("space"),I=new ie().load(Ne);I.mapping=se;m.background=I;const y=new l(new d(5,32,32),new le({map:new t().load("assets/img/sun/colormap.jpg"),emissive:new de("#f0f0f0")}));m.add(y);var H=new Date,Le=new Date(H.getFullYear(),0,0),be=H-Le,Ae=Math.floor(be/864e5),k=(Ae-172)*2/365.242199*Math.PI;const V=1e3;var B=k,S=Math.cos(B)*V,M=-Math.sin(B)*V;y.position.set(S,0,M);p.position.setX(-S/100-5-2);p.position.setY(10);p.position.setZ(M/100+11);var U=3;const g=new l(new d(U,128,128),new z({specularMap:new t().load("assets/img/earth/specmap.jpg"),shininess:50,bumpMap:new t().load("assets/img/earth/bumpmap.jpg"),bumpScale:.05}));g.material.onBeforeCompile=e=>{e.uniforms.sunPosition={value:new h(S,0,M)},e.uniforms.dayTexture={value:new t().load("assets/img/earth/colormap.jpg")},e.uniforms.nightTexture={value:new t().load("assets/img/earth/nightmap.jpg")},e.vertexShader=e.vertexShader.replace("#define PHONG",["#define PHONG",`
            uniform vec3 sunPosition;
            varying vec3 v_vertToLight;
          `].join(`
`)),e.vertexShader=e.vertexShader.replace("#include <project_vertex>",["#include <project_vertex>",`
            vec4 viewSunPos = viewMatrix * vec4(sunPosition, 1.0);
            v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
          `].join(`
`)),e.fragmentShader=e.fragmentShader.replace("#define PHONG",["#define PHONG",`
            uniform sampler2D dayTexture;
            uniform sampler2D nightTexture;
            varying vec3 v_vertToLight;
          `].join(`
`)),e.fragmentShader=e.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );",[`
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
`))};var Y=23.44*Math.PI/180;const j=new _;j.rotateOnAxis(new h(0,0,1),-Y);j.add(g);m.add(j);const je=new l(new d(3.1,64,64),new G({vertexShader:Se,fragmentShader:Me,blending:F,side:R}));g.add(je);const P=new l(new d(3.02,128,128),new z({map:new t().load("assets/img/earth/cloudmap.jpg"),alphaMap:new t().load("assets/img/earth/cloudmap.jpg"),side:ce,opacity:.7,transparent:!0,depthWrite:!1}));var De,Ee=S,M;P.material.onBeforeCompile=e=>{e.uniforms.sunPosition={value:new h(De,0,Ee)},e.vertexShader=e.vertexShader.replace("#define PHONG",["#define PHONG",`
            varying vec3 sunPosition;
            varying vec3 v_vertToLight;
            varying vec2 normalScale;
          `].join(`
`)),e.vertexShader=e.vertexShader.replace("#include <project_vertex>",[`
          vec4 mvPosition = vec4( transformed, 1.0 );
          vec4 viewSunPos = viewMatrix * vec4(vec3(-165.91479381383044, 0.0, -986.1400920729843), 1.0); // it does work, but it doesn't wanna
          v_vertToLight = normalize(viewSunPos.xyz - mvPosition.xyz);
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
          #endif
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
          `].join(`
`)),e.fragmentShader=e.fragmentShader.replace("#define PHONG",["#define PHONG",`
            varying vec3 v_vertToLight;
            uniform sampler2D cloudTexture;
          `].join(`
`)),e.fragmentShader=e.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );",["vec3 cloudText = texture2D(cloudTexture, vUv).xyz;","float cosineAngleSunToNormal = dot(normalize(vNormal), v_vertToLight);","cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);","float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;","vec3 cloudColor = mix( vec3(0), cloudText - vec3(0), mixAmountDaylight);","vec4 diffuseColor = vec4( cloudColor, opacity );"].join(`
`))};g.add(P);P.geometry.applyMatrix4(new me().makeRotationZ(-Y));var W=U*(3475/12756);const T=new l(new d(W,64,64),new ve({map:new t().load("assets/img/moon/colormap.jpg"),displacementMap:new t().load("assets/img/moon/displacemap.jpg"),displacementScale:.1}));var Oe=358.46*Math.PI/180;const D=new _;D.rotateOnAxis(new h(0,0,1),Oe);D.add(T);m.add(D);const C=1737.4,N=6371,L=75,ze=L*(362600+C+N)/(384e3+C+N),_e=L*(405400+C+N)/(384e3+C+N),q=(_e/ze-1)/2+1;var b,X,Z,K;const Ge=new l(new d(W*1.1,64,64),new G({vertexShader:Pe,fragmentShader:Te,blending:F,side:R}));T.add(Ge);const Fe=new ue(16777215);y.add(Fe);const Re=new pe(2105376);m.add(Re);const $=new t,Ie=$.load("assets/img/sun/lensflare0.png"),u=$.load("assets/img/sun/lensflare3.png"),i=new ge;i.addElement(new c(Ie,512,0));i.addElement(new c(u,40,.2));i.addElement(new c(u,90,.1));i.addElement(new c(u,100,-.21));i.addElement(new c(u,300,-.12));i.addElement(new c(u,300,.12));i.addElement(new c(u,60,.3));y.add(i);function He(e,a){return e+a}function ke(){const e=new d(.5,8,8),a=new he({color:16777215}),v=new l(e,a);for(;;){const[s,o,n]=Array(3).fill().map(()=>we.randFloatSpread(1e3)),r=Math.sqrt([s,o,n].map(E=>E*E).reduce(He,0));if(-500<r&&r>500){v.position.set(s,o,n),m.add(v);break}}}Array(451).fill().forEach(ke);var f={};f.value=60;var Ve=2*Math.PI/f.value;2*Math.PI/f.value/365.24;var Be=2*Math.PI/f.value,J=Ve/27.322;const A=new xe(!0),Q=new fe,ee=Q.addFolder("Earth");ee.add(f,"value",0,120);ee.open();Q.close();function oe(e){g.rotation.y=A.getElapsedTime()*Be,P.rotation.y=A.getElapsedTime()*-.01,b=k+45*Math.PI/180+A.getElapsedTime()*J,X=Math.sin(b)*L,Z=Math.cos(b)*L*q,K=Math.sin(b)*3,T.position.set(X,K,Z+q),T.rotation.y=A.getElapsedTime()*J+Math.PI,x.update(),w.render(m,p),requestAnimationFrame(oe)}oe();
