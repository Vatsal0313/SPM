const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../schema/account");
const Service = require("../schema/service");
const Source = require("../schema/source");
const Role = require("../schema/role");
const Contact = require("../schema/contact");
const Followup = require("../schema/followup");
const TasksDB = require("../schema/tasks");
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
    res.send("Hello, Express! api/auth -> routes-authroutes.js");
});

app.post("/register", async (req, res) => {
    try {
        const {empid, designation, name, head, role, email, password, status } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Account({
            employee_id: empid,
            username: name,
            email: email,
            password: hashedPassword,
            hp: password,
            status: status,
            designation: designation,
            role: role,
            head: head,
            today_follow_up: 0,
            open_lead: 0,
            close_lead: 0,
            cancel_lead: 0,
            dormant_lead: 0, 
            completed_task: 0,
            incomplete_task: 0
        });
        await newUser.save();
        console.log(name,`registered successfully`);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ error: error.message });
    }
});

app.post('/login', async(req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Account.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      if(user.status=="Inactive") return res.status(400).json({ message: 'User account is Inactive' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      console.log(email,`Login Successfully`);
      res.cookie("token", token, {
          httpOnly: true,
          secure: true,        // Required on HTTPS (Vercel uses HTTPS)
          sameSite: "None",    // Allows sending cookie across domains
        });
      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.get("/check", (req, res) => { //Authcontext.js
    const token = req.cookies.token;
    
    if (!token) return res.status(401).json({ user: null });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ user: null });
      console.log("Check success ID", decoded.id);
      res.json({ user: decoded.id });
    });
});

app.get("/employees", async (req, res) => { //Account.js
  try {
    const employees = await Account.find().select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/accountdetails", async (req, res) => { //settings.js
  const token = req.cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ user: null });
      const acc = await Account.findById(decoded.id);
      if (!acc) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(acc);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updateaccount", async (req, res) => { //settings.js
  try {
    const token = req.cookies.token;
    let userId;
    // Verify JWT and extract user ID
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      userId = decoded.id;
    });
    if (!userId) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const updatedAccount = await Account.findByIdAndUpdate(userId, req.body, { new: true });
    console.log("Account updated");
    
    res.json(updatedAccount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/fetchleadfor", async (req, res) => { // Leadfor.js
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/addleadfor", async (req, res) => { // Leadfor.js
  try {
    const { leadFor,status } = req.body;
    if (!leadFor) {
      return res.status(400).json({ error: "Lead For is required" });
    }
    const newService = new Service({ 
      lead_for: leadFor,
      status: status 
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: "Failed to add service" });
  }
});

app.delete("/deleteleadfor/:id", async (req, res) => { // Leadfor.js
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: "Lead For deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.get("/fetchleadsource", async (req, res) => { // Leadsource.js
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/addleadsource", async (req, res) => { // Leadsource.js
  try {
    const { leadSource,status } = req.body;
    if (!leadSource) {
      return res.status(400).json({ error: "Lead For is required" });
    }
    const newSource = new Source({ 
      lead_source: leadSource,
      status: status 
    });
    await newSource.save();
    res.status(201).json(newSource);
  } catch (err) {
    res.status(500).json({ error: "Failed to add service" });
  }
});

app.delete("/deleteleadsource/:id", async (req, res) => { // Leadsource.js
  try {
    const { id } = req.params;
    await Source.findByIdAndDelete(id);
    res.json({ message: "Lead For deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.get("/fetchrolemaster", async (req, res) => { // Role.js
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/addrolemaster", async (req, res) => { // Role.js
  try {
    const { rolemaster,status } = req.body;
    if (!rolemaster) {
      return res.status(400).json({ error: "Role is required" });
    }
    const newRole = new Role({ 
      role: rolemaster,
      status: status,
      functionalities: {
        taskManagement: { all: false, add: false, delete: false },
        leads: { freshFollowup: false, repeatFollowup: false },
        manageContact: { all: false, add: false, delete: false }
      }
    });

    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: "Failed to add service" });
  }
});

app.put("/roleupdate/:id", async (req, res) => {
  try {
    const { rolE, statuS, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { rolE, statuS, functionalities: permissions },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully", updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
});


app.delete("/deleterolemaster/:id", async (req, res) => { // Role.js
  try {
    const { id } = req.params;
    await Role.findByIdAndDelete(id);
    res.json({ message: "Lead For deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.get("/fetchcontact", async (req, res) => { // Contact.js
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/addcontact", async (req, res) => { //Contact.js
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Contact added successfully", contact: newContact });
  } catch (err) {
    console.log(err.message)
    // res.status(500).json({ error: "Failed to add contact", details: err.message });

    if (err.code === 11000) {
      // Extract the duplicated key from the error object
      const field = Object.keys(err.keyPattern)[0]; // e.g., "phone_number"
      let readableField = field.replace(/_/g, " ");

      return res.status(400).json({
        message: `A contact with this ${readableField} already exists.`,
      });
    }

    console.error("Error in addContact:", err);
    res.status(500).json({ error: "Failed to add contact", details: err.message });
  }
});

app.delete("/deletecontact/:id", async (req, res) => { // Contact.js
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: "Lead For deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.post("/addfollowup", async (req, res) => { // FOLLOW UP
  try {
    const {followupData, custid} = req.body
    const newFollowup = new Followup(followupData);
    // console.log("OK",followupData.allocated_to,followupData.today_follow_up);
    if (followupData.status.toLowerCase() === "open") {
      await Account.findOneAndUpdate(
        { username: followupData.allocated_to[followupData.total_follow_up] },
        { $inc: { open_lead: 1 } }
      );
    }
    await newFollowup.save();
    res.status(201).json({ message: "Contact added successfully", contact: newFollowup });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to add contact", details: err.message });
  }
});


app.get("/fetchfollowups", async (req, res) => {
  try {
    const followups = await Followup.find();

    res.json(followups);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/todaysfetchfollowups", async (req, res) => {
  try {
    const followUps = await Followup.find();
    res.json(followUps);
  } catch (error) {
    
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/fetchfollowupsrepeat", async (req, res) => {
  try {
    const followups = await Followup.aggregate([
      {
        $match: { total_follow_up: { $gt: 0 } } // Filter out records where total_follow_up is 0
      },
      {
        $sort: { total_follow_up: -1 } // Sort by highest total_follow_up first
      },
      {
        $group: {
          _id: "$customer_id",
          latestFollowup: { $first: "$$ROOT" } // Get the first (highest) entry per customer_id
        }
      },
      {
        $replaceRoot: { newRoot: "$latestFollowup" } // Replace the root with the latest follow-up
      }
    ]);

    res.json(followups);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/fetchfollowups0", async (req, res) => {
  try {
      const followUps = await Followup.aggregate([
          {
              $match: { total_follow_up: 0 } // Directly filter where total_follow_up is 0
          },
      ]);

      res.json({ success: true, data: followUps });
  } catch (error) {
      console.error("Error fetching follow-ups:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// PUT /api/followup/:id
app.put('/updatefollowup/:id', async (req, res) => {
  try {
    const { allocated_to, reporting_details, follow_up_Date, budget } = req.body.data;
    const lead_status = req.body.lead_status;
    console.log(req.body,allocated_to, reporting_details, follow_up_Date, budget,req.body.data,lead_status,req.params.id);
    
    const updatedFollowUp = await Followup.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ...(allocated_to && { allocated_to: { $each: allocated_to } }),
          ...(reporting_details && { reporting_details: { $each: reporting_details } }),
          ...(follow_up_Date && { follow_up_Date: { $each: follow_up_Date.map(date => new Date(date)) } }),
          ...(budget && { budget: { $each: budget } })
        },
        $inc: { total_follow_up: 1 },
      },
      { new: true }
    );
    
    const statuses = ["open", "close", "dormant", "cancel"];

// Make sure both statuses are lowercase
const pastfollowup = await Followup.findById(req.params.id);
const oldStatus = pastfollowup.status.toLowerCase();
const newStatus = lead_status.toLowerCase();

if (oldStatus !== newStatus && statuses.includes(oldStatus) && statuses.includes(newStatus)) {
  const update = {};
  console.log(oldStatus,newStatus);
  
  // Decrement old status count
  update[`${oldStatus}_lead`] = -1;

  // Increment new status count
  update[`${newStatus}_lead`] = 1;

  await Account.findOneAndUpdate(
    { username: allocated_to },
    { $inc: update }
  );
}


    // console.log("P FU",pastfollowup.status,lead_status);
    
    // if (lead_status.toLowerCase() === "open") {
    //   await Account.findOneAndUpdate(
    //     { username: assignTo },
    //     { $inc: { open_lead: 1, close_lead: -1 } }
    //   );
    // }
    // if (lead_status.toLowerCase() === "close") {
    //   await Account.findOneAndUpdate(
    //     { username: assignTo },
    //     { $inc: { close_lead: 1, open_lead: -1 } }
    //   );
    // }
    // if (lead_status.toLowerCase() === "cancel") {
    //   await Account.findOneAndUpdate(
    //     { username: assignTo },
    //     { $inc: { cancel_lead: 1, incomplete_task: -1 } }
    //   );
    // }
    // if (lead_status.toLowerCase() === "dormant") {
    //   await Account.findOneAndUpdate(
    //     { username: assignTo },
    //     { $inc: { dormant_lead: 1, incomplete_task: -1 } }
    //   );
    // }
    const updatedFollowUpDStatus = await Followup.findByIdAndUpdate(
      req.params.id, // Replace this with your actual follow-up document ID
      { status: lead_status }, // Replace "New Status" with the desired status
      { new: true } // Returns the updated document
    );
    res.status(200).json({updatedFollowUp,updatedFollowUpDStatus});
  } catch (err) {
    res.status(500).json({ message: 'Failed to update follow-up', error: err });
  }
});

app.patch("/updateleadforstatus/:id/status", async (req, res) => { // Leadfor.js
  try {
    const { status } = req.body;
    // console.log(status);
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.patch("/updateleadsourcestatus/:id/status", async (req, res) => { // Leadsource.js
  try {
    const { status } = req.body;
    // console.log(status);
    
    const updatedService = await Source.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.patch("/updaterolemasterstatus/:id/status", async (req, res) => { // rolemaster.js
  try {
    const { status } = req.body;
    console.log(status);
    
    const updatedService = await Role.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.patch("/updateaccstatus/:id/status", async (req, res) => { // Account.js
  try {
    const { status } = req.body;
    console.log(status);
    
    const updatedService = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.patch("/updatetaskstatus/:id/status", async (req, res) => { // TaskTable.js
  try {
    const { status, assignTo } = req.body;
    console.log(status);
    
    const updatedService = await TasksDB.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (status.toLowerCase() === "completed") {
      await Account.findOneAndUpdate(
        { username: assignTo },
        { $inc: { completed_task: 1, incomplete_task: -1 } }
      );
    }
    if (status.toLowerCase() === "incomplete") {
      await Account.findOneAndUpdate(
        { username: assignTo },
        { $inc: { completed_task: -1, incomplete_task: 1 } }
      );
    }
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.patch("/updatecontactallocatedto/:id/status", async (req, res) => { // ContactDisplay.js
  try {
    const { allocatedTo } = req.body;
    console.log(allocatedTo);
    
    const updatedAccountAllocatedTo = await Contact.findByIdAndUpdate(
      req.params.id,
      { allocated_to: allocatedTo },
      { new: true }
    );
    res.json(updatedAccountAllocatedTo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.get("/gettasks", async (req, res) => { // Task.js
  try {
    const tasks = await TasksDB.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

app.post("/addtasks", async (req, res) => { // Task.js
  try {
    console.log("Task",req.body);
    const {task,priority,contact,startDate,dueDate, assignTo,assignBy,description,status} = req.body;
    const newTask = new TasksDB({task:task,priority:priority,contact:contact,startDate:startDate,dueDate:dueDate, assignTo:assignTo,assignBy:assignBy,description:description,status:status});
    await newTask.save();
    if (status.toLowerCase() === "incomplete") {
      await Account.findOneAndUpdate(
        { username: assignTo },
        { $inc: { incomplete_task: 1 } }
      );
    }
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

app.delete("/deletetask/:id", async (req, res) => { // Task.js
  try {
    const { id } = req.params;
    await TasksDB.findByIdAndDelete(id);
    res.json({ message: "Lead For deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.get("/dashboard/counts", async (req,res) => {
  try{
    const totalContacts = await Contact.countDocuments();
    const freshFollowup = await Followup.countDocuments({ total_follow_up: "0" });
    const openLead = await Followup.countDocuments({ status: "Open" });
    const closeLead = await Followup.countDocuments({ status: "Close" });
    const cancelLead = await Followup.countDocuments({ status: "Cancel" });
    res.json({ totalContacts, freshFollowup, openLead, closeLead, cancelLead });
  }catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
})

//DASHBOARD
const getHierarchy = async (headName, hierarchy = []) => {
  if (!headName) return hierarchy;
  
  const head = await Account.findOne({ username: headName }, "username head");
  if (head) {
    hierarchy.push(head.username);
    return getHierarchy(head.head, hierarchy);
  }
  return hierarchy;
};
// API to get employees with their full head hierarchy
// app.get("/dashboard/hierarchy", async (req, res) => {
//   try {
//     const employees = await Account.find({}, "username head");
    
//     const employeesWithHierarchy = await Promise.all(
//       employees.map(async (employee) => {
//         const hierarchy = await getHierarchy(employee.head, []);
//         return { ...employee._doc, hierarchy: hierarchy.reverse() };
//       })
//     );

//     res.json(employeesWithHierarchy);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });
app.get("/dashboard/hierarchy", async (req, res) => {
  try {
    const employees = await Account.find(
      {},
      "username head today_follow_up open_lead close_lead cancel_lead dormant_lead completed_task incomplete_task"
    );

    const employeesWithHierarchy = await Promise.all(
      employees.map(async (employee) => {
        const hierarchy = await getHierarchy(employee.head, []);
        return { ...employee._doc, hierarchy: hierarchy.reverse() };
      })
    );

    res.json(employeesWithHierarchy);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

//Report.js
app.post("/reports/leads", async (req, res) => {
  const { startDate, endDate, leadStatus, leadPriority } = req.body;

  const filter = {};
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (leadStatus) filter.status = leadStatus;
  if (leadPriority) filter.lead_priority = leadPriority;

  try {
    const data = await Contact.find(filter).lean();
    res.json(data);
  } catch (err) {
    console.error("Report fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/reports/tasks", async (req, res) => {
  const { status, priority, startDate, endDate } = req.body;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (startDate && endDate) {
    filter.startDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    const tasks = await TasksDB.find(filter).lean();
    res.json(tasks);
  } catch (err) {
    console.error("Task Report Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//DASHBOARD
app.post('/logout', (req, res) => {
  console.log("Logout Success ");
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: 'Logged out' });
});

module.exports = app;
