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

void main() {
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}

`;

const fragment = `
//builtin declarations
uniform vec2 uResolution;
varying vec2 vUv;

//custom declarations
// Simple 2D value noise
// Source: adapted from Inigo Quilez / IQ

// Hash function: maps a 2D point to a pseudo‑random float in [0,1)
float hash( vec2 p ) {
    // dot, sin, fract trick
    return fract( sin( dot(p, vec2(127.1, 311.7)) ) * 43758.5453123 );
}

// 2D value noise at position p
float noise( vec2 p ) {
    // integer cell
    vec2 i = floor(p);
    // fractional part
    vec2 f = fract(p);

    // four corners in the cell
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // smooth interpolation weights
    vec2 u = f * f * (3.0 - 2.0 * f);

    // bilinear interpolate
    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

float fbm(vec2 x, int octaves) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < octaves; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main() {
    float cZLbrpxJxf = fbm(vUv * 4.0, 3);
    vec4 pgpZybYmsB = vec4(0.0, 0.0, cZLbrpxJxf, 1.0);
    gl_FragColor = pgpZybYmsB;
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
