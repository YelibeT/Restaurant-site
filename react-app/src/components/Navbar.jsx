import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <ul className="navs">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/OrderSuccess">Orders</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        
      </ul>
    </nav>
  );
}
export default Navbar;
