import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const naviagte = useNavigate();

  useEffect(() => {
    // Check local storage for user data on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //sets the user, lets children component to set the user ie. for Logging In
  const setuser = (event) => {
    localStorage.setItem("user", JSON.stringify(event));

    setUser(event);
  };

  //Log outs the user be removing it from the local storage and sets the user
  //state to null
  //then send you back to login
  const logout = () => {
    const storedUser = localStorage.removeItem("user");
    setUser(null);
    naviagte("/LogIn");
  };

  return (
    <AuthContext.Provider value={{ user, logout, setuser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
