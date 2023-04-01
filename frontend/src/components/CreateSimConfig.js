import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CreateSimConfig = () => {
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [productBacklog, setProductBacklog] = useState([
        {
            pbId: String,
            pbPoint: Number,
        },
    ]);
    const addProductbacklog = () => {
        let object = {
            pbId: "",
            pbPoint: "Story Point",
        }
        setProductBacklog([...productBacklog, object]);
    };
    const removeProductbacklog = (index) => {
        let data = [...productBacklog];
        data.splice(index, 1);
        setProductBacklog(data);
    };
    const handleProductbacklog = (e, index) => {
        let data = [...productBacklog];
        data[index][e.target.name] = e.target.value;
        setProductBacklog(data);
    };
    const navigate = useNavigate();
    const saveSimConfig = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/simConfigs", {
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                productBacklog,
            });
            navigate("/");
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <div className="columns is-centered is-vcentered has-text-centered has-background-success-light mt-5">
            <div className="column is-one-half ml-2">
                <h1 className="has-text-centered subtitle">New Configuration</h1>
                <form onSubmit={saveSimConfig}>
                    {productBacklog.map((form,index) => {
                        return (
                            <div className="form-group mt-2">
                                <input 
                                    readOnly
                                    className="input is-small is-inline mb-1"
                                    name="pbId"
                                    value={form.pbId=`PB-${index + 1}`}
                                    required
                                    onChange={(e) => handleProductbacklog(e, index)}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    oninput="validity.valid||(value='')"
                                    className="input is-small is-inline mr-1 ml-1 mb-1"
                                    name="pbPoint"
                                    placeholder="Story Point"
                                    value={form.pbPoint}
                                    required
                                    onChange={(e) => handleProductbacklog(e, index)}
                                />
                                {(productBacklog.length!==1)?
                                    <button
                                        onClick={() => removeProductbacklog(index)}
                                        className="button is-danger is-inline is-small mb-1">
                                        Delete
                                    </button>:''
                                }
                            </div>
                        )
                    })}
                    <button
                        onClick={() => 
                            addProductbacklog()
                        }
                        className="button is-info is-small mt-2">
                        Add Product Backlog
                    </button>
                    <div className="form-group mt-2">
                        <input
                            type="number"
                            min="1" 
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline mr-1"
                            placeholder="Scrum Team Size"
                            value={scrumTeamSize}
                            onChange={(e) => setScrumTeamSize(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            min="0"
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline ml-1"
                            placeholder="Rate per Hour"
                            value={scrumTeamRate}
                            onChange={(e) => setScrumTeamRate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mt-2">
                        <input
                            type="number"
                            min="0"
                            max="24"
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline mr-1"
                            placeholder="Work Hours per Day"
                            value={scrumTeamHour}
                            onChange={(e) => setScrumTeamHour(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            min="0"
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline ml-1"
                            placeholder="Planned Cost"
                            value={plannedCost}
                            onChange={(e) => setPlannedCost(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mt-2">
                        <input
                            type="number"
                            min="1"
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline mr-1"
                            placeholder="Days per Sprint"
                            value={sprintLength}
                            onChange={(e) => setSprintLength(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            min="1"
                            style={{width: "170px"}}
                            oninput="validity.valid||(value='')"
                            className="input is-small is-inline ml-1"
                            placeholder="Planned Sprint"
                            value={plannedSprint}
                            onChange={(e) => setPlannedSprint(e.target.value)}
                            required
                        />
                    </div>
                    <Link to={`/`}  className="button is-danger mt-4 mr-4">
                        Back
                    </Link>
                    <button type="submit" className="button is-success mt-4">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSimConfig;