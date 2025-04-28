import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { getLeadFor, getLeadSource, fetchEmp, accdetails} from "../api/auth";
import axios from 'axios';

const ContactForm = ({ setIsAdding, C1, C2, CD }) => {
  const API_URL = process.env.REACT_APP_API_URL
  const [custid, setCustid] = useState("");
  const [allocatedto, setAllocated] = useState("");
  const [leadfor, setLeadfor] = useState("");
  const [leadsource, setLeadsource] = useState("");
  const [leadpriority, setLeadpriority] = useState("");
  // const [status, setStatus] = useState("Active");
  const [addedby, setAddedby] = useState("Active");
  const [contactname, setContactname] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [followupdate, setFollowupdate] = useState("");
  const [address, setAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      customer_id: custid,
      allocated_to: allocatedto,
      lead_for: leadfor,
      lead_source: leadsource,
      lead_priority: leadpriority,
      added_by: addedby,
      contact_name: contactname,
      company_name: companyname,
      phone_number: phonenumber,
      email,
      budget,
      follow_up_date: followupdate,
      reporting_details: remark,
      address,
    };
    const followupData = {
      customer_id: custid,
      allocated_to: [allocatedto],
      lead_for: leadfor,
      lead_source: leadsource,
      lead_priority: leadpriority,
      added_by: addedby,
      contact_name: contactname,
      company_name: companyname,
      phone_number: phonenumber,
      email,
      status: "Open",
      reporting_details: [""],
      budget: ["0"],
      total_follow_up: "0",
      follow_up_Date: [followupdate],
    };
    // console.log("F Contact",contactData);

    try {
      const response = await axios.post(`${API_URL}/addcontact`, contactData);
      const response2 = await axios.post(`${API_URL}/addfollowup`, { followupData, custid });

      if (response.status === 201) {
        alert("Contact added successfully!");
        // Reset form
        setCustid("");
        setAllocated("");
        setLeadfor("");
        setLeadsource("");
        setLeadpriority("");
        setContactname("");
        setCompanyname("");
        setPhonenumber("");
        setEmail("");
        setBudget("");
        setFollowupdate("");
        setAddress("");
        setRemark("");
      }
      if (response2.status === 201) {
        // Reset form
        setCustid("");
        setAllocated("");
        setLeadfor("");
        setLeadsource("");
        setLeadpriority("");
        setContactname("");
        setCompanyname("");
        setPhonenumber("");
        setEmail("");
        setBudget("");
        setFollowupdate("");
        setAddress("");
        setRemark("");
      }
      setIsAdding(false)
    } catch (err) {
      console.error(err.message);
      // setError("Failed to add contact. Please try again.");
      setError(err.response?.data?.message || "Something went wrong.");

    }
  };

  const [leadfors, setLeadfors] = useState([]);
  const [leadsources, setLeadsources] = useState([]);
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    getLeadfor();
    getLeadsource();
    fetchEmployees();
    fetchAccountDetails();
  }, []);

  const getLeadfor = async () => {
    try {
      const response = await getLeadFor();
      // console.log("CF LF", response.data);

      setLeadfors(response.data);
    } catch (err) {
      console.error("Error fetching lead for:", err);
    }
  };
  const getLeadsource = async () => {
    try {
      const response = await getLeadSource();
      setLeadsources(response.data);
    } catch (err) {
      console.error("Error fetching lead source", err);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await fetchEmp();
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };
  const fetchAccountDetails = async () => {
    try {
      const response = await accdetails();
      // console.log("Se",response.data);

      if (response.data && response.data.dob) {
        const parsedDate = new Date(response.data.dob);
        if (!isNaN(parsedDate.getTime())) {  // Check if the date is valid
          response.data.dob = parsedDate.toISOString().split('T')[0];
        }
      }
      setAddedby(response.data.username);
    } catch (err) {
      setError("Failed to load account details.");
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Contact</h2>
          {C1 && (
            <button
              onClick={() => setIsAdding(false)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
              All
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={custid}
            onChange={(e) => setCustid(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <select
            value={allocatedto}
            onChange={(e) => setAllocated(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Allocated To</option>
            {employees.filter((r) => r.status === "Active").map((r) => (
              <option key={r._id} value={r.username}>
                {r.username}
              </option>
            ))}
          </select>

          <select
            value={leadfor}
            onChange={(e) => setLeadfor(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Lead For</option>
            {leadfors.filter((r) => r.status === "Active").map((r) => (
              <option key={r._id} value={r.lead_for}>
                {r.lead_for}
              </option>
            ))}
          </select>

          <select
            value={leadsource}
            onChange={(e) => setLeadsource(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Lead Source</option>
            {leadsources.filter((r) => r.status === "Active").map((r) => (
              <option key={r._id} value={r.lead_source}>
                {r.lead_source}
              </option>
            ))}
          </select>
          <select
            value={leadpriority}
            onChange={(e) => setLeadpriority(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Lead Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            type="text"
            placeholder="Contact Name"
            value={contactname}
            onChange={(e) => setContactname(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Company Name"
            value={companyname}
            onChange={(e) => setCompanyname(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Follow-up Date"
            value={followupdate}
            onChange={(e) => setFollowupdate(e.target.value)}
            className="border p-2 rounded"
            required
            min={new Date().toISOString().split("T")[0]} // ✅ Set today's date as minimum
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded col-span-2"
          />
          <input type="text" className="border p-2 rounded col-span-2" value={remark} placeholder="Notes" onChange={(e) => setRemark(e.target.value)} />
          {error && (
            <div className="bg-yellow-100 text-red-600 p-3 border border-red-500 rounded mb-4 col-span-2">
              {error}
            </div>
          )}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
