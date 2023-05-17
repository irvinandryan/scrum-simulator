import React, { useState } from "react";
import { loginAPI } from "../../../simulator-api/SimulatorApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        loginAPI(username, password, setError, navigate);
    };

    const handleRegister = () => {
        navigate(`/register`);
    };

    window.onpopstate = function(event) {
        navigate(`/`);
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                <h1 className="title has-text-centered">Scrum Simulation</h1>
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <form onSubmit={handleLogin}>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Username</label>
                                    <input
                                        type="username"
                                        style={{width: "35%"}}
                                        className="input is-normal"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Password</label>
                                    <input
                                        type="password"
                                        style={{width: "35%"}}
                                        className="input is-normal"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="button is-success mt-5"><strong>Login</strong></button>
                            </form>
                            <div className="columns mt-5">
                                <div className="column is-one-half has-text-right">
                                    <h3 className="has-text-centered is-inline">Don't have an account?</h3>
                                </div>
                                <div className="column is-one-half has-text-left">
                                    <button className="button is-info is-small" onClick={handleRegister}>
                                        <strong>Create account</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
}

export default Login;