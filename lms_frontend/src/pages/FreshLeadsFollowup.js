import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getContact } from "../api/auth";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { parse, format } from "date-fns";

const FreshLeadsFollowup = ({ user }) => {
  // console.log("FFUP",user);
  
  // const API_URL = "http://localhost:4000/api/auth";
  const API_URL = process.env.REACT_APP_API_URL
  const [followups, setFollowups] = useState([]);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);


  useEffect(() => {
    fetchFollowups();
    fetchContacts();

  }, []);

  const fetchFollowups = async () => {
    try {
      const response = await axios.get(`${API_URL}/fetchfollowups0`);
      setFollowups(response.data.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };
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
      // console.log(response.data);

      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadinContacts, setSelectedLeadinContacts] = useState(null);

  const openFollowUpForm = (contact) => {
    // console.log(contact);
    const matchedLead = contacts.find((lead) => lead.customer_id === contact.customer_id);
    setSelectedLeadinContacts(matchedLead);
    // console.log("M",matchedLead);

    setSelectedLead(contact);
    setAllocatedTo(matchedLead.allocated_to)
  };

  const closeFollowUpForm = () => {
    setSelectedLead(null);
  };


  const [allocatedTo, setAllocatedTo] = useState('');
  const [reportingDetail, setReportingDetail] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [budgetValue, setBudgetValue] = useState('');
  const [lead_status, setLeadStatus] = useState('');
  const [followUpId, setfollowUpId] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      allocated_to: [allocatedTo],
      reporting_details: [reportingDetail],
      follow_up_Date: [followUpDate],
      budget: [parseFloat(budgetValue)],
      // status: lead_status
    };

    try {
      await axios.put(`${API_URL}/updatefollowup/${followUpId}`, { data, lead_status });
      // console.log('Updated:', res.data);
      navigate('/home');
      setSelectedLead(null);
      await fetchFollowups();
      alert('Follow-up updated successfully!');
    } catch (error) {
      console.error('Error updating follow-up:', error);
      alert('Something went wrong.');
    }
  };
  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [createdRange, setCreatedRange] = useState([0, 100]); // percent (0 to 100)
  const [followUpRange, setFollowUpRange] = useState([0, 100]);
  const createdDates = followups
    .map(c => parse(new Date(c.createdAt).toLocaleDateString(), 'dd/MM/yyyy', new Date()))
    .filter(d => !isNaN(d));

  // const followUpDates = followups
  //   .map(c => parse(new Date(c.follow_up_date).toLocaleDateString(), 'dd/MM/yyyy', new Date()))
  //   .filter(d => !isNaN(d));
  // const followUpDates = followups
  // .map(c => {
  //   const index = c.total_follow_up-1;
  //   return parse(new Date(c.follow_up_date[index]).toLocaleDateString(), 'dd/MM/yyyy', new Date())
  // })
  // .filter(d => d && !isNaN(d));
  // const followUpDates = followups
  // .map(c => {
  //   const index = c.total_follow_up;
  //   const dateObj = c.follow_up_date[index];
  //   return dateObj ? new Date(dateObj) : null;
  // })
  // .filter(d => d && !isNaN(d));



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

  // const minFollowUpDate = getRangeDate(followUpDates, followUpRange[0]);
  // const maxFollowUpDate = getRangeDate(followUpDates, followUpRange[1]);

  const filteredfollowups = followups.filter((followup) => {
    // const followUp = contacts.find(
    //   (f) => f.customer_id === followup.customer_id
    // );

    const matchesStatus = !filterStatus || followup.status === filterStatus;
    const matchesPriority = !filterPriority || followup.lead_priority === filterPriority;

    const createdDate = parse(new Date(followup.createdAt).toLocaleDateString(), "dd/MM/yyyy", new Date());
    // const followDate = new Date(followup.follow_up_date).toLocaleDateString()
    //   ? parse(new Date(followup.follow_up_date[followup.total_follow_up]).toLocaleDateString(), "dd/MM/yyyy", new Date())
    //   : null;
      
      const matchesCreatedDate =
      createdDate >= minCreatedDate && createdDate <= maxCreatedDate;
      
      // const matchesFollowUpDate = !followDate ||
      // (followDate >= minFollowUpDate && followDate <= maxFollowUpDate);
      
      // console.log(createdDate,"OK",matchesCreatedDate);
      // console.log(followups,"OK",createdDates,"OK",followup.createdAt,"OK",createdDate);
      // console.log(followups,"OK",followUpDates,"OK",createdDates);
      
    // return matchesStatus && matchesPriority
    return matchesStatus && matchesPriority && matchesCreatedDate
    // return matchesStatus && matchesPriority && matchesCreatedDate && matchesFollowUpDate;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Fresh Leads Follow-up</h2>
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

          {/* <div className="mb-4">
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
          </div> */}
        </div>
        {/* Leads Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">SR NO</th>
              <th className="border p-2">Allocated To</th>
              <th className="border p-2">Person Name</th>
              <th className="border p-2">Mobile No</th>
              <th className="border p-2">Company Name</th>
              <th className="border p-2">Lead For</th>
              <th className="border p-2">Lead Source</th>
              <th className="border p-2">Lead Status</th>
              <th className="border p-2">Lead Priority</th>
              <th className="border p-2">Lead Generate Date</th>
              <th className="p-2 border">Next FU Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredfollowups.length > 0 && contacts.length > 0 ? (
              filteredfollowups
                .map((followup) => {
                  const selected = contacts.find(
                    (contact) => contact.customer_id === followup.customer_id
                  );
                  if (!selected || selected.allocated_to !== user) return null;
                  return { followup, selected };
                })
                .filter(Boolean) // remove nulls
                .map(({ followup, selected }, index) => (
                  <tr key={followup._id || index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{selected.allocated_to || "-"}</td>
                    <td className="border p-2">{followup.contact_name}</td>
                    <td className="border p-2">{followup.phone_number}</td>
                    <td className="border p-2">{followup.company_name || "-"}</td>
                    <td className="border p-2">{followup.lead_for}</td>
                    <td className="border p-2">{followup.lead_source}</td>
                    <td className="border p-2">{followup.status}</td>
                    <td className="border p-2">{followup.lead_priority}</td>
                      {/* {new Date(followup.createdAt).toLocaleDateString()} */}
                    <td className="p-2 border">
                      {new Date(followup.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </td>
                    {/* <td className="p-2 border">{new Date(followup.follow_up_Date[followup.total_follow_up]).toLocaleDateString()}</td> */}
                    <td className="p-2 border">
                      {new Date(followup.follow_up_Date[followup.total_follow_up]).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => {
                          // setAllocatedTo(contact.allocated_to)
                          setfollowUpId(followup._id)
                          openFollowUpForm(followup)
                        }}
                        className="bg-blue-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))
              // })
            ) : (
              <tr>
                <td colSpan="11" className="border p-2 text-center">
                  No Contacts Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Follow-Up Form - Opens on Clicking "+" */}
      {selectedLead && selectedLeadinContacts && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">Add Follow Up</h2>
              <div className="text-right">
                [ Lead Allocated: {selectedLeadinContacts.allocated_to} ] Total Follow-up {selectedLead.total_follow_up} times
              </div>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>{selectedLead.lead_for} ( Lead Source: {selectedLead.lead_source} )</span>
              <span>Lead Priority: <span className="font-bold">High</span></span>
            </div>


            <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
              <table className="w-full border-collapse">
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">
                    <span className="mr-2">🏢</span> Company Name : {selectedLead.company_name}
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    <span className="mr-2">👤</span> Person Name : {selectedLead.contact_name}
                  </td>
                  <td className="p-3">
                    <span className="mr-2">🔘</span> Lead Status : {selectedLead.status}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-gray-300">
                    <span className="mr-2">📱</span> Mobile No : {selectedLead.phone_number}
                  </td>
                  <td className="p-3">
                    <span className="mr-2">📧</span> Email Id : {selectedLead.email}
                  </td>
                </tr>
              </table>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              {/* Reporting Details - Large Textarea */}
              <div className="col-span-3">
                <label className="block font-semibold text-gray-700">
                  Reporting Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Reporting Details"
                  value={reportingDetail}
                  onChange={(e) => setReportingDetail(e.target.value)}
                  className="w-full border p-3 rounded h-32"
                ></textarea>
              </div>

              {/* Follow-Up Date */}
              <div>
              <label className="block font-semibold text-gray-700">Next Follow Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full border p-2 rounded"
                />
              </div>

              {/* Budget Input */}
              <div>
              <label className="block font-semibold text-gray-700">Budget</label>
              <input
                type="number"
                placeholder="Budget"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className="w-full border p-2 rounded"
                />
              </div>
              {/* Lead Status Dropdown */}
              <div>
                <label className="block font-semibold text-gray-700">Update Lead Status</label>
                <select
                  value={lead_status}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                  <option value="Cancel">Cancel</option>
                  <option value="Dormant">Dormant</option>
                </select>
              </div>
              {/* Buttons */}
              <div className="col-span-3 flex justify-end mt-4">
                <button
                  onClick={closeFollowUpForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Update Follow-Up
                </button>
              </div>
            </form>
            {/* History Section - Scrollable Table */}
            <h3 className="text-xl font-semibold mt-6 mb-2">History</h3>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="border p-2">SR NO</th>
                    <th className="border p-2">Allocated To</th>
                    <th className="border p-2">Reporting Details</th>
                    <th className="border p-2">Budget</th>
                    <th className="border p-2">FU Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLead && selectedLead.allocated_to && selectedLead.allocated_to.length > 0 ? (
                    selectedLead.allocated_to.map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {index === 0 ? (
                          <>
                            <td className="border p-2">Fresh Followup</td>
                            <td className="border p-2">{selectedLead.allocated_to[0] || "-"}</td>
                            <td className="border p-2">{selectedLead.reporting_details[0] || "-"}</td>
                            <td className="border p-2">{selectedLead.budget[0] || "-"}</td>
                            <td className="border p-2">
                              {new Date(selectedLead.follow_up_Date[index]).toLocaleDateString() || "-"}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border p-2">{index}</td>
                            <td className="border p-2">{selectedLead.allocated_to[index] || "-"}</td>
                            <td className="border p-2">{selectedLead.reporting_details[index] || "-"}</td>
                            <td className="border p-2">{selectedLead.budget[index] || "-"}</td>
                            <td className="border p-2">
                              {new Date(selectedLead.follow_up_Date[index]).toLocaleDateString() || "-"}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border p-2 text-center">
                        No History Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreshLeadsFollowup;
