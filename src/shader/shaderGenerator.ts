import type { Edge, Node } from "@xyflow/react";
import type { NumberData } from "../nodes/Number";
import type { MathData } from "../nodes/Math";
import type { Vec2Data, Vec3Data, Vec4Data } from "../nodes/Vec";
import type { Noise2DData } from "../nodes/Noise2D";
import { NOISE_2D } from "./noise/noise2d/noise2d";

export class ShaderGenerator {
  private nodesById: Map<string, Node>;
  private inputsById: Map<string, Record<string, string>>;

  private nodeCache = new Map<string, string>();

  private nodes: Node[];

  private fragDeclarations = new Set<string>();
  private fragCode: string[] = [];

  private vertDeclarations = new Set<string>();
  private vertCode: string[] = [];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodesById = new Map<string, Node>();
    this.inputsById = new Map<string, Record<string, string>>();
    this.nodes = nodes;
    nodes.map((n) => {
      this.nodesById.set(n.id, n);
    });
    for (const { source, target, targetHandle } of edges) {
      const map = this.inputsById.get(target) || {};
      map[targetHandle ?? ""] = source;
      this.inputsById.set(target, map);
    }
  }

  public generate(): { vertex: string; fragment: string } {
    const defaultRet = { vertex: "", fragment: "" };
    const root = this.nodes.find((n) => n.type === "shaderOutput")?.id;
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
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
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
    gl_FragColor = ${fragmentTree};
}
`;
    console.log(vertex);
    console.log(fragment);

    return { vertex, fragment };
  }

  private codeGen(
    nodeId: string,
    declarations: Set<string>,
    code: string[],
  ): string {
    const node = this.nodesById.get(nodeId);
    if (!node) {
      console.log("no node found for: \n", nodeId);
      return "";
    }
    if (this.nodeCache.has(nodeId)) return nodeId;

    switch (node.type) {
      case "number": {
        const data = node.data as unknown as NumberData;
        declarations.add(`float ${node.id} = ${data.value.toFixed(3)};`);
        break;
      }
      case "math": {
        const data = node.data as unknown as MathData;
        const inputs = this.inputsById.get(node.id);
        if (!inputs) {
          console.log("no inputs found for: \n", node);
          return "";
        }
        console.log(inputs);
        const a = this.codeGen(inputs.a, declarations, code);
        const b = this.codeGen(inputs.b, declarations, code);
        console.log(a, b);

        const generatedCode = `float ${node.id} = ${a} ${data.operation} ${b};`;
        this.nodeCache.set(node.id, generatedCode);
        code.push(generatedCode);

        break;
      }
      case "vec2": {
        const data = node.data as unknown as Vec2Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `vec2 ${node.id} = vec2(${data.x}, ${data.y});`;
        this.nodeCache.set(node.id, generatedCode);
        code.push(generatedCode);
        break;
      }
      case "vec3": {
        const data = node.data as unknown as Vec3Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `vec3 ${node.id} = vec3(${data.r}, ${data.g}, ${data.b});`;
        this.nodeCache.set(node.id, generatedCode);
        code.push(generatedCode);
        break;
      }
      case "vec4": {
        const data = node.data as unknown as Vec4Data;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k] = this.codeGen(v, declarations, code);
          }
        }
        const generatedCode = `vec4 ${node.id} = vec4(${data.r}, ${data.g}, ${data.b}, ${data.a});`;
        this.nodeCache.set(node.id, generatedCode);
        code.push(generatedCode);
        break;
      }
      case "noise2d": {
        const data = node.data as unknown as Noise2DData;
        const inputs = this.inputsById.get(node.id);
        if (inputs) {
          for (const [k, v] of Object.entries(inputs)) {
            data[k] = this.codeGen(v, declarations, code);
          }
        }
        declarations.add(NOISE_2D);
        const generatedCode = `float ${node.id} = noise(vUv * ${data.frequency});`;
        this.nodeCache.set(node.id, generatedCode);
        code.push(generatedCode);
        break;
      }

      default:
        throw new Error("Error: invalid node type: ", node.type);
    }

    return node.id;
  }
}
