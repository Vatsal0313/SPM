import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import axios from 'axios';
import { getContact, deleteContact, fetchEmp, updateContactAllocatedTo, getFollowups } from "../api/auth";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { parse, format } from "date-fns";

const Contactdisplay = ({ setIsAdding, C1, C2, CD }) => {

  const [error, setError] = useState("");
  // const API_URL = 'http://localhost:4000/api/auth';
  const [followups, setFollowups] = useState([]);


  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getContact();
      if (Array.isArray(response.data)) {
        response.data.forEach((item) => {
          ["createdAt", "follow_up_date"].forEach((key) => {
            if (item[key]) {
              const parsedDate = new Date(item[key]);
              if (!isNaN(parsedDate.getTime())) {  // Check if the date is valid
                const day = String(parsedDate.getDate()).padStart(2, "0");
                const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                const year = parsedDate.getFullYear();

                item[key] = `${day}/${month}/${year}`;
              }
            }
          });
        });
      }
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      await fetchContacts(); // Refresh list
    } catch (err) {
      setError("Failed to delete lead.");
    }
  };

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    fetchFollowups();
    fetchEmployees();
  }, []);

  const fetchFollowups = async () => {
    try {
      const response = await getFollowups();
      // const response = await axios.get(`${API_URL}/fetchfollowups`);
      // console.log(response.data);

      setFollowups(response.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetchEmp();
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  }

  const handleAllocatedToChange = async (id, newAllocatedTo) => {
    try {
      await updateContactAllocatedTo(id, newAllocatedTo); // API call
      await fetchFollowups();
      await fetchEmployees(); // Refresh list to reflect changes
      await fetchContacts(); // Refresh list to reflect changes
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [createdRange, setCreatedRange] = useState([0, 100]); // percent (0 to 100)
  const [followUpRange, setFollowUpRange] = useState([0, 100]);
  const createdDates = contacts
    .map(c => parse(c.createdAt, 'dd/MM/yyyy', new Date()))
    .filter(d => !isNaN(d));

  const followUpDates = contacts
    .map(c => parse(c.follow_up_date, 'dd/MM/yyyy', new Date()))
    .filter(d => !isNaN(d));

  const getRangeDate = (dates, percent) => {
    if (dates.length === 0) return new Date();
    const sorted = [...dates].sort((a, b) => a - b);
    const min = sorted[0].getTime();
    const max = sorted[sorted.length - 1].getTime();
    const range = max - min;
    return new Date(min + (range * percent / 100));
  };

  const minCreatedDate = getRangeDate(createdDates, createdRange[0]);
  const maxCreatedDate = getRangeDate(createdDates, createdRange[1]);

  const minFollowUpDate = getRangeDate(followUpDates, followUpRange[0]);
  const maxFollowUpDate = getRangeDate(followUpDates, followUpRange[1]);


  const filteredContacts = contacts.filter((contact) => {
    const followUp = followups.find(
      (f) => f.customer_id === contact.customer_id
    );

    const matchesStatus = !filterStatus || followUp?.status === filterStatus;
    const matchesPriority = !filterPriority || contact.lead_priority === filterPriority;

    const createdDate = parse(contact.createdAt, "dd/MM/yyyy", new Date());
    const followDate = contact.follow_up_date
      ? parse(contact.follow_up_date, "dd/MM/yyyy", new Date())
      : null;
    console.log(contacts,"OK",createdDates,"OK",contact.createdAt,"OK",createdDate);
    
    const matchesCreatedDate =
      createdDate >= minCreatedDate && createdDate <= maxCreatedDate;

    const matchesFollowUpDate = !followDate ||
      (followDate >= minFollowUpDate && followDate <= maxFollowUpDate);

    return matchesStatus && matchesPriority && matchesCreatedDate && matchesFollowUpDate;
  });




  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Contact Records</h2>
          {error && (
            <div className="bg-yellow-100 text-red-600 p-3 border border-red-500 rounded mb-4">
              {error}
            </div>
          )}
          {C2 && (

            <button
              onClick={() => setIsAdding(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
              Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Close">Close</option>
            <option value="Cancel">Cancel</option>
            <option value="Dormant">Dormant</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Created Date Range</label>
            <Slider
              range
              min={0}
              max={100}
              value={createdRange}
              onChange={setCreatedRange}
            />
            <div className="text-sm text-gray-600 flex justify-between mt-1">
              <span>From: {format(minCreatedDate, "dd/MM/yyyy")}</span>
              <span>To: {format(maxCreatedDate, "dd/MM/yyyy")}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Follow-up Date Range</label>
            <Slider
              range
              min={0}
              max={100}
              value={followUpRange}
              onChange={setFollowUpRange}
            />
            <div className="text-sm text-gray-600 flex justify-between mt-1">
              <span>From: {format(minFollowUpDate, "dd/MM/yyyy")}</span>
              <span>To: {format(maxFollowUpDate, "dd/MM/yyyy")}</span>
            </div>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-2 border">Customer ID</th>
              <th className="p-2 border">Added By</th>
              <th className="p-2 border">Allocated To</th>
              <th className="p-2 border">Lead For</th>
              <th className="p-2 border">Lead Source</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Contact Name</th>
              <th className="p-2 border">Company Name</th>
              <th className="p-2 border">Phone Number</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Created Date</th>
              <th className="p-2 border">Follow up Date</th>
              <th className="p-2 border">Total Follow Up</th>
              <th className="p-2 border">Status</th>
              {CD && (
                <th className="p-2 border">Delete</th>
              )
              }
            </tr>
          </thead>
          <tbody>

            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {

                // Find the latest follow-up entry for the contact's customer_id
                const followUp = followups.find(
                  (followup) => followup.customer_id === contact.customer_id
                );

                return ( // Added return statement here
                  <tr key={contact._id} className="text-center">
                    <td className="p-2 border">{contact.customer_id}</td>
                    <td className="p-2 border">{contact.added_by}</td>
                    {/* <td className="p-2 border">{contact.allocated_to}</td> */}
                    <td className="p-2 border">
                      <select
                        value={contact.allocated_to}
                        onChange={(e) => handleAllocatedToChange(contact._id, e.target.value)}
                      >
                        {employees.filter((r) => r.status === "Active").map((r) => (
                          <option key={r._id} value={r.username}>
                            {r.username}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">{contact.lead_for}</td>
                    <td className="p-2 border">{contact.lead_source}</td>
                    <td className="p-2 border">{contact.lead_priority}</td>
                    <td className="p-2 border">{contact.contact_name}</td>
                    <td className="p-2 border">{contact.company_name}</td>
                    <td className="p-2 border">{contact.phone_number}</td>
                    <td className="p-2 border">{contact.email}</td>
                    <td className="p-2 border">{contact.address}</td>
                    <td className="p-2 border">{contact.budget}</td>
                    <td className="p-2 border">{contact.createdAt}</td>
                    <td className="p-2 border">{contact.follow_up_date}</td>
                    <td className="p-2 border">{followUp ? followUp.total_follow_up : "N/A"}</td>
                    <td className="p-2 border">{followUp ? followUp.status : "No Status"}</td>
                    {CD && (
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="17" className="border p-2 text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contactdisplay;
