import axios from 'axios';
// require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL
console.log("ENV",API_URL,process.env.REACT_APP_API_URL);


export const register = async (user) => await axios.post(`${API_URL}/register`, user);
export const login = async (user) => await axios.post(`${API_URL}/login`, user, { withCredentials: true });
export const logout = async () => await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
export const checkauth = async () => { return await axios.get(`${API_URL}/check`, { withCredentials: true })};
export const accdetails = async () => { return await axios.get(`${API_URL}/accountdetails`, { withCredentials: true })};
export const fetchEmp = async () => { return await axios.get(`${API_URL}/employees`)};
export const updateacc = async (formData) => await axios.put(`${API_URL}/updateaccount`, formData, { withCredentials: true });
export const getLeadFor = async () => { return await axios.get(`${API_URL}/fetchleadfor`)};
export const addLeadFor = async (leadData) => await axios.post(`${API_URL}/addleadfor`, leadData );
export const deleteLeadFor = async (id) => await axios.delete(`${API_URL}/deleteleadfor/${id}`);
export const getLeadSource = async () => { return await axios.get(`${API_URL}/fetchleadsource`)};
export const addLeadSource = async (leadData) => await axios.post(`${API_URL}/addleadsource`, leadData );
export const deleteLeadSource = async (id) => await axios.delete(`${API_URL}/deleteleadsource/${id}`);
export const getRolemaster = async () => { return await axios.get(`${API_URL}/fetchrolemaster`)};
export const getFollowups = async () => { return await axios.get(`${API_URL}/fetchfollowups`)};
export const addRolemaster = async (roleData) => await axios.post(`${API_URL}/addrolemaster`, roleData );
export const deleteRolemaster = async (id) => await axios.delete(`${API_URL}/deleterolemaster/${id}`);
export const getContact = async () => { return await axios.get(`${API_URL}/fetchcontact`)};
export const deleteContact = async (id) => await axios.delete(`${API_URL}/deletecontact/${id}`);
export const deleteTask = async (id) => await axios.delete(`${API_URL}/deletetask/${id}`);

export const updateLeadForStatus = (id, status) => {
    return axios.patch(`${API_URL}/updateleadforstatus/${id}/status`, { status });
  };
export const updateLeadSourceStatus = (id, status) => {
    return axios.patch(`${API_URL}/updateleadsourcestatus/${id}/status`, { status });
  };
export const updateRolemasterStatus = (id, status) => {
    return axios.patch(`${API_URL}/updaterolemasterstatus/${id}/status`, { status });
  };
export const updateAccStatus = (id, status) => {
    return axios.patch(`${API_URL}/updateaccstatus/${id}/status`, { status });
  };
export const updateTaskStatus = (id, status, assignTo) => {
    return axios.patch(`${API_URL}/updatetaskstatus/${id}/status`, { status, assignTo });
  };
export const updateContactAllocatedTo = (id, allocatedTo) => {
    return axios.patch(`${API_URL}/updatecontactallocatedto/${id}/status`, { allocatedTo });
  };