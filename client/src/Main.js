import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Main() {
  useEffect(() => {
    navigate("/LogIn");
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <Outlet />
    </div>
  );
}
export default Main;
