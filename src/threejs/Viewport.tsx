import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { JSX } from "react";

export function Viewport(): JSX.Element {
  return (
    <>
      <div className="w-full h-full">
        <Canvas shadows>
          <Sphere position={[0, 1, 0]} args={[1, 32, 32]}>
            <meshStandardMaterial color={"#aaa"} />
          </Sphere>
          <ContactShadows opacity={0.25} />
          <Environment preset="studio" />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </>
  );
}
