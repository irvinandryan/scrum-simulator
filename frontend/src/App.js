import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSimConfig from "./components/CreateSimConfig";
import SimConfigList from "./components/SimConfigList";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
            <Routes>
            <Route path="/" element={<SimConfigList />} />
            <Route path="create" element={<CreateSimConfig />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}
export default App;