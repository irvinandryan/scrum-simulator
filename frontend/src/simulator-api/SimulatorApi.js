import axios from "axios";

export const loginAPI = async (username, password, setError, navigate) => {
    try {
        await axios.post(process.env.REACT_APP_API + "/login", {
            username,
            password,
        }).then(response => {
            const token = response.data.token;
            localStorage.setItem("authToken", token);
            navigate(`/simconfigslist`);
        });
    } catch (error) {
        if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
        ) {
            setError(error.response.data.message);
            alert(error.response.data.message);
        }
    }
};

export const registerAPI = async (username, password, setError, navigate) => {
    try {
        await axios.post(process.env.REACT_APP_API + "/register", {
            username,
            password
        });
        alert("Account created successfully!");
        navigate(`/`);
    } catch (error) {
        if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
        ) {
            setError(error.response.data.message);
            alert(error.response.data.message);
        }
    }
};

export const saveSimConfigAPI = async (creator, scrumTeamSize, scrumTeamRate, scrumTeamHour, plannedCost, sprintLength, plannedSprint, productBacklog, sprintBacklog, startDate, eventProbability, navigate) => {
    const token = localStorage.getItem("authToken");
    try {
        await axios.post(process.env.REACT_APP_API + `/simconfigs`, {
            creator,
            scrumTeamSize,
            scrumTeamRate,
            scrumTeamHour,
            plannedCost,
            sprintLength,
            plannedSprint,
            productBacklog,
            sprintBacklog,
            startDate,
            eventProbability,
        }, {headers: {Authorization: `Bearer ${token}`}});
        navigate(`/simconfigslist`);
    } catch (error) {
        console.log(error);
    }
};

export const getSimConfigByIdAPI = async (id, setCreator, setScrumTeamSize, setScrumTeamRate, setScrumTeamHour, setPlannedCost, setSprintLength, setPlannedSprint, setProductBacklog, setSprintBacklog, setStartDate, setEventProbability, navigate) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(process.env.REACT_APP_API + `/simconfigs/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        setCreator(response.data.creator);
        setScrumTeamSize(response.data.scrumTeamSize);
        setScrumTeamRate(response.data.scrumTeamRate);
        setScrumTeamHour(response.data.scrumTeamHour);
        setPlannedCost(response.data.plannedCost);
        setSprintLength(response.data.sprintLength);
        setPlannedSprint(response.data.plannedSprint);
        setStartDate(response.data.startDate);
        setProductBacklog(response.data.productBacklog);
        setSprintBacklog(response.data.sprintBacklog);
        setEventProbability(response.data.eventProbability);
    }
    catch (error) {
        console.log(error);
        navigate("/*");
    }
};

export const getSimConfigAPI = async (setSimConfig) => {
    const token = localStorage.getItem("authToken");
    try {
        const response = await axios.get(process.env.REACT_APP_API + `/simconfigs`, {headers: {"Authorization": `Bearer ${token}`}})
        setSimConfig(response.data);
    } catch (error) {
        console.log(error);
    }
};

export const deleteSimConfigAPI = async (id, getSimConfig) => {
    const token = localStorage.getItem("authToken");
    try {
        await axios.delete(process.env.REACT_APP_API + `/simconfigs/${id}`, {headers: {"Authorization": `Bearer ${token}`}})
        getSimConfig();
    } catch (error) {
        console.log(error);
    }
};

export const updateSimConfigAPI = async (id, scrumTeamSize, scrumTeamRate, scrumTeamHour, plannedCost, sprintLength, plannedSprint, productBacklog, sprintBacklog, startDate, releaseBacklog, eventProbability, navigate) => {
    const token = localStorage.getItem("authToken");
    try {
        await axios.patch(process.env.REACT_APP_API + `/simconfigs/${id}`, {
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
            eventProbability,
        }, { headers: { "Authorization": `Bearer ${token}` } } );
    } catch (error) {
        console.log(error);
    }
};