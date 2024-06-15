import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function LogIn() {
  const { user, setuser } = useContext(AuthContext);
  /*
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const LOWERCASE = /[a-z]/;
  const UPPERCASE = /[A-Z]/;
  const NUMBER = /[0-9]/;
  const CHARACTER = /[!@#$%]/;
  const LENGTH = /.{8,24}$/;
  */

  //const EMAIL_REGEX =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
  //const [validEmail, setValidEmail] = useState(true);
  const [email, setUser] = useState("");
  const [loginError, setLoginError] = useState("");

  //const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //*********handles the user login***********
  async function handleLogin(event) {
    console.log("handaling login");

    event.preventDefault();
    const usernames = event.target[0].value;
    const passwords = event.target[1].value;

    const account = {
      username: usernames,
      password: passwords,
    };

    const response = await fetch("/logIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });

    const res = await response.json();
    const exist = res.exist;
    const match = res.match;
    if (exist && match) {
      setuser(email);
      navigate("/pic");
    } else if (!exist && match) {
      setLoginError("DNE");
    } else {
      setLoginError("MissMatch");
    }
  }

  const temp = () => {
    navigate("/pic");
  };
  return (
    <>
      <button onClick={temp}>pic</button>
      <div id="logIn">
        <form
          className="modal-content"
          onSubmit={(event) => {
            handleLogin(event);
            console.log("submits");
          }}
        >
          <div id="Container">
            <h1>Log In</h1>
            <p>Please fill in this form to log in.</p>
            <hr></hr>

            <label hlmtfor="email">
              <b>Email</b>
            </label>

            <input
              className="username"
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              onChange={(e) => setUser(e.target.value)}
              //aria-invalid={validEmail ? "false" : "true"}
            ></input>
            <p className={loginError === "DNE" ? "instructions" : "offscreen"}>
              This email is not linked to an account.
            </p>
            <label hlmtfor="password">
              {" "}
              <b>Password</b>
            </label>
            <input
              className="password"
              type="password"
              placeholder="Enter Password"
              name="password"
              required
            ></input>
            <p
              className={
                loginError === "MissMatch" ? "instructions" : "offscreen"
              }
            >
              Incorrect Password.
            </p>

            <button type="submit" className="submit">
              Log In
            </button>

            <div id="text">
              <p> Dont have an account? </p>
              <p className="re-direct" onClick={() => navigate("/SignIn")}>
                {" "}
                Sign Up{" "}
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LogIn;
