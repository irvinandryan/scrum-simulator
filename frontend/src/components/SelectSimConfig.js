import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const SelectSimConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    // const [productBacklog, setProductBacklog] = useState([]);
    // const [sprintBacklog, setSprintBacklog] = useState([]);

    useEffect(() => {
        getSimConfigById();
    }, []);

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
            navigate("/*");
        }
    };

    const getCurrentSprint = () => {
        for (let i = 0; i < sprintBacklog.length; i++) {
            if (sprintBacklog[i].sprintBacklogItem.length === 0) {
                return (i-1);
            }
        }
        return (sprintBacklog.length-1);
    }

    const isAllPbDone = () => {
        for (let i = 0; i < productBacklog.length; i++) {
            if (productBacklog[i].isPbDone === false) {
                return false;
            }
        }
        return true;
    }

    const handleContinue = () => {
        if ((getCurrentSprint() === parseInt(sprintBacklog.length - 1)) || isAllPbDone()) {
            alert("This simulation has been completed.");
            navigate(`/simulation/${id}/sprintreview`);
        } else {
            navigate(`/simulation/${id}/sprintplanning`);
        }
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                {/* <h2 className="subtitle has-text-centered">Selected</h2> */}
                    <div className="columns mt-5 has-background-white-ter">
                        <div className="column is-one-half has-text-centered">
                            <div className="column is-one-half has-text-centered">
                                <h2 className="subtitle">Scrum Team Size: {scrumTeamSize}</h2>
                                <h2 className="subtitle">Rate / Hour: {scrumTeamRate}</h2>
                                <h2 className="subtitle">Work Hour / Day: {scrumTeamHour}</h2>
                                <h2 className="subtitle">Planned Cost: {plannedCost}</h2>
                                <h2 className="subtitle">Sprint Length: {sprintLength}</h2>
                                <h2 className="subtitle">Days per Sprint: {plannedSprint}</h2>
                                <h2 className="subtitle">Start Date: {startDate.split('T')[0]}</h2>
                            </div>
                        </div>
                        <div className="column is-one-half">
                            <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Story Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((pb) => (
                                        <tr>
                                            <td>{pb.pbId}</td>
                                            <td>{pb.pbPoint}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <Link to={`/`}  className="button is-danger is-fullwidth">
                                <strong>Cancel</strong>
                            </Link>
                        </div>
                        <div className="column is-one-half has-text-centered">
                            {/* <Link to={`sprintplanning`} className="button is-info is-fullwidth">
                                <strong>Continue</strong>
                            </Link> */}
                            <button className="button is-info is-fullwidth" onClick={handleContinue}>
                                <strong>Continue</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSimConfig;