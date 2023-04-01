// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const CreateSimConfig = () => {
//     const [scrumTeamSize, setScrumTeamSize] = useState(0);
//     const [scrumTeamRate, setScrumTeamRate] = useState(0);
//     const [scrumTeamHour, setScrumTeamHour] = useState(0);
//     const [plannedCost, setPlannedCost] = useState(0);
//     const [sprintLength, setSprintLength] = useState(0);
//     const [plannedSprint, setPlannedSprint] = useState(0);
//     const [productbacklog, setProductbacklog] = useState([
//         {
//             pbId: String,
//             pbPoint: Number,
//         },
//     ]);
//     const addProductbacklog = () => {
//         setProductbacklog([
//             ...productbacklog,
//             {
//                 pbId: "",
//                 pbPoint: 0,
//             },
//         ]);
//     };
//     const removeProductbacklog = (index) => {
//         const list = [...productbacklog];
//         list.splice(index, 1);
//         setProductbacklog(list);
//     };
//     const handleProductbacklogChange = (e, index) => {
//         const { name, value } = e.target;
//         const list = [...productbacklog];
//         list[index][name] = value;
//         setProductbacklog(list);
//     };
//     const navigate = useNavigate();
//     const saveSimConfig = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost:5000/simConfigs", {
//                 scrumTeamSize,
//                 scrumTeamRate,
//                 scrumTeamHour,
//                 plannedCost,
//                 sprintLength,
//                 plannedSprint,
//             });
//             navigate("/");
//           } catch (error) {
//             console.log(error);
//           }
//     };

//     return (
//         <div className="columns is-centered is-vcentered has-text-centered has-background-success-light mt-5">
//             <div className="column is-one-third mr-2">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-sm-8">
//                             {
//                                 productbacklog.map((data, index)=>{
//                                     const {pbId, pbPoint} = data;
//                                     return(
//                                         <div className="row my-3" key={index}>
//                                             <div className="col">
//                                                 <div className="form-group">
//                                                     <input 
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={pbId}
//                                                         placeholder="Product Backlog ID"
//                                                         onChange={(evnt)=>handleProductbacklogChange(index, evnt)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="col">
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="number"
//                                                         className="form-control"
//                                                         value={pbPoint}
//                                                         onChange={(evnt)=>handleProductbacklogChange(index, evnt)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="col">
//                                                 {(productbacklog.length!==1)? <button className="btn btn-outline-danger" onClick={removeProductbacklog}>Remove</button>:''}
//                                             </div>
//                                         </div>
//                                     )
//                                 })
//                             }
//                             <div className="row">
//                                 <div className="col-sm-12">
//                                     <button className="btn btn-outline-success " onClick={addProductbacklog}>Add New</button>
//                                 </div>
//                             </div>
//                         </div>
//                         </div>
//                         <div className="col-sm-4">
//                     </div>
//                 </div>
//             </div>

//             <div className="column is-one-third ml-2">
//             <h1 className="has-text-centered subtitle">New Configuration</h1>
//                 <form onSubmit={saveSimConfig}>
//                     <div className="form-group mt-2">
//                         <label>Scrum Team Size</label>
//                         <input
//                             type="number"
//                             min="1" 
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamSize}
//                             onChange={(e) => setScrumTeamSize(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Rate per Hour</label>
//                         <input
//                             type="number"
//                             min="0" 
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamRate}
//                             onChange={(e) => setScrumTeamRate(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Work Hours per Day</label>
//                         <input
//                             type="number"
//                             min="0"
//                             max="24"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamHour}
//                             onChange={(e) => setScrumTeamHour(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Planned Cost</label>
//                         <input
//                             type="number"
//                             min="0"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={plannedCost}
//                             onChange={(e) => setPlannedCost(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Days per Sprint</label>
//                         <input
//                             type="number"
//                             min="1"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={sprintLength}
//                             onChange={(e) => setSprintLength(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Planned Sprint</label>
//                         <input
//                             type="number"
//                             min="1"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={plannedSprint}
//                             onChange={(e) => setPlannedSprint(e.target.value)}
//                         />
//                     </div>
//                     <Link to={`/`}  className="button is-danger mt-4 mr-4">
//                         Back
//                     </Link>
//                     <button type="submit" className="button is-success mt-4">
//                         Save
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateSimConfig;



// return (
//     <div className="columns is-centered is-vcentered has-text-centered has-background-success-light mt-5">
//         <form onSubmit={saveSimConfig}>
//             <div className="column is-one-third mr-2">
//                 {productbacklog.map((form, index) => {
//                     return (
//                         <div key={index}>
//                             <input
//                                 type="string"
//                                 onChange={(e) => handleProductbacklog(e, index)}
//                                 value={form.pbId}
//                             />
//                             <input
//                                 type="number"
//                                 onChange={(e) => handleProductbacklog(e, index)}
//                                 value={form.pbPoint}
//                             />
//                             <button onClick={() => removeProductbacklog(index)}>Remove</button>
//                         </div>
//                     );
//                 })}
//                 <button onClick={addProductbacklog}>Add</button>
//             </div>

//             <div className="column is-one-third ml-2">
//             <h1 className="has-text-centered subtitle">New Configuration</h1>
//                 {/* <form onSubmit={saveSimConfig}> */}
//                     <div className="form-group mt-2">
//                         <label>Scrum Team Size</label>
//                         <input
//                             type="number"
//                             min="1" 
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamSize}
//                             onChange={(e) => setScrumTeamSize(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Rate per Hour</label>
//                         <input
//                             type="number"
//                             min="0" 
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamRate}
//                             onChange={(e) => setScrumTeamRate(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Work Hours per Day</label>
//                         <input
//                             type="number"
//                             min="0"
//                             max="24"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={scrumTeamHour}
//                             onChange={(e) => setScrumTeamHour(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Planned Cost</label>
//                         <input
//                             type="number"
//                             min="0"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={plannedCost}
//                             onChange={(e) => setPlannedCost(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Days per Sprint</label>
//                         <input
//                             type="number"
//                             min="1"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={sprintLength}
//                             onChange={(e) => setSprintLength(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group mt-2">
//                         <label>Planned Sprint</label>
//                         <input
//                             type="number"
//                             min="1"
//                             oninput="validity.valid||(value='')"
//                             className="input is-small"
//                             value={plannedSprint}
//                             onChange={(e) => setPlannedSprint(e.target.value)}
//                         />
//                     </div>
//                     <Link to={`/`}  className="button is-danger mt-4 mr-4">
//                         Back
//                     </Link>
//                     <button type="submit" className="button is-success mt-4">
//                         Save
//                     </button>
//                 {/* </form> */}
//             </div>
//         </form>
//     </div>
// );