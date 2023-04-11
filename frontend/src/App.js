import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSimConfig from "./components/CreateSimConfig";
import SimConfigList from "./components/SimConfigList";
import SelectSimConfig from "./components/SelectSimConfig";
import SprintPlanning from "./components/SprintPlanning";
import EditSimConfig from "./components/EditSimConfig";
import SprintReview from "./components/SprintReview";
import SprintExecution from "./components/SprintExecution";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
            <Routes>
            <Route path="/" element={<SimConfigList />} />
            <Route path="create" element={<CreateSimConfig />} />
            <Route path="simulation/:id" element={<SelectSimConfig />} />
            <Route path="simulation/:id/sprintplanning" element={<SprintPlanning />} />
            <Route path="simulation/:id/sprintplanning/editsimconfig" element={<EditSimConfig />} />
            <Route path="simulation/:id/sprintexecution/editsimconfig" element={<EditSimConfig />} />
            <Route path="simulation/:id/sprintexecution" element={<SprintExecution />} />
            <Route path="simulation/:id/sprintreview" element={<SprintReview />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}
export default App;