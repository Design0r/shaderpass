export type FieldType =
  | { type: "number"; label: string }
  | { type: "string"; label: string }
  | {
      type: "enum";
      label: string;
      options: { value: string; label: string }[];
    };

export type NodeAttributeSchema = Record<string, FieldType[]>;

export const attributeSchemas: NodeAttributeSchema = {
  number: [
    { type: "string", label: "Name" },
    { type: "number", label: "Value" },
  ],
  string: [
    { type: "string", label: "Name" },
    { type: "string", label: "Value" },
  ],
  math: [
    { type: "string", label: "Name" },
    {
      type: "enum",
      label: "Operation",
      options: [
        { value: "+", label: "+" },
        { value: "-", label: "–" },
        { value: "*", label: "×" },
        { value: "/", label: "÷" },
      ],
    },
  ],
  vec2: [
    { type: "string", label: "Name" },
    { type: "number", label: "X" },
    { type: "number", label: "Y" },
  ],
  vec3: [
    { type: "string", label: "Name" },
    { type: "number", label: "R" },
    { type: "number", label: "G" },
    { type: "number", label: "B" },
  ],
  vec4: [
    { type: "string", label: "Name" },
    { type: "number", label: "R" },
    { type: "number", label: "G" },
    { type: "number", label: "B" },
    { type: "number", label: "A" },
  ],
  noise2d: [
    { type: "string", label: "Name" },
    { type: "number", label: "Frequency" },
    { type: "number", label: "Time" },
  ],
  shaderOutput: [{ type: "string", label: "Name" }],
  time: [{ type: "string", label: "Name" }],
};
