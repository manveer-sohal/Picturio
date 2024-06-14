import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import Main from "./Main";
import LogIn from "./LogIn";
import SignIn from "./SignIn";
import Pic from "./Pic";
import NavBar from "./NavBar";
import Error_page from "./error_page";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/pic" element={<Pic />} />
        <Route path="/error" element={<Error_page />} />
      </Routes>
    </AuthProvider>
  </Router>
);
