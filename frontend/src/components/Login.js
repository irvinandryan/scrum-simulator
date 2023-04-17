import React, { useState } from "react";
import axios from "axios";
import { Router, useNavigate, useParams } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API + "/login", {
                username,
                password,
            });
            localStorage.setItem("authToken", username.token);
            navigate(`/simconfigslist`);
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

    const handleRegister = () => {
        navigate(`/register`);
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
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
                            <button className="button is-info is-small mt-5" onClick={handleRegister}>
                                <strong>Create account</strong>
                            </button>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
}

export default Login;