import { type NodeProps } from "@xyflow/react";
import type { ComponentType } from "react";

import { Float } from "../nodes/values/Float";
import { BasicMaterial } from "../nodes/materials/BasicMaterial";
import { MathOp } from "../nodes/math/MathOp";
import { Vec2, Vec3, Vec4 } from "../nodes/values/Vec";
import { Noise2D } from "../nodes/noise/Noise2D";
import { Time } from "../nodes/inputs/Time";
import { Boolean } from "../nodes/values/Boolean";
import { Uv } from "../nodes/inputs/Uv";
import { Decompose } from "../nodes/vector/Decompose";
import { Simplex2D } from "../nodes/noise/Simplex2D";
import { Simplex3D } from "../nodes/noise/Simplex3D";
import { Floor } from "../nodes/math/Floor";
import { Min } from "../nodes/math/Min";
import { Max } from "../nodes/math/Max";

export type ShaderPassNodes = Record<string, ShaderPassCategory>;

export interface ShaderPassCategory {
  color: string;
  label: string;
  nodes: ShaderPassNode[];
}

export interface ShaderPassNode {
  name: string;
  label: string;
  node: ComponentType<
    NodeProps & {
      data: any;
      type: any;
    }
  >;
}

export const NodeTypes = {
  values: {
    color: "#afa",
    label: "Values",
    nodes: [
      { name: "float", label: "Float", node: Float },
      { name: "boolean", label: "Boolean", node: Boolean },
      { name: "vec2", label: "Vec2", node: Vec2 },
      { name: "vec3", label: "Vec3", node: Vec3 },
      { name: "vec4", label: "Vec4", node: Vec4 },
    ],
  },
  vector: {
    color: "#0af",
    label: "Vector",
    nodes: [{ name: "decompose", label: "Decompose", node: Decompose }],
  },
  materials: {
    color: "#aaf",
    label: "Materials",
    nodes: [{ name: "basicMtl", label: "Basic Material", node: BasicMaterial }],
  },
  math: {
    color: "#faa",
    label: "Math",
    nodes: [
      { name: "mathOp", label: "Math Op", node: MathOp },
      { name: "floor", label: "Floor", node: Floor },
      { name: "min", label: "Min", node: Min },
      { name: "max", label: "Max", node: Max },
    ],
  },
  noise: {
    color: "#999",
    label: "Noise",
    nodes: [
      { name: "noise2d", label: "Noise 2D", node: Noise2D },
      { name: "simplex2d", label: "Simplex 2D", node: Simplex2D },
      { name: "simplex3d", label: "Simplex 3D", node: Simplex3D },
    ],
  },
  inputs: {
    color: "#fff",
    label: "Inputs",
    nodes: [
      { name: "time", label: "Time", node: Time },
      { name: "uv", label: "UV", node: Uv },
    ],
  },
};
