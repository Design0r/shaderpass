import r3fShaderTemplate from "./r3fShader.template?raw";

export function loadTemplate(data: Record<string, string>): string {
  const template = r3fShaderTemplate;
  return template.replace(/\$\{(\w+)\}/g, (_, name) =>
    data[name] != null ? data[name] : `\${${name}}`,
  );
}
