const token = localStorage.getItem("token");

// Protect page
if (!token) {
    window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

const taskList = document.getElementById("taskList");

// Load tasks
async function loadTasks() {
    try {
        const res = await fetch("http://localhost:4000/tasks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const tasks = await res.json();
        taskList.innerHTML = "";

        if (tasks.length === 0) {
            taskList.innerHTML = "<li style='text-align: center; color: #7f8c8d;'>No tasks yet. Create one to get started!</li>";
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement("li");
            
            // Priority indicator
            const priorityIndicator = document.createElement("span");
            priorityIndicator.style.marginRight = "10px";
            priorityIndicator.style.fontSize = "12px";
            
            switch(task.priority) {
                case "high":
                    priorityIndicator.textContent = "🔴";
                    priorityIndicator.title = "High Priority";
                    break;
                case "medium":
                    priorityIndicator.textContent = "🟡";
                    priorityIndicator.title = "Medium Priority";
                    break;
                default:
                    priorityIndicator.textContent = "🔵";
                    priorityIndicator.title = "Low Priority";
            }
            
            const taskText = document.createElement("span");
            taskText.textContent = task.title;
            taskText.id = `task-text-${task._id}`;
            
            if (task.completed) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "#95a5a6";
            }

            const buttonsDiv = document.createElement("div");
            buttonsDiv.style.display = "flex";

            const completeBtn = document.createElement("button");
            completeBtn.textContent = task.completed ? "↩️ Undo" : "✓ Done";
            completeBtn.onclick = () => toggleComplete(task._id, task.completed);

            const editBtn = document.createElement("button");
            editBtn.textContent = "✏️ Edit";
            editBtn.style.background = "#f39c12";
            editBtn.onclick = () => startEditTask(task._id, task.title, task.priority);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️ Delete";
            deleteBtn.style.background = "#e74c3c";
            deleteBtn.onclick = () => deleteTask(task._id);

            buttonsDiv.appendChild(completeBtn);
            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(deleteBtn);

            li.appendChild(priorityIndicator);
            li.appendChild(taskText);
            li.appendChild(buttonsDiv);
            taskList.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading tasks:", err);
        taskList.innerHTML = "<li style='color: red;'>Failed to load tasks. Please refresh the page.</li>";
    }
}

loadTasks();

// Add task
document.getElementById("addTaskBtn").addEventListener("click", async () => {
    const title = document.getElementById("taskInput").value.trim();
    const priority = document.getElementById("prioritySelect").value;

    if (!title) {
        alert("Please enter a task");
        return;
    }

    try {
        const res = await fetch("http://localhost:4000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, priority })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Server responded with error:", data);
            alert(`Failed to add task: ${data.message || "Unknown error"}`);
            return;
        }

        console.log("Task added successfully:", data);
        document.getElementById("taskInput").value = "";
        loadTasks();
    } catch (err) {
        console.error("Error adding task:", err);
        alert(`Failed to add task: ${err.message}`);
    }
});

// Toggle complete
async function toggleComplete(id, currentState) {
    try {
        const res = await fetch(`http://localhost:4000/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !currentState })
        });

        if (!res.ok) {
            throw new Error(`Failed to update task: ${res.status}`);
        }

        loadTasks();
    } catch (err) {
        console.error("Error updating task:", err);
        alert("Failed to update task. Please try again.");
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const res = await fetch(`http://localhost:4000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to delete task: ${res.status}`);
        }

        loadTasks();
    } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task. Please try again.");
    }
}

// Edit task functions
function startEditTask(id, currentTitle, currentPriority) {
    const taskText = document.getElementById(`task-text-${id}`);
    const originalText = taskText.textContent;
    
    // Create input field for title
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentTitle;
    input.id = `edit-input-${id}`;
    input.style.width = "50%";
    input.style.marginRight = "10px";
    
    // Create priority selector
    const prioritySelect = document.createElement("select");
    prioritySelect.id = `edit-priority-${id}`;
    prioritySelect.style.marginRight = "10px";
    prioritySelect.style.padding = "8px";
    prioritySelect.style.border = "1px solid #bdc3c7";
    prioritySelect.style.borderRadius = "4px";
    
    const priorities = [
        { value: "low", label: "🔵 Low" },
        { value: "medium", label: "🟡 Medium" },
        { value: "high", label: "🔴 High" }
    ];
    
    priorities.forEach(priority => {
        const option = document.createElement("option");
        option.value = priority.value;
        option.textContent = priority.label;
        if (priority.value === currentPriority) {
            option.selected = true;
        }
        prioritySelect.appendChild(option);
    });
    
    // Create save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save";
    saveBtn.style.background = "#27ae60";
    saveBtn.onclick = () => saveEditTask(id);
    
    // Create cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌ Cancel";
    cancelBtn.style.background = "#95a5a6";
    cancelBtn.onclick = () => cancelEditTask(id, originalText);
    
    // Replace task text with input and buttons
    const li = taskText.parentElement;
    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(prioritySelect);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    
    input.focus();
    input.select();
}

async function saveEditTask(id) {
    const input = document.getElementById(`edit-input-${id}`);
    const prioritySelect = document.getElementById(`edit-priority-${id}`);
    const newTitle = input.value.trim();
    const newPriority = prioritySelect.value;
    
    if (!newTitle) {
        alert("Task title cannot be empty");
        return;
    }
    
    try {
        const res = await fetch(`http://localhost:4000/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title: newTitle, priority: newPriority })
        });

        if (!res.ok) {
            throw new Error(`Failed to update task: ${res.status}`);
        }

        loadTasks();
    } catch (err) {
        console.error("Error updating task:", err);
        alert("Failed to update task. Please try again.");
    }
}

function cancelEditTask(id, originalText) {
    loadTasks(); // Simply reload to cancel editing
}