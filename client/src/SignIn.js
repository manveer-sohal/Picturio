import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const LOWERCASE = /[a-z]/;
  const UPPERCASE = /[A-Z]/;
  const NUMBER = /[0-9]/;
  const CHARACTER = /[!@#$%]/;
  const LENGTH = /.{8,24}$/;

  const EMAIL_REGEX =
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
  //logIn signUp verify
  const [visible, setVisible] = useState("signUp");
  const [validEmail, setValidEmail] = useState(true);
  const [emailError, setEmailError] = useState("offscreen");

  const [user, setUser] = useState("");

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [validLowerCase, setValidLowerCase] = useState(false);
  const [validUpperCase, setValidUpperCase] = useState(false);
  const [validCharacter, setValidCharacter] = useState(false);
  const [validNumber, setValidNumber] = useState(false);
  const [validLength, setValidLength] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatchPassword, setValidMatchPassword] = useState(false);

  const [code, setCode] = useState({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
  });
  const [generatedCode, setGeneratedCode] = useState("");

  const naviagte = useNavigate();
  useEffect(() => {
    const fullCode = Object.values(code).join("");
    if (fullCode.length === 5) {
      // Perform code validation here with 'fullCode'
      console.log("Submitted code:", fullCode);
      if (fullCode === generatedCode) {
        console.log("verified");

        naviagte("/pic");
      }
    }
  }, [code, generatedCode, naviagte]);

  useEffect(() => {
    console.log("ge", generatedCode);
  }, [generatedCode]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(user);
    setValidEmail(result);
  }, [user]);

  function validPasswordSet() {
    setValidLowerCase(LOWERCASE.test(password));
    setValidUpperCase(UPPERCASE.test(password));
    setValidNumber(NUMBER.test(password));
    setValidCharacter(CHARACTER.test(password));
    setValidLength(LENGTH.test(password));
  }
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    validPasswordSet(result);
    console.log(user);

    console.log("valid email", validEmail);

    if (!result) {
      setValidPassword();
    }

    const match = password === matchPassword;
    setValidMatchPassword(match);
  }, [password, matchPassword]);

  async function generateCode() {
    const min = 1;
    const max = 9;
    let randomCode = "";
    for (var i = 0; i < 5; i++) {
      let rand = Math.floor(min + Math.random() * (max - min + 1));
      randomCode = randomCode + rand;
    }
    setGeneratedCode(randomCode);
    return randomCode;
  }
  //********handles the user signin*********

  async function handleSignup(event) {
    let randomCode = await generateCode();

    event.preventDefault();
    const usernames = event.target[0].value;
    const passwords = event.target[1].value;

    const account = {
      username: usernames,
      password: passwords,
    };

    const data = {
      code: randomCode,
      account_info: account,
    };

    const response = await fetch("/singUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (res.exist === true) {
      console.log("duplicate");
      setEmailError("duplicate");
    } else if (res.exist === false) {
      setVisible("verify");
    } else {
      console.log("the response for function handleSignup is messed up");
    }
  }

  /*
  async function verifed() {
    const account = {
      username: user,
      password: password,
    };
    const response = await fetch("/verified", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
  }
  */
  const digits = document.querySelectorAll(".digit");

  ///**** incremntes or decrements the input code feild */
  const verifyForm = document.getElementById("verify-form");

  digits.forEach((input, index) => {
    input.addEventListener("input", function () {
      if (this.value.length >= 1 && index < digits.length - 1) {
        digits[index + 1].focus();
      }
    });

    input.addEventListener("keydown", function (event) {
      const BACKSPACE_KEY_CODE = 8;
      if (
        event.keyCode === BACKSPACE_KEY_CODE &&
        this.value.length === 0 &&
        index > 0
      ) {
        digits[index - 1].focus();
      }
    });
  });
  ///*******************************/

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCode((prevCode) => ({
      ...prevCode,
      [name]: value,
    }));
  };

  return (
    <>
      <div
        id="verify"
        style={{ display: visible === "verify" ? "block" : "none" }}
      >
        <form className="modal-content" id="verify-form">
          <div id="verify-container">
            <h
              className="text"
              style={{ fontSize: "30px", fontWeight: "bold" }}
              ß
            >
              Verify your email address
            </h>
            <p className="text" tyle={{ fontSize: "2px" }}>
              We emailed a five-digit code to{" "}
              <span className="text" style={{ fontStyle: "italic" }}>
                {user}
              </span>
              . Enter the code below to confirm your email address.
            </p>

            <div className="code-input">
              {Object.keys(code).map((digit, index) => (
                <input
                  key={digit}
                  className="digit"
                  type="text"
                  name={digit}
                  maxLength="1"
                  value={code[digit]}
                  onChange={handleChange}
                />
              ))}
            </div>
            <p className="text" tyle={{ fontSize: "1px" }}>
              This migth take a few seconds.
            </p>
            <p className="text" tyle={{ fontSize: "1px" }}>
              The email might be in your spam folder.
            </p>
          </div>
        </form>
      </div>

      <div
        id="signUp"
        style={{ display: visible === "signUp" ? "block" : "none" }}
      >
        <form
          className="modal-content"
          onSubmit={(event) => {
            handleSignup(event);
            console.log("submits");
          }}
        >
          <div id="Container">
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>
            <hr></hr>
            <label hlmtfor="email">
              <b>Email</b>
            </label>
            <input
              className="username"
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={(e) => setUser(e.target.value)}
              aria-invalid={validEmail ? "false" : "true"}
              required
            ></input>
            <p
              className={
                emailError === "duplicate" ? "instructions" : "offscreen"
              }
            >
              This email is already linked to an account.
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
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="uidnote"
            ></input>
            <ul
              id="uidnote"
              className={
                password && !validPassword ? "instructions" : "offscreen"
              }
            >
              {" "}
              <p className={!validLength ? "instructions" : "offscreen"}>
                8 to 24 characters.
              </p>{" "}
              <p className={!validUpperCase ? "instructions" : "offscreen"}>
                Must have a upper case letter.
              </p>{" "}
              <p className={!validLowerCase ? "instructions" : "offscreen"}>
                Must have a lower case letter.
              </p>{" "}
              <p className={!validCharacter ? "instructions" : "offscreen"}>
                Must have one special characters.
              </p>
              <p className={!validNumber ? "instructions" : "offscreen"}>
                {" "}
                Must have one number.
              </p>
            </ul>
            <label hlmtfor="psw-repeat">
              <b>Repeat Password</b>
            </label>
            <input
              type="password"
              placeholder="Repeat Password"
              name="psw-repeat"
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatchPassword ? "false" : "true"}
              aria-describedby="uidnote"
            ></input>
            <p
              className={
                !validMatchPassword && matchPassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              Password does not match.
            </p>
            <button
              type="submit"
              className="submit"
              disabled={!validEmail || !validMatchPassword || !validPassword}
            >
              Create Account
            </button>
            <div id="text">
              <p>Already have an account? </p>
              <p className="re-direct" onClick={() => naviagte("/LogIn")}>
                {" "}
                Log in{" "}
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
