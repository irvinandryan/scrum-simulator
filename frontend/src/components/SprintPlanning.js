import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getCurrentSprint, getMaxScrumTeamWorkHour, getRemainingCost, getTotalSpending } from "../utils/Utils.js";
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex } from "../utils/AgileEVM.js";

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

    const [notDoneProductBacklog, setNotDoneProductBacklog] = useState([
        {
            pbId: String,
            pbPoint: Number,
            isPbDone: false,
        },
    ]);

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
            sprintCost: Number,
            isSprintDone: false,
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/simConfigs/${id}`);
            setScrumTeamSize(response.data.scrumTeamSize);
            setScrumTeamRate(response.data.scrumTeamRate);
            setScrumTeamHour(response.data.scrumTeamHour);
            setPlannedCost(response.data.plannedCost);
            setSprintLength(response.data.sprintLength);
            setPlannedSprint(response.data.plannedSprint);
            setStartDate(response.data.startDate);
            setProductBacklog(response.data.productBacklog);
            setSprintBacklog(response.data.sprintBacklog);
            setNotDoneProductBacklog(response.data.productBacklog.filter((pb) => pb.isPbDone === false))
        }
        catch (error) {
            console.log(error);
            navigate("/*");
        }
    };

    const updateSimConfig = async (e) => {
        e.preventDefault();
        let sum = 0;
        sprintBacklogItem.forEach((item) => {
            sum += parseInt(item.sbHour);
        });
        if (sum > (scrumTeamSize * scrumTeamHour * sprintLength)) {
            alert("Total work hours of sprint backlog items cannot be greater than total work hours per sprint");
            return;
        }
        if ((plannedCost - getTotalSpending(sprintBacklog)) < (sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbHour),0) * scrumTeamRate)) {
            alert("Total spending cannot be greater than remaining cost");
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
            await axios.patch(process.env.REACT_APP_API + `/simConfigs/${id}`, {
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
        } catch (error) {
            console.log(error);
        }
    };
        
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

    const handleReleaseBacklog = (e) => {
        setReleaseBacklog(e);
    };

    return (
        <div className="hero is-fullheight">
            <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-start ml-2">
                        <h3 className="navbar-item">
                            Team size: {scrumTeamSize}
                        </h3>
                        <h3 className="navbar-item">
                            Rate / hour: {scrumTeamRate}
                        </h3>
                        <h3 className="navbar-item">
                            Work hour / day: {scrumTeamHour}
                        </h3>
                        <h3 className="navbar-item">
                            Planned cost: {plannedCost}
                        </h3>
                        <h3 className="navbar-item">
                            Num of sprint: {plannedSprint}
                        </h3>
                        <h3 className="navbar-item">
                            Days per sprint: {sprintLength}
                        </h3>
                        <h3 className="navbar-item">
                            Start date: {startDate.split('T')[0]}
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
                                <strong>Exit simulation</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container mt-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint Planning {getCurrentSprint(sprintBacklog) + 1}</strong></h2>
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <div className="form-group">
                                <form onSubmit={updateSimConfig}>
                                    <h3 className="subtitle has-text-centered">Release Backlog</h3>
                                    <div className="form-group mt-2 mb-5">
                                        <Select
                                            name="rbId"
                                            required
                                            placeholder="Select release backlog"
                                            isMulti
                                            options={notDoneProductBacklog.map((pb) => {
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
                                                    placeholder="Hour needed"
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
                                                        Related product backlog
                                                    </option>
                                                    {notDoneProductBacklog.map((pb) => {
                                                        return (
                                                            <option value={pb.pbId}>
                                                                {pb.pbId}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                {(sprintBacklogItem.length!==1)?
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSprintBacklogItem(index)}
                                                        className="button is-danger is-inline is-small mb-1">
                                                        <strong>Delete</strong>
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
                                        placeholder="Total hour"
                                        value={"Total hour"}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={4}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHour"
                                        min="0"
                                        max={getMaxScrumTeamWorkHour(scrumTeamSize, scrumTeamHour, sprintLength)}
                                        value={sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbHour),0)}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={8}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalCostLabel"
                                        placeholder="Total cost"
                                        value={"Total cost"}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={7}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHour"
                                        min="0"
                                        max={plannedCost - getTotalSpending(sprintBacklog)}
                                        value={sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbHour),0) * scrumTeamRate}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addSprintBacklogItem()
                                        }
                                        className="button is-info is-small mr-1 ml-1 mb-1 mt-2">
                                        <strong>Add sprint backlog</strong>
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
                </div>
            </div>
            <nav className="navbar is-fixed-bottom has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-brand m-auto">
                        <h3 className="navbar-item">
                            CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(5)}-{getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                        </h3>
                        <h3 className="navbar-item">
                            SPI: {(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(5)}-{getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                        </h3>
                        <h3 className="navbar-item">
                            Release Date: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength)}
                        </h3>
                        <h3 className="navbar-item">
                            Remaining Cash: {getRemainingCost(plannedCost, sprintBacklog)}
                        </h3>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default SprintPlanning;