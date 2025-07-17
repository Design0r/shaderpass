import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type JSX } from "react";
import { useStore, type StoreState } from "../state";
import { shallow } from "zustand/shallow";
import { ShaderGenerator } from "./ast";
import type { ShaderMaterial } from "three";

const selector = (selector: StoreState) => ({
  nodes: selector.nodes,
  edges: selector.edges,
});

export function Viewport(): JSX.Element {
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

  useEffect(() => {
    const shader = new ShaderGenerator(nodes, edges).generate();
    console.log(vert);
    console.log(frag);
    if (shader.fragment) {
      setFrag(shader.fragment);
    }
    if (shader.vertex) {
      setVert(shader.vertex);
    }
  }, [nodes, edges]);

  const matRef = useRef<ShaderMaterial>(null!);

  // ➋ Regenerate your shader code when nodes/edges change
  useEffect(() => {
    const { vertex, fragment } = new ShaderGenerator(nodes, edges).generate();
    if (vertex) setVert(vertex);
    if (fragment) setFrag(fragment);
  }, [nodes, edges]);

  // ➌ When our frag/vert strings update, inject and recompile
  useEffect(() => {
    if (matRef.current) {
      matRef.current.vertexShader = vert;
      matRef.current.fragmentShader = frag;
      matRef.current.needsUpdate = true;
    }
  }, [vert, frag]);

  return (
    <>
      <div className="w-full h-full">
        <Canvas shadows>
          <Sphere position={[0, 1, 0]} args={[1, 32, 32]}>
            <shaderMaterial
              ref={matRef}
              fragmentShader={frag}
              vertexShader={vert}
            />
          </Sphere>
          <ContactShadows opacity={0.25} />
          <Environment preset="studio" />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </>
  );
}
