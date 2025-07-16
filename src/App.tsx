import { NodeEditor } from "./node-editor/NodeEditor";
import { Viewport } from "./threejs/Viewport";

function App() {
  return (
    <div className="w-full h-full grid grid-cols-2">
      <div className="w-full h-full bg-base-300">
        <NodeEditor />
      </div>
      <div className="w-full h-full bg-base-100">
        <Viewport />
      </div>
    </div>
  );
}

export default App;
