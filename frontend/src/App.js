import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSimConfig from "./components/CreateSimConfig";
import SimConfigList from "./components/SimConfigList";
import SelectSimConfig from "./components/SelectSimConfig";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
            <Routes>
            <Route path="/" element={<SimConfigList />} />
            <Route path="create" element={<CreateSimConfig />} />
            <Route path="selectsimconfig/:id" element={<SelectSimConfig />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}
export default App;