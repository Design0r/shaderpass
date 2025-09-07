import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type JSX } from "react";
import type { ShaderMaterial } from "three";
import * as THREE from "three";

const vertex = `
//builtin declarations
uniform vec2 uResolution;
varying vec2 vUv;

//custom declarations
uniform float uTime;
//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float simplex3d(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vUv = uv;
    vec2 BKnqgrzTgq = vec2(20, 20);
    vec2 ANkTWguhhk = vUv * BKnqgrzTgq;
    vec2 NJtShTiZKf = floor(ANkTWguhhk);
    float kidNvfFbxk_g = NJtShTiZKf.g;
    float kidNvfFbxk_r = NJtShTiZKf.r;
    vec3 unjqNuGDdk = vec3(kidNvfFbxk_r, kidNvfFbxk_g, uTime);
    float MkyOChFbVP = simplex3d(unjqNuGDdk);
    float vXirWyVoBU = 0.576;
    float LuOXmmgVtn = uTime + vXirWyVoBU;
    vec3 kkuVLlaafZ = vec3(kidNvfFbxk_r, kidNvfFbxk_g, LuOXmmgVtn);
    float JoqrnYjkLU = simplex3d(kkuVLlaafZ);
    float pMhjvmyeXm = 2.2;
    float XmjdWyQvfm = uTime + pMhjvmyeXm;
    vec3 DmoAyoGWRY = vec3(kidNvfFbxk_r, kidNvfFbxk_g, XmjdWyQvfm);
    float ZQqivWjPlx = simplex3d(DmoAyoGWRY);
    vec3 TqWBZMRPvF = vec3(MkyOChFbVP, JoqrnYjkLU, ZQqivWjPlx);
    vec3 LFUmaZKkkK = vec3(0.1, 0.10, 0.1);
    vec3 rvmCHSTeWH = TqWBZMRPvF * LFUmaZKkkK;

    // get displacement amount (fallback to 0.0)
    vec3 rawDisp = rvmCHSTeWH;

    // displace along the (normalized) normal
    vec3 n = normalize(normal);
    vec3 disp = n * dot(rawDisp, normal);

    // apply displacement in object space, then transform
    vec4 mvPosition = modelViewMatrix * vec4(position + disp, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}

`;

const fragment = `
//builtin declarations
uniform vec2 uResolution;
varying vec2 vUv;

//custom declarations
uniform float uTime;
//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float simplex3d(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec2 BKnqgrzTgq = vec2(20, 20);
    vec2 ANkTWguhhk = vUv * BKnqgrzTgq;
    vec2 NJtShTiZKf = floor(ANkTWguhhk);
    float kidNvfFbxk_g = NJtShTiZKf.g;
    float kidNvfFbxk_r = NJtShTiZKf.r;
    vec3 unjqNuGDdk = vec3(kidNvfFbxk_r, kidNvfFbxk_g, uTime);
    float MkyOChFbVP = simplex3d(unjqNuGDdk);
    float vXirWyVoBU = 0.576;
    float LuOXmmgVtn = uTime + vXirWyVoBU;
    vec3 kkuVLlaafZ = vec3(kidNvfFbxk_r, kidNvfFbxk_g, LuOXmmgVtn);
    float JoqrnYjkLU = simplex3d(kkuVLlaafZ);
    float pMhjvmyeXm = 2.2;
    float XmjdWyQvfm = uTime + pMhjvmyeXm;
    vec3 DmoAyoGWRY = vec3(kidNvfFbxk_r, kidNvfFbxk_g, XmjdWyQvfm);
    float ZQqivWjPlx = simplex3d(DmoAyoGWRY);
    vec4 itpxbetEqE = vec4(MkyOChFbVP, JoqrnYjkLU, ZQqivWjPlx, 1.0);
    vec4 acWDbTUQWD = vec4(0.3, 0.3, 0.3, 0.0);
    vec4 pPUSQgdGNW = itpxbetEqE + acWDbTUQWD;
    gl_FragColor = pPUSQgdGNW;
}

`;

export interface MyMaterialProps {}

export function MyMaterial(props: MyMaterialProps): JSX.Element {
  const { size } = useThree();
  const matRef = useRef<ShaderMaterial>(null!);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.needsUpdate = true;
    }
  });

  return (
    <shaderMaterial
      ref={matRef}
      transparent
      fragmentShader={fragment}
      vertexShader={vertex}
      uniforms={{
        uResolution: {
          value: new THREE.Vector2(size.width, size.height),
        },
        uTime: { value: 0.0 },
      }}
      {...props}
    />
  );
}

export function TestScene(): JSX.Element {
  return (
    <>
      <Sphere position={[0, 1, 0]} args={[1, 32, 32]}>
        <MyMaterial />
      </Sphere>
      <ContactShadows opacity={0.25} />
      <Environment preset="studio" />
      <PerspectiveCamera position={[3.25, 0.5, 0]} makeDefault />
      <OrbitControls target={[0, 1, 0]} />
    </>
  );
}
