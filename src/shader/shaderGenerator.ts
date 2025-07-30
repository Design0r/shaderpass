import type { Edge } from "@xyflow/react";
import type { MathOpData } from "../nodes/math/MathOp";
import type { Noise2DData } from "../nodes/noise/Noise2D";
import type { FloatData } from "../nodes/values/Float";
import type { Vec2Data, Vec3Data, Vec4Data } from "../nodes/values/Vec";
import type { NodeData } from "../types/nodeData";
import { FBM_2D, NOISE_2D } from "./noise/noise2d/noise2d";

export class ShaderGenerator {
  private nodesById: Map<string, NodeData>;
  private inputsById: Map<
    string,
    Record<string, { node: string; port: string }>
  >;

  private nodes: NodeData[];

  private fragDeclarations = new Set<string>();
  private fragCode: string[] = [];

  private vertDeclarations = new Set<string>();
  private vertCode: string[] = [];

  constructor(nodes: NodeData[], edges: Edge[]) {
    this.nodesById = new Map<string, NodeData>();
    this.inputsById = new Map<
      string,
      Record<string, { node: string; port: string }>
    >();
    this.nodes = nodes;
    nodes.map((n) => {
      this.nodesById.set(n.id, n);
    });
    for (const { source, sourceHandle, target, targetHandle } of edges) {
      const map = this.inputsById.get(target) || {};
      map[targetHandle!] = { node: source, port: sourceHandle! };
      this.inputsById.set(target, map);
    }
  }

  public generate(): { vertex: string; fragment: string } {
    const defaultRet = { vertex: "", fragment: "" };
    const root = this.nodes.find((n) => n.type === "basicMtl")?.id;
    if (!root) return defaultRet;

    const rootInputs = this.inputsById.get(root);
    if (!rootInputs) return defaultRet;
    const vertexTree = rootInputs.vertex;
    if (vertexTree)
      this.codeGen(vertexTree, this.vertDeclarations, this.vertCode);
    const fragmentTree = rootInputs.fragment;
    if (fragmentTree)
      this.codeGen(fragmentTree, this.fragDeclarations, this.fragCode);

    const vertex = `
//builtin declarations
uniform vec2 uResolution;
varying vec2 vUv;

//custom declarations
${[...this.vertDeclarations].join("\n")}
void main() {
    vUv = uv;
    ${[...this.vertCode].join("\n    ")}
    vec3 disp = ${vertexTree?.node || "1.0"} * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + disp,1.0);
}
`;

    const fragment = `
//builtin declarations
uniform vec2 uResolution;
varying vec2 vUv;

//custom declarations
${[...this.fragDeclarations].join("\n")}
void main() {
    ${[...this.fragCode].join("\n    ")}
    gl_FragColor = ${fragmentTree?.node};
}
`;
    console.log(vertex);
    console.log(fragment);

    return { vertex, fragment };
  }

  private codeGen(
    nodePortId: { node: string; port: string },
    declarations: Set<string>,
    code: string[]
  ): string {
    const node = this.nodesById.get(nodePortId.node);
    if (!node) {
      console.log("no node found for: \n", nodePortId.node);
      return "";
    }

    switch (node.type) {
      case "float": {
        const data = node.data as unknown as FloatData;
        declarations.add(`float ${node.id} = ${data.value};`);
        return node.id;
      }
      case "mathOp": {
        const data = node.data as unknown as MathOpData;
        const inputs = this.inputsById.get(node.id);
        if (!inputs) {
          console.log("no inputs found for: \n", node);
          return "";
        }
        const a = this.codeGen(inputs.a, declarations, code);
        const b = this.codeGen(inputs.b, declarations, code);

        const generatedCode = `float ${node.id} = ${a} ${data.operation} ${b};`;
        declarations.add(generatedCode);
        return node.id;
      }
      case "vec2": {
        const data = node.data as unknown as Vec2Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k as keyof Vec2Data] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `const vec2 ${node.id} = vec2(${data.x}, ${data.y});`;
        declarations.add(generatedCode);
        return node.id;
      }
      case "vec3": {
        const data = node.data as unknown as Vec3Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k as keyof Vec3Data] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `const vec3 ${node.id} = vec3(${data.r}, ${data.g}, ${data.b});`;
        declarations.add(generatedCode);
        return node.id;
      }
      case "vec4": {
        const data = node.data as unknown as Vec4Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k as keyof Vec4Data] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `const vec4 ${node.id} = vec4(${data.r}, ${data.g}, ${data.b}, ${data.a});`;
        declarations.add(generatedCode);
        return node.id;
      }
      case "noise2d": {
        const stored = node.data as unknown as Noise2DData;
        const inputs = this.inputsById.get(node.id) || {};

        const freq = inputs.freq
          ? this.codeGen(inputs.freq, declarations, code)
          : stored.frequency;

        const octaves = inputs.octaves
          ? parseInt(this.codeGen(inputs.octaves, declarations, code))
          : parseInt(stored.octaves);

        let generatedCode: string;

        if (inputs.time) {
          const timeExpr = this.codeGen(inputs.time, declarations, code);
          generatedCode = `float ${node.id} = fbm(vec2(vUv * ${freq} + ${timeExpr}), ${octaves});`;
        } else {
          generatedCode = `float ${node.id} = fbm(vUv * ${freq}, ${octaves});`;
        }
        declarations.add(NOISE_2D);
        declarations.add(FBM_2D);

        code.push(generatedCode);
        break;
      }
      case "time": {
        declarations.add("uniform float uTime;");
        return "uTime";
      }
      case "uv": {
        return "vUv";
      }
      case "decompose": {
        const input = this.inputsById.get(node.id)?.vec;
        if (!input) return "";

        const vec = this.codeGen(input, declarations, code);
        const varName = `${node.id}_${nodePortId.port}`;
        declarations.add(`const float ${varName} = ${vec}.${nodePortId.port};`);
        return varName;
      }

      default:
        throw new Error(`Error: invalid node type: ${node.type}`);
    }

    return node.id;
  }
}
