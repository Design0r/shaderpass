import type { Edge, Node } from "@xyflow/react";
import type { NumberData } from "../nodes/Number";
import type { MathData } from "../nodes/Math";
import type { Vec2Data } from "../nodes/Vec2";
import type { Vec3Data } from "../nodes/Vec3";
import type { Vec4Data } from "../nodes/Vec4";

export class ShaderGenerator {
  private nodesById: Map<string, Node>;
  private inputsById: Map<string, Record<string, string>>;

  private nodeCache = new Map<string, string>();

  private nodes: Node[];
  private edges: Edge[];

  private fragDeclarations = new Set<string>();
  private fragCode: string[] = [];

  private vertDeclarations = new Set<string>();
  private vertCode: string[] = [];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodesById = new Map<string, Node>();
    this.inputsById = new Map<string, Record<string, string>>();
    this.nodes = nodes;
    this.edges = edges;

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
${[...this.vertDeclarations].join("\n")}

void main() {
    ${[...this.vertCode].join("\n    ")}
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

    const fragment = `
${[...this.fragDeclarations].join("\n")}

void main() {
    ${[...this.fragCode].join("\n    ")}
    gl_FragColor = ${fragmentTree};
}
`;

    return { vertex, fragment };
  }

  private codeGen(nodeId: string, declarations: Set<string>, code: string[]) {
    const stack = [nodeId];

    while (stack.length > 0) {
      const curr = stack.pop();
      if (!curr) return;

      const node = this.nodesById.get(curr);
      if (!node) {
        console.log("no node found for: \n", curr);
        continue;
      }
      console.log(node);
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
            continue;
          }
          const a = inputs.a;
          const b = inputs.b;
          stack.push(b);
          stack.push(a);
          declarations.add(`float ${node.id};`);
          const generatedCode = `${node.id} = ${a} ${data.operation} ${b};`;
          this.nodeCache.set(node.id, generatedCode);
          code.push(generatedCode);
          break;
        }
        case "vec2": {
          const data = node.data as unknown as Vec2Data;
          const inputs = this.inputsById.get(node.id);
          if (inputs) {
            const a = inputs.a;
            const b = inputs.b;
            stack.push(b);
            stack.push(a);
          }
          declarations.add(`vec2 ${node.id};`);
          const generatedCode = `${node.id} = vec2(${data.x}, ${data.y});`;
          this.nodeCache.set(node.id, generatedCode);
          code.push(generatedCode);
          break;
        }
        case "vec3": {
          const data = node.data as unknown as Vec3Data;
          const inputs = this.inputsById.get(node.id);
          if (inputs) {
            const r = inputs.r;
            const g = inputs.g;
            const b = inputs.b;
            stack.push(r);
            stack.push(g);
            stack.push(b);
          }
          declarations.add(`vec3 ${node.id};`);
          const generatedCode = `${node.id} = vec3(${data.r}, ${data.g}, ${data.b});`;
          this.nodeCache.set(node.id, generatedCode);
          code.push(generatedCode);
          break;
        }
        case "vec4": {
          const data = node.data as unknown as Vec4Data;
          const inputs = this.inputsById.get(node.id);
          if (inputs) {
            const r = inputs.r;
            const g = inputs.g;
            const b = inputs.b;
            const a = inputs.a;
            stack.push(r);
            stack.push(g);
            stack.push(b);
            stack.push(a);
          }
          declarations.add(`vec4 ${node.id};`);
          const generatedCode = `${node.id} = vec4(${data.r}, ${data.g}, ${data.b}, ${data.a});`;
          this.nodeCache.set(node.id, generatedCode);
          code.push(generatedCode);
          break;
        }
      }
    }
  }
}
