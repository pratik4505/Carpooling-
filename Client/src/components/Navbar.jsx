import { Component } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";

class Navbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    return (
      <nav className="NavbarItems">
        <h1 className="navbar-logo">SUDOSU SENPAI</h1>

        <div className="menu-icons" onClick={this.handleClick}>
          {/* Replaced the Font Awesome bars with simple div elements */}
          <div
            className={this.state.clicked ? "menu-bar clicked" : "menu-bar"}
          ></div>
          <div
            className={this.state.clicked ? "menu-bar clicked" : "menu-bar"}
          ></div>
          <div
            className={this.state.clicked ? "menu-bar clicked" : "menu-bar"}
          ></div>
        </div>

        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link to={item.url} className={item.cName}>
                  {/* You can add any icons or text here */}
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
