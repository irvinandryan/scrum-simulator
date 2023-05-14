import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./simulator-interface/containers/Login";
import Register from "./simulator-interface/containers/Register";
import SimConfigList from "./simulator-interface/containers/SimConfigList";
import CreateSimConfig from "./simulator-interface/containers/CreateSimConfig";
import SelectSimConfig from "./simulator-interface/containers/SelectSimConfig";
import SprintPlanning from "./simulator-interface/containers/SprintPlanning"
import SprintReview from "./simulator-interface/containers/SprintReview";
import SprintExecution from "./simulator-interface/containers/SprintExecution";
import NotFound from "./simulator-interface/containers/NotFound";
import Summary from "./simulator-interface/containers/Summary";

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