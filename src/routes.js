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
//import Dashboard from "views/Dashboard.js";
//import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
//import Typography from "views/Typography.js";
//import TableList from "views/Tables.js";
//import UserPage from "views/User.js";
import Resume from "views/Resume";
import CoverLetter from "views/CoverLetter";
import WelcomePage from "views/Welcome";

var routes = [
  {
    path: "/welcome",
    name: "Home",
    icon: "nc-icon nc-bank",
    component: <WelcomePage/>,
    layout: "/admin",
  },
  {
    path: "/resume",
    name: "Resume",
    icon: "nc-icon nc-bullet-list-67",
    component: <Resume />,
    layout: "/admin",
  },
  {
    path: "/cover-letter",
    name: "Create Cover Letter",
    icon: "nc-icon nc-single-copy-04",
    component: <CoverLetter />,
    layout: "/admin",
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-bank",
  //   component: <Dashboard />,
  //   layout: "/admin",
  // },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: <Icons />,
    layout: "/admin",
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: <Notifications />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-page",
  //   name: "User Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: <UserPage />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "nc-icon nc-tile-56",
  //   component: <TableList />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: <Typography />,
  //   layout: "/admin",
  // },
];
export default routes;
