import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  //state
  const [inputs, setInputs] = useState({
    name: "",
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
    axios.post("http://localhost:5000/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
      }).then((res) => {
        setInputs("");
        toast.success(res.data.message, {
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
        navigate("/login");
      }).catch((err) => {
        toast.error(err.response.data.message, {
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
      <form onSubmit={handleSubmit}>
      <div>
        <h1>Register</h1>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={inputs.name}
          />
        </div>
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
            onClick={() => navigate("/login")}
          >
            Already Registerd ? Please Login
          </Button>
      </form>

      <ToastContainer />
    </>
  );
};

export default Register;