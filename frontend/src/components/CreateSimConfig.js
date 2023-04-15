import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateSimConfig = () => {
    const navigate = useNavigate();
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");

    const [productBacklog, setProductBacklog] = useState([
        {
            pbId: String,
            pbPoint: Number,
            isPbDone: false,
        },
    ]);

    const [sprintBacklog, setSprintBacklog] = useState([
        {
            sprintId: String,
            releaseBacklog: [
                {
                    rbId: String,
                    isRbDone: false,
                },
            ],
            sprintBacklogItem: [
                {
                    sbId: String,
                    sbHour: Number,
                    relatedPbId: String,
                    isSbDone: false,
                },
            ],
        },
    ]);

    const addProductbacklog = () => {
        let object = {
            pbId: "",
            pbPoint: "Story Point",
            isPbDone: false,
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

    const saveSimConfig = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API + "/simConfigs", {
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                productBacklog,
                sprintBacklog,
                startDate,
            });
            navigate("/");
          } catch (error) {
            console.log(error);
          }
    };

    const generateSprintBacklog = (plannedSprint) => {
        let sprintBacklog = [];
        for (let i = 0; i < plannedSprint; i++) {
            let sprintBacklogItem = {
                sprintId: i.toString(),
                sprintBacklog: [],
                sprintCost: 0,
                isSprintDone: false,
            };
            sprintBacklog.push(sprintBacklogItem);
        }
        return sprintBacklog;
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns mt-5 has-text-centered has-background-white-ter">
                        <div className="column is-one-half ml-2">
                            <h1 className="has-text-centered subtitle">New Configuration</h1>
                            <form onSubmit={saveSimConfig}>
                                {productBacklog.map((form,index) => {
                                    return (
                                        <div className="form-group mt-2">
                                            <input 
                                                readOnly
                                                size={5}
                                                className="input is-static has-text-centered is-small is-inline mb-1"
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
                                                    type="button"
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
                                        min="1"
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
                                        onChange={(e) => {setPlannedSprint(e.target.value); setSprintBacklog(generateSprintBacklog(e.target.value))}}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <DatePicker
                                        popperPlacement="auto"
                                        placeholderText="Select start date"
                                        className="react-datepicker"
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDate}
                                        onChange={(startDate) => new Date(setStartDate((startDate - (startDate.getTimezoneOffset() * 60000))))}
                                        required
                                    />
                                </div>
                                <Link to={`/`}  className="button is-danger mt-4 mr-4">
                                    <strong>Back</strong>
                                </Link>
                                <button type="submit" className="button is-success mt-4">
                                    <strong>Save</strong>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSimConfig;