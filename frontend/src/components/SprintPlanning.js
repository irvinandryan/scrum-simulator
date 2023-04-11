import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const SprintPlanning = () => {
    const { id } = useParams();
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

    const [sprintBacklogItem, setSprintBacklogItem] = useState([
        {
            sbId: String,
            sbHour: Number,
            relatedPbId: String,
            isSbDone: false,
        },
    ]);

    const [releaseBacklog, setReleaseBacklog] = useState([
        {
            rbId: String,
            isRbDone: false,
        },
    ]);

    const [sprintBacklog, setSprintBacklog] = useState([
        {
            sprintId: String,
            releaseBacklog: [releaseBacklog],
            sprintBacklogItem: [sprintBacklogItem],
        },
    ]);

    const getSimConfigById = async () => {
        const response = await axios.get(`http://localhost:5000/simConfigs/${id}`);
        setScrumTeamSize(response.data.scrumTeamSize);
        setScrumTeamRate(response.data.scrumTeamRate);
        setScrumTeamHour(response.data.scrumTeamHour);
        setPlannedCost(response.data.plannedCost);
        setSprintLength(response.data.sprintLength);
        setPlannedSprint(response.data.plannedSprint);
        setStartDate(response.data.startDate);
        setProductBacklog(response.data.productBacklog);
        setSprintBacklog(response.data.sprintBacklog);
    };

    const getCurrentSprint = () => {
        for (let i = 0; i < sprintBacklog.length; i++) {
            if (sprintBacklog[i].sprintBacklogItem.length === 0) {
                return i;
            }
        }
    };

    const updateSimConfig = async (e) => {
        e.preventDefault();
        let sum = 0;
        sprintBacklogItem.forEach((item) => {
            sum += parseInt(item.sbHour);
        });
        if (sum > (scrumTeamSize * scrumTeamHour * sprintLength)) {
            alert("Total hours of sprint backlog items cannot be greater than total work hours per sprint");
            return;
        }

        for (let i = 0; i < sprintBacklog.length; i++) {
            if (sprintBacklog[i].sprintBacklogItem.length === 0) {
                sprintBacklog[i].sprintBacklogItem = sprintBacklogItem;
                sprintBacklog[i].releaseBacklog = releaseBacklog;
                setReleaseBacklog(releaseBacklog);
                setSprintBacklog(sprintBacklog);
                break;
            }
        }

        try {
            await axios.patch(`http://localhost:5000/simConfigs/${id}`, {
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                startDate,
                productBacklog,
                sprintBacklog,
                releaseBacklog,
            });
            navigate(`/simulation/${id}/sprintexecution`);
            // navigate(`/selectsimconfig/${id}/simulation`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSimConfigById();
    }, []);
        
    const addSprintBacklogItem = () => {
        let object = {
            sbId: String,
            sbHour: Number,
            relatedPbId: String,
            isSbDone: false,
        };
        setSprintBacklogItem([...sprintBacklogItem, object]);
    };

    const handleSprintBacklogItem = (e, index) => {
        let data = [...sprintBacklogItem];
        data[index][e.target.name] = e.target.value;
        setSprintBacklogItem(data);
    };

    const removeSprintBacklogItem = (index) => {
        let data = [...sprintBacklogItem];
        data.splice(index, 1);
        setSprintBacklogItem(data);
    };

    const addReleaseBacklog = () => {
        let object = {
            rbId: String,
            isRbDone: false,
        };
        setReleaseBacklog([...releaseBacklog, object]);
    };

    const handleReleaseBacklog = (e) => {
        setReleaseBacklog(e);
    };        

    return (
        <div className="hero is-fullheight">
            <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-start ml-2">
                        <h3 className="navbar-item">
                            Team Size: {scrumTeamSize}
                        </h3>
                        <h3 className="navbar-item">
                            Rate / Hour: {scrumTeamRate}
                        </h3>
                        <h3 className="navbar-item">
                            Work Hour / Day: {scrumTeamHour}
                        </h3>
                        <h3 className="navbar-item">
                            Planned Cost: {plannedCost}
                        </h3>
                        <h3 className="navbar-item">
                            Num of Sprint: {plannedSprint}
                        </h3>
                        <h3 className="navbar-item">
                            Days per Sprint: {sprintLength}
                        </h3>
                        <h3 className="navbar-item">
                            Start Date: {startDate.split('T')[0]}
                        </h3>
                    </div>
                    <div className="navbar-end mr-2">
                        <div className="navbar-item">
                            <button
                                onClick={() => navigate(`editsimconfig`)}
                                className="button has-background-grey-lighter is-small">
                                <strong>Edit</strong>
                            </button>
                        </div>
                        <div className="navbar-item">
                            <button
                                onClick={() => navigate("/")}
                                className="button is-danger is-small">
                                <strong>Exit Simulation</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="hero-body">
                <div className="container">
                <h2 className="subtitle has-text-centered">Sprint Planning {getCurrentSprint() + 1}</h2>
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <div className="form-group">
                                <form onSubmit={updateSimConfig}>
                                    <h3 className="subtitle has-text-centered">Release Backlog</h3>
                                    <div className="form-group mt-2 mb-5">
                                        <Select
                                            name="rbId"
                                            required
                                            placeholder="Select Release Backlog"
                                            isMulti
                                            options={productBacklog.map((pb) => {
                                                return (
                                                    {value: pb.pbId, label: pb.pbId}
                                                );
                                            })}
                                            className="basic-multi-select"
                                            onChange={(e) => handleReleaseBacklog(e.map((rb) => {
                                                return (
                                                    {
                                                        rbId: rb.value,
                                                        isRbDone: false
                                                    }
                                                );
                                            }))}
                                        />
                                    </div>
                                    <h3 className="subtitle has-text-centered">Sprint Backlog</h3>
                                    {sprintBacklogItem.map((form,index) => {
                                        return (
                                            <div className="form-group mt-2">
                                                <input 
                                                    readOnly
                                                    size={5}
                                                    className="input is-static has-text-centered is-small is-inline mb-1"
                                                    name="sbId"
                                                    value={form.sbId=`SB-${index + 1}`}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}
                                                />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    oninput="validity.valid||(value='')"
                                                    className="input is-small is-inline mr-1 ml-1 mb-1"
                                                    name="sbHour"
                                                    placeholder="Hour Needed"
                                                    value={form.sbHour}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}
                                                />
                                                <select
                                                    className="select is-small is-inline mr-1 ml-1 mb-1"
                                                    name="relatedPbId"
                                                    value={form.relatedPbId}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}>
                                                    <option value="" disabled>
                                                        Related Product Backlog
                                                    </option>
                                                    {productBacklog.map((pb) => {
                                                        return (
                                                            <option value={pb.pbId}>
                                                                {pb.pbId}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                {(sprintBacklogItem.length!==1)?
                                                    <button
                                                        onClick={() => removeSprintBacklogItem(index)}
                                                        className="button is-danger is-inline is-small mb-1">
                                                        Delete
                                                    </button>:''
                                                }
                                            </div>
                                        )
                                    })}
                                    <input
                                        readOnly
                                        size={8}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHourLabel"
                                        placeholder="Total Hour"
                                        value={"Total Hour"}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={4}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHour"
                                        min="0"
                                        max={parseInt(scrumTeamSize * scrumTeamHour * sprintLength)}
                                        value={sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbHour),0)}
                                        required
                                    />
                                    <button
                                        onClick={() =>
                                            addSprintBacklogItem()
                                        }
                                        className="button is-info is-small mr-1 ml-1 mb-1 mt-2">
                                        Add Sprint Backlog
                                    </button>
                                    <div>
                                        <button type="submit" className="button is-fullwidth is-info mt-4">
                                            <strong>Continue</strong>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button to={`simulation`} className="button is-info is-fullwidth">
                                <strong>Next</strong>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default SprintPlanning;