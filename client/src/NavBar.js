import { react, useContext } from "react";
import { AuthContext } from "./AuthContext";

function NavBar() {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <ul className="buttons" id="navbar">
        <a href="/">home</a>
        <a href="map">Map</a>
        <a href="pics">Pics</a>
        <a href="countDown">Count Down</a>
        <a href="list">list</a>
        <a id="log-out" onClick={() => logout()}>
          {" "}
          Log Out
        </a>
      </ul>
    </>
  );
}

export default NavBar;
