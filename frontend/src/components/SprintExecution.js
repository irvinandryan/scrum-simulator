import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const SprintExecution = () => {
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

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        try {
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
        }
        catch (error) {
            console.log(error);
            navigate("/*")
        }
    }

    const getCurrentSprint = () => {
        for (let i = 0; i < sprintBacklog.length; i++) {
            if (sprintBacklog[i].sprintBacklogItem.length === 0) {
                return (i-1);
            }
        }
        return (sprintBacklog.length-1);
    }

    const getTotalWorkHour = () => {
        let totalWorkHour = 0;
        for (let i = 0; i < sprintBacklog[getCurrentSprint()].sprintBacklogItem.length; i++) {
            totalWorkHour += sprintBacklog[getCurrentSprint()].sprintBacklogItem[i].sbHour;        
        }
        return totalWorkHour;
    }

    const getTotalScrumTeamWorkHour = () => {
        return (scrumTeamSize * scrumTeamHour * sprintLength);
    }

    const markItemDone = () => {
        let totalScrumTeamWorkHour = getTotalScrumTeamWorkHour();
        for (let i = 0; i < sprintBacklog[getCurrentSprint()].sprintBacklogItem.length; i++) {
            if ((sprintBacklog[getCurrentSprint()].sprintBacklogItem[i].isSbDone === false) && (totalScrumTeamWorkHour >= sprintBacklog[getCurrentSprint()].sprintBacklogItem[i].sbHour)) {
                sprintBacklog[getCurrentSprint()].sprintBacklogItem[i].isSbDone = true;
                totalScrumTeamWorkHour -= sprintBacklog[getCurrentSprint()].sprintBacklogItem[i].sbHour;
                setSprintBacklog(sprintBacklog);
            }
        }
        for (let i = 0; i < productBacklog.length; i++) {
            let isProductBacklogDone = true;
            let isExist = false;
            for (let j = 0; j < sprintBacklog[getCurrentSprint()].sprintBacklogItem.length; j++) {
                if (productBacklog[i].pbId === sprintBacklog[getCurrentSprint()].sprintBacklogItem[j].relatedPbId) {
                    isExist = true;
                    if (sprintBacklog[getCurrentSprint()].sprintBacklogItem[j].isSbDone === false) {
                        isProductBacklogDone = false;
                        break;
                    }
                }
            }
            if (isProductBacklogDone === true && isExist === true) {
                for (let k = 0; k < sprintBacklog[getCurrentSprint()].releaseBacklog.length; k++) {
                    if (sprintBacklog[getCurrentSprint()].releaseBacklog[k].rbId === productBacklog[i].pbId) {
                        alert(productBacklog[i].pbId)
                        productBacklog[i].isPbDone = true;
                        setProductBacklog(productBacklog);
                        sprintBacklog[getCurrentSprint()].releaseBacklog[k].isRbDone = true;
                        setSprintBacklog(sprintBacklog);
                        break;
                    }
                }
            }
        }
    }

    const handleSprintExecution = async () => {
        markItemDone();
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
            navigate(`/simulation/${id}/sprintreview`);
        } catch (error) {
            console.log(error);
        }

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
                <h2 className="subtitle has-text-centered"><strong>Sprint {getCurrentSprint()+1}</strong></h2>
                    <div className="columns mt-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Release Backlog ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint()].releaseBacklog.map((releaseBacklog) => (
                                        <tr>
                                            <td>{releaseBacklog.rbId}</td>
                                            <td>{releaseBacklog.isRbDone ? "Done" : "Not Done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="column is-two-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Sprint Backlog ID</th>
                                        <th>Hour Needed</th>
                                        <th>Related Product Backlog</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint()].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.sbHour}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.isSbDone ? "Done" : "Not Done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button type="submit" className="button is-fullwidth is-info" onClick={() => handleSprintExecution()}>
                                <strong>Execute</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SprintExecution;