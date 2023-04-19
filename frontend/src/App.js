import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SimConfigList from "./components/SimConfigList";
import CreateSimConfig from "./components/CreateSimConfig";
import SelectSimConfig from "./components/SelectSimConfig";
import SprintPlanning from "./components/SprintPlanning"
import EditSimConfig from "./components/EditSimConfig";
import SprintReview from "./components/SprintReview";
import SprintExecution from "./components/SprintExecution";
import NotFound from "./components/NotFound";
import Summary from "./components/Summary";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="simconfigslist" element={<SimConfigList />} />
            <Route path="simconfigslist/create" element={<CreateSimConfig />} />
            <Route path="simconfigslist/simulation/:id" element={<SelectSimConfig />} />
            <Route path="simconfigslist/simulation/:id/sprintplanning" element={<SprintPlanning />} />
            <Route path="simconfigslist/simulation/:id/sprintplanning/editsimconfig" element={<EditSimConfig />} />
            <Route path="simconfigslist/simulation/:id/sprintexecution/editsimconfig" element={<EditSimConfig />} />
            <Route path="simconfigslist/simulation/:id/sprintexecution" element={<SprintExecution />} />
            <Route path="simconfigslist/simulation/:id/sprintreview" element={<SprintReview />} />
            <Route path="simconfigslist/simulation/:id/summary" element={<Summary />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}
export default App;