import type { ChangeEvent, JSX } from "react";
import { useStore, type StoreState } from "../state";
import { shallow } from "zustand/shallow";
import { attributeSchemas, type FieldType } from "../types/attributeSchemas";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

const selector = (state: StoreState) => ({
  selectedNode: state.selectedNode,
  updateNode: state.updateNode,
});

export function AttributeEditor(): JSX.Element {
  const { selectedNode, updateNode } = useStore(selector, shallow);

  if (!selectedNode || !selectedNode.type) {
    return <div className="p-4">Select a node to edit its attributes.</div>;
  }

  const schema: FieldType[] = attributeSchemas[selectedNode.type] || [];
  const data = selectedNode.data as Record<string, any>;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold text-center">Attributes</h2>
      {schema.map((fieldDef, i) => {
        const key = Object.keys(data)[i] ?? fieldDef.label.toLowerCase();
        return (
          <AttributeField
            key={key}
            nodeId={selectedNode.id}
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
  nodeId: string;
  fieldKey: string;
  fieldDef: FieldType;
  fieldValue: any;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
}

export function AttributeField({
  nodeId,
  fieldKey,
  fieldDef,
  fieldValue,
  onUpdate,
}: AttributeFieldProps): JSX.Element {
  const { type, label } = fieldDef;
  const [draft, setDraft] = useState(fieldValue?.toString() ?? "");

  useEffect(() => {
    setDraft(fieldValue?.toString() ?? "");
  }, [fieldValue]);

  const debounced = useDebouncedCallback((val: string) => {
    onUpdate(nodeId, { [fieldKey]: val });
  }, 500);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const raw = e.target.value;
    setDraft(raw);

    if (type === "enum") {
      onUpdate(nodeId, { [fieldKey]: raw });
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
