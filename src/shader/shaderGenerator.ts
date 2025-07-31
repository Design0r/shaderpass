import type { Edge } from "@xyflow/react";
import type { MathOpData } from "../nodes/math/MathOp";
import type { Noise2DData } from "../nodes/noise/Noise2D";
import type { FloatData } from "../nodes/values/Float";
import type { Vec2Data, Vec3Data, Vec4Data } from "../nodes/values/Vec";
import type { NodeData } from "../types/nodeData";
import { FBM_2D, NOISE_2D } from "./noise/noise2d/noise2d";

type Input = { node: string; port: string };
type InputsById = Record<string, Input>;

export class ShaderGenerator {
  private nodesById: Map<string, NodeData>;
  private inputsById: Map<string, InputsById>;

  private nodes: NodeData[];

  private fragDeclarations = new Set<string>();
  private fragCode = new Set<string>();

  private vertDeclarations = new Set<string>();
  private vertCode = new Set<string>();

  constructor(nodes: NodeData[], edges: Edge[]) {
    this.nodesById = new Map<string, NodeData>();
    this.inputsById = new Map<string, InputsById>();
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
    nodePortId: Input,
    declarations: Set<string>,
    code: Set<string>,
  ): string {
    const node = this.nodesById.get(nodePortId?.node);
    if (!node)
      throw new Error(`node with id ${nodePortId?.node} does not exist.`);

    switch (node.type) {
      case "float": {
        const data = node.data as FloatData;
        code.add(`float ${node.id} = ${data.value};`);
        break;
      }
      case "mathOp": {
        const data = node.data as MathOpData;
        const inputs = this.inputsById.get(node.id);
        if (!inputs) throw new Error(`no inputs found for: ${node}`);

        const a_node = this.nodesById.get(inputs.a.node);
        if (!a_node) throw new Error(`no input found for: ${node}`);
        const type = a_node.type.startsWith("vec") ? a_node.type : "float";

        const a = this.codeGen(inputs.a, declarations, code);
        const b = this.codeGen(inputs.b, declarations, code);

        code.add(`${type} ${node.id} = ${a} ${data.operation} ${b};`);
        break;
      }
      case "vec2": {
        const data = node.data as Record<keyof Vec2Data, string>;
        const inputs = this.inputsById.get(node.id);
        this.scanInputs(inputs, data, declarations, code);

        code.add(`vec2 ${node.id} = vec2(${data.x}, ${data.y});`);
        break;
      }
      case "vec3": {
        const data = node.data as Record<keyof Vec3Data, string>;
        const inputs = this.inputsById.get(node.id);
        this.scanInputs(inputs, data, declarations, code);

        const generatedCode = `vec3 ${node.id} = vec3(${data.r}, ${data.g}, ${data.b});`;
        code.add(generatedCode);
        break;
      }
      case "vec4": {
        const data = node.data as Record<keyof Vec4Data, string>;
        const inputs = this.inputsById.get(node.id);
        this.scanInputs(inputs, data, declarations, code);

        const generatedCode = `vec4 ${node.id} = vec4(${data.r}, ${data.g}, ${data.b}, ${data.a});`;
        code.add(generatedCode);
        break;
      }
      case "noise2d": {
        const data = node.data as Record<keyof Noise2DData, string>;
        const inputs = this.inputsById.get(node.id) || {};
        this.scanInputs(inputs, data, declarations, code);

        let generatedCode: string;
        if (inputs.time) {
          const timeExpr = this.codeGen(inputs.time, declarations, code);
          generatedCode = `float ${node.id} = fbm(vec2(vUv * ${data.frequency} + ${timeExpr}), ${data.octaves});`;
        } else {
          generatedCode = `float ${node.id} = fbm(vUv * ${data.frequency}, ${data.octaves});`;
        }

        declarations.add(NOISE_2D);
        declarations.add(FBM_2D);
        code.add(generatedCode);

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
        code.add(`float ${varName} = ${vec}.${nodePortId.port};`);
        return varName;
      }

      default:
        throw new Error(`Error: invalid node type: ${node.type}`);
    }

    return node.id;
  }

  private scanInputs(
    inputs: InputsById | undefined,
    data: Record<string, string>,
    declarations: Set<string>,
    code: Set<string>,
  ) {
    if (!inputs) return;
    for (const [k, v] of Object.entries(inputs)) {
      data[k] = this.codeGen(v, declarations, code);
    }
  }
}
