import { AttributeEditor } from "./components/AttributeEditor";
import { NodeEditor } from "./components/NodeEditor";
import { NodeExplorer } from "./components/NodeExplorer";
import { Viewport } from "./components/Viewport";

function App() {
  return (
    <div className="w-full h-full grid grid-cols-12">
      <div className="col-span-1 bg-base-100 shadow-xl">
        <NodeExplorer />
      </div>
      <div className="col-span-8 bg-base-300">
        <NodeEditor />
      </div>
      <div className="col-span-3 grid grid-rows-5 bg-base-200">
        <div className="row-span-2">
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
