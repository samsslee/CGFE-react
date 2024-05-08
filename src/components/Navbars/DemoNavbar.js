/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import getUserEmail from "components/Middleware/getUserEmail";
import supabase from "config/supabaseClient";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  Container
} from "reactstrap";

import routes from "routes.js";


//TODO: make the localhost things a variable so that it can point to an actual link

function Header(props) {
  const [userEmail, setUserEmail] = React.useState('')
  const sidebarToggle = React.useRef();
  const location = useLocation();
  
  const getSessionEmail = async () => {
    const sessionEmail = await getUserEmail()
    if (!sessionEmail) {
      console.error('Unable to retrieve user email')
      window.location.href = "http://localhost:3000/"
    } else {
      setUserEmail(sessionEmail)
    }
  }
  
  const getBrand = () => {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if(error) {
      console.log(error)
    }
    window.location.href = "http://localhost:3000/"
  };
  
  React.useEffect(() => {
    getSessionEmail()
  },[]);
  
  return (
    <Navbar>
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <h1 className="page-title">{getBrand()}</h1>
        </div>
        <Nav className="justify-content-end">
          <NavItem>
            <div className="logout">
              <i className="nc-icon nc-circle-10" />
              <span className="">{userEmail}</span>
              <button type="button" onClick={() => logout()} className="">Logout</button>
            </div>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
