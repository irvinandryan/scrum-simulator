import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSimConfig from "./components/CreateSimConfig";
import SimConfigList from "./components/SimConfigList";
import SelectSimConfig from "./components/SelectSimConfig";
import SprintPlanning from "./components/SprintPlanning";
import EditSimConfig from "./components/EditSimConfig";
import SprintReview from "./components/SprintReview";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
            <Routes>
            <Route path="/" element={<SimConfigList />} />
            <Route path="create" element={<CreateSimConfig />} />
            <Route path="selectsimconfig/:id" element={<SelectSimConfig />} />
            <Route path="selectsimconfig/:id/simulation" element={<SprintPlanning />} />
            <Route path="selectsimconfig/:id/simulation/editsimconfig" element={<EditSimConfig />} />
            <Route path="selectsimconfig/:id/simulation/sprintreview" element={<SprintReview />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}
export default App;