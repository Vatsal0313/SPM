import { logout } from '../api/auth';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import Dashboard from "./Dashboard";
import Leadfor from "./Leadfor"
import Leadsource from "./Leadsource"
import Rolemaster from "./rolemaster"
import ContactManager1 from "./ContactManager1"
import ContactManager2 from "./ContactManager2"
import FreshLeadsFollowup from "./FreshLeadsFollowup";
import NextRepeatFollowups from "./NextRepeatFollowups";
import TodayLeadsFollowup from "./TodayLeadsFollowup";
import Settings from "./Settings";
import TaskTable from "./TaskTable";
import Account from "./Account"
import Report from "./Report"
import Report_2 from "./Report_2"

import { accdetails, getRolemaster } from '../api/auth';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setName] = useState("");
  const [role, setRole] = useState("");
  // const [roles, setRoles] = useState([]);
  // const [permission, setPermission] = useState("");
  const [C1, setC1] = useState(true);
  const [C2, setC2] = useState(true);
  const [CD, setCD] = useState(true);
  const [L1, setL1] = useState(true);
  const [L2, setL2] = useState(true);
  const [T, setT] = useState(true);
  const [TA, setTA] = useState(true);
  const [TD, setTD] = useState(true);
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await accdetails();
        setName(response.data.username);
        setRole(response.data.role);
        // console.log("R",role,username);

      } catch (err) {
        setError("Failed to load account details.");
      } finally {
        setLoading(false);
      }
    };
    // const fetchRoles = async () => {
    //   const rolE = await getRolemaster();
    //   // console.log("S",role.data.leads);

    //   setRoles(rolE.data);
    //   // console.log("Home",roles);

    //   // setPermissions(role.data.functionalities)
    // };
    const P = async () => {
      // try {
      const response = await accdetails();
      // setName(response.data.username);
      // setRole(response.data.role);
      // console.log("R",role,username);

      // } catch (err) {
      //   setError("Failed to load account details.");
      // } finally {
      //   setLoading(false);
      // }

      const rolE = await getRolemaster();
      // console.log("S",role.data.leads);

      // setRoles(rolE.data);
      const roleData = rolE.data
      const role = response.data.role
      const data = roleData.find((r) => r.role === role);
      // console.log("H",data.functionalities);
      if (role !== "Admin") {
        // setPermission(data)
        const finalValue =
          data.functionalities.taskManagement.add ||
          data.functionalities.taskManagement.all ||
          data.functionalities.taskManagement.delete;
        setC1(data.functionalities.manageContact.all)
        setC2(data.functionalities.manageContact.add)
        setCD(data.functionalities.manageContact.delete)
        setL1(data.functionalities.leads.freshFollowup)
        setL2(data.functionalities.leads.repeatFollowup)
        setT(finalValue)
        setTA(data.functionalities.taskManagement.add)
        setTD(data.functionalities.taskManagement.delete)
      }
      else {
        // console.log("Admin");

        setC1(true)
        setC2(true)
        setCD(true)
        setL1(true)
        setL2(true)
        setT(true)
        setTA(true)
        setTD(true)
      }
    }
    fetchAccountDetails();
    // fetchRoles();
    P();
  }, []);

  const navigate = useNavigate();
  const { logOout } = useAuth();
  const handleLogout = async () => {
    setC1(true)
    setC2(true)
    setCD(true)
    setL1(true)
    setL2(true)
    setT(true)
    setTA(true)
    setTD(true)
    try {
      await logout();
      logOout();
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  const pages = {
    Dashboard: { component: <Dashboard user={username}/> },
    Master: {
      items: {
        "Lead For": <Leadfor />,
        "Lead Source": <Leadsource />,
        "Role Master": <Rolemaster />,
      },
    },
    Contact: {
      items: {
        // "Contact Display": <ContactManager1 />,
        // "Add Contact": <ContactManager2 />,
      },
    },
    Lead: {
      items: {
        // "Fresh Lead Follow up": <FreshLeadsFollowup />,
        // "Next Repeat Follow ups": <NextRepeatFollowups />,
        // "Today's Lead Follow ups": <TodayLeadsFollowup />,
      },
    },
    Task: {},
    Report: {
      items: {
        "Lead Report": <Report />,
        "Task Report": <Report_2 />,
      },
    },
    // Task: { component: <div>Hello</div>},
    Settings: { component: <Settings /> },
    // "Account Creation": { component: <Account /> }
  };
  if (role === "Admin") {
    pages["Task"] = { component: <TaskTable T={T} TA={TA} TD={TD} /> };
    pages["Account Creation"] = { component: <Account /> };
    pages["Lead"] = {
      items: {
        "Fresh Lead Follow up": <FreshLeadsFollowup user={username} />,
        "Next Repeat Follow ups": <NextRepeatFollowups user={username} />,
        "Today's Lead Follow ups": <TodayLeadsFollowup user={username} />,
      },
    };
    pages["Contact"] = {
      items: {
        "Contact Display": <ContactManager1 C1={C1} C2={C2} CD={CD} />,
        "Add Contact": <ContactManager2 C1={C1} C2={C2} CD={CD} />,
      },
    };
  }
  else {
    if ((C1 && C2) || (C2 && CD)) {
      pages["Contact"] = {
        items: {
          "Contact Display": <ContactManager1 C1={C1} C2={C2} CD={CD} />,
          "Add Contact": <ContactManager2 C1={C1} C2={C2} CD={CD} />,
        },
      };
    }
    else {
      if (C1 === true || CD === true) {
        pages["Contact"] = {
          items: {
            "Contact Display": <ContactManager1 C1={C1} C2={C2} CD={CD} />,
          },
        };
      }
      if (C2 === true) {
        pages["Contact"] = {
          items: {
            "Add Contact": <ContactManager2 C1={C1} C2={C2} CD={CD} />,
          },
        };
      }
    }
    if (L1 && L2) {
      pages["Lead"] = {
        items: {
          "Fresh Lead Follow up": <FreshLeadsFollowup user={username} />,
          "Next Repeat Follow ups": <NextRepeatFollowups user={username} />,
          "Today's Lead Follow ups": <TodayLeadsFollowup user={username} />,
        },
      };
    } else {
      if (L1 === true) {
        pages["Lead"] = {
          items: {
            "Fresh Lead Follow up": <FreshLeadsFollowup user={username} />,
            "Today's Lead Follow ups": <TodayLeadsFollowup user={username} />,
          },
        };
      }
      if (L2 === true) {
        pages["Lead"] = {
          items: {
            "Next Repeat Follow ups": <NextRepeatFollowups user={username} />,
            "Today's Lead Follow ups": <TodayLeadsFollowup user={username} />,
          },
        };
      }
    }
    if (T === true) {
      pages["Task"] = { component: <TaskTable T={T} TA={TA} TD={TD} /> };
    }
  }

  const [activePage, setActivePage] = useState(<Dashboard />);
  const [dropdowns, setDropdowns] = useState({});
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <h2 className="text-xl font-bold mb-4">User: {username}</h2>
          )}
          <ul>
            {Object.entries(pages).map(([key, value]) => (
              <li key={key} className="mb-2">
                {value.items ? (
                  <>
                    <button
                      onClick={() => {
                        toggleDropdown(key)
                      }
                      }
                      className="w-full text-left px-2 py-1 bg-gray-700 rounded"
                    >
                      {key}
                    </button>
                    {dropdowns[key] && (
                      <ul className="pl-4 mt-2">
                        {Object.entries(value.items).map(([subKey, subComponent]) => (
                          <li key={subKey} className="mb-1">
                            <button
                              onClick={() => {
                                setActivePage(subComponent)
                              }
                              }
                              className="w-full text-left px-2 py-1 bg-gray-600 rounded"
                            >
                              {subKey}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setActivePage(value.component)}
                    className="w-full text-left px-2 py-1 bg-gray-700 rounded"
                  >
                    {key}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded mt-4 mb-12"
        >
          Logout
        </button>

      </div>
      <div className="flex-1 p-6">{activePage}</div> {/* Pages */}
    </div>
  );
};

export default Home;
