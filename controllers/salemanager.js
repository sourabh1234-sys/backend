const Task = require("../models/task");
const mongoose = require('mongoose');
const { Emp } = require("../models/user");

async function Getalltask(req, res) {
    try {
        const Emp = await Task.find();  
        res.status(200).json(Emp);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
}

async function Addnewtask(req, res) {
    const { taskName, assignedTo, assignedBy, work, area, status, startDate, dueDate } = req.body;

    if (!taskName || !assignedTo || !assignedBy || !work || !area || !startDate || !dueDate) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    try {
        const newTask = await Task.create({
            taskName,
            assignedTo,
            assignedBy,
            work,
            area,
            status: status || 'not started',  // default status if not provided
            startDate,
            dueDate
        });

        res.status(200).json({
            message: "Task added successfully",
            task: newTask
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding new task" });
    }
}

async function Updatetask(req, res) {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Task ID' });
    }

    const { taskName, assignedTo, assignedBy, work, area, status, startDate, dueDate } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskName, assignedTo, assignedBy, work, area, status, startDate, dueDate },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (error) {
        console.error('Error during update:', error);
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
}

async function Deletetask(req, res) {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task" });
    }
}


// async function Addnewemp(req , res) {
//     const { username, email, password, role, loginId } = req.body;  // Added 'loginId'
//     try {
//         const newEmployee = await Emp.create({ username, email, password, role, loginId });  // Include 'loginId'
//         res.status(200).json({ message: 'Employee successfully added', newEmployee });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'New employee not added' });
//     }
// }


const Shoallusertime = async (req, res) => {
    try {
       
        const allLabours = await Emp.find({}, 'username loginId inTime outTime');

        if (!allLabours || allLabours.length === 0) {
            return res.status(404).json({ message: 'No labours found.' });
        }
        console.log(allLabours);
        
        return res.status(200).json({
            message: 'All labour users and their login/logout times',
            labours: allLabours,
        });
    } catch (error) {
        console.error('Error fetching labour login/logout times:', error);
        return res.status(500).json({ message: 'Error fetching data. Please try again later.' });
    }
};


module.exports = {
    Getalltask,
    Addnewtask,
    Deletetask,
    Updatetask,
    Shoallusertime
};
