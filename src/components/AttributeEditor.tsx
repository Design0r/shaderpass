import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";
import { useStore, type StoreState } from "../state";
import { attributeSchemas, type FieldType } from "../types/attributeSchemas";

import type { Node } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

const selector = (state: StoreState) => ({
  selectedNode: state.selectedNode,
  updateNode: state.updateNode,
});

export function AttributeEditor(): JSX.Element {
  const { selectedNode, updateNode } = useStore(selector, shallow);

  if (!selectedNode || !selectedNode.type) {
    return (
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-center">Attributes</h2>
      </div>
    );
  }

  const schema: FieldType[] = attributeSchemas[selectedNode.type] || [];
  const data = selectedNode.data as Record<string, any>;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold text-center">Attributes</h2>

      <div className="flex items-center gap-2 py-1">
        <label className="w-24 text-right">Type</label>
        <input
          className="input flex-1 text-white"
          disabled
          value={selectedNode.type}
        />
      </div>
      {schema.map((fieldDef) => {
        const key = fieldDef.label.toLowerCase();
        return (
          <AttributeField
            key={key}
            node={selectedNode}
            fieldKey={key}
            fieldDef={fieldDef}
            fieldValue={data[key]}
            onUpdate={updateNode}
          />
        );
      })}
    </div>
  );
}

interface AttributeFieldProps {
  node: Node;
  fieldKey: string;
  fieldDef: FieldType;
  fieldValue: any;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
}

export function AttributeField({
  node,
  fieldKey,
  fieldDef,
  fieldValue,
  onUpdate,
}: AttributeFieldProps): JSX.Element {
  const { type, label } = fieldDef;
  const [draft, setDraft] = useState(fieldValue?.toString() ?? "");

  useEffect(() => {
    if (type != "boolean") setDraft(fieldValue?.toString() ?? "");
  }, [fieldValue, type]);

  const debounced = useDebouncedCallback((val: string) => {
    onUpdate(node.id, { [fieldKey]: val });
  }, 500);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const raw = e.target.value;
    setDraft(raw);

    if (type === "enum") {
      onUpdate(node.id, { [fieldKey]: raw });
    } else {
      debounced(raw);
    }
  };

  let input: JSX.Element;
  if (type === "number") {
    input = (
      <input
        type="number"
        className="input flex-1"
        step={0.1}
        value={draft}
        onChange={handleChange}
      />
    );
  } else if (type === "string") {
    input = (
      <input
        type="text"
        className="input flex-1"
        value={draft}
        onChange={handleChange}
      />
    );
  } else if (type === "boolean") {
    input = (
      <input
        type="checkbox"
        className="checkbox"
        checked={Boolean(fieldValue)}
        onChange={(e) => {
          onUpdate(node.id, { [fieldKey]: e.target.checked });
        }}
      />
    );
  } else {
    input = (
      <select className="select flex-1" value={draft} onChange={handleChange}>
        {fieldDef.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <label className="w-24 text-right">{label}</label>
      {input}
    </div>
  );
}
