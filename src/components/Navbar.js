import { Link } from "react-router-dom";
import logo from "../images/desk-logo.svg";

export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#F5F7F8",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="Newrole Logo"
          width="120"
          height="auto"
          loading="eager"
          style={{ display: "block" }}
        />
      </Link>
    </header>
  );
}
