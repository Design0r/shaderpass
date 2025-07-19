import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type JSX } from "react";
import { useStore, type StoreState } from "../state";
import { shallow } from "zustand/shallow";
import { ShaderGenerator } from "../shader/shaderGenerator";
import type { ShaderMaterial } from "three";
import * as THREE from "three";

const selector = (selector: StoreState) => ({
  nodes: selector.nodes,
  edges: selector.edges,
});

export function Viewport(): JSX.Element {
  return (
    <>
      <Canvas shadows>
        <Scene />
      </Canvas>
    </>
  );
}

function Scene(): JSX.Element {
  const { size } = useThree();
  const { nodes, edges } = useStore(selector, shallow);
  const [frag, setFrag] = useState<string>(`
void main() {
 gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`);
  const [vert, setVert] = useState<string>(`
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`);

  const matRef = useRef<ShaderMaterial>(null!);

  useEffect(() => {
    const { vertex, fragment } = new ShaderGenerator(nodes, edges).generate();
    if (vertex) setVert(vertex);
    if (fragment) setFrag(fragment);
  }, [nodes, edges]);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.vertexShader = vert;
      matRef.current.fragmentShader = frag;
      matRef.current.needsUpdate = true;
    }
  }, [vert, frag]);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  return (
    <>
      <Sphere position={[0, 1, 0]} args={[1, 32, 32]}>
        <shaderMaterial
          ref={matRef}
          fragmentShader={frag}
          vertexShader={vert}
          transparent
          uniforms={{
            uResolution: {
              value: new THREE.Vector2(size.width, size.height),
            },
          }}
        />
      </Sphere>
      <ContactShadows opacity={0.25} />
      <Environment preset="studio" />
      <PerspectiveCamera position={[3.25, 0.5, 0]} makeDefault />
      <OrbitControls target={[0, 1, 0]} />
    </>
  );
}
