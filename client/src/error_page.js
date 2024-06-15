import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error_page() {
  //const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div>
      <h1 style={{ color: "red", fontSize: "100px", textAlign: "center" }}>
        Sorry something went wrong.
      </h1>
    </div>
  );
}
export default Error_page;
