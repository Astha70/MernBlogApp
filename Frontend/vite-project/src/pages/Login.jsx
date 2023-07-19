import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer }from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  //state
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  //handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //form handle
  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = {
      email,
      password,
    };
      axios.post("http://localhost:5000/login", requestBody).then((res) => {
        setInputs("");
        toast.success(res.data.message,  {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const token = res.data.token;
        localStorage.setItem("token", token);

        navigate("/");
      }).catch((err) => {
        toast.error(err.response.message , {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })

   
  };
  return (
    <>
    <h1>Login</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={inputs.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={inputs.password}
          />
        </div>

        <button type="submit">Submit</button>
        <Button
            onClick={() => navigate("/register")}
          >
            Not a user ? Please Register
          </Button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Login;