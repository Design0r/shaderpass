import { AttributeEditor } from "./components/AttributeEditor";
import { NodeEditor } from "./components/NodeEditor";
import { NodeExplorer } from "./components/NodeExplorer";
import { Viewport } from "./components/Viewport";

function App() {
  return (
    <div className="w-full h-full grid grid-cols-12">
      <div className="col-span-2 bg-base-100 shadow-xl">
        <NodeExplorer />
      </div>
      <div className="col-span-8 bg-base-300">
        <NodeEditor />
      </div>
      <div className="col-span-2 grid grid-rows-4 bg-base-300">
        <div className="row-span-1">
          <Viewport />
        </div>
        <div className="row-span-3 bg-base-100 shadow-xl">
          <AttributeEditor />
        </div>
      </div>
    </div>
  );
}

export default App;
