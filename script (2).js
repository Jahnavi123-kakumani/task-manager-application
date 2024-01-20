document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false
    };

    const listItem = createTaskListItem(task);

    taskList.appendChild(listItem);
    saveTask(task);

    taskInput.value = "";
}

function createTaskListItem(task) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
        <div>
            <button onclick="toggleTask(${task.id})">Toggle</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    return listItem;
}

function toggleTask(taskId) {
    const taskList = document.getElementById("taskList");
    const task = getTaskById(taskId);

    task.completed = !task.completed;

    clearTaskList();
    taskList.innerHTML = getSortedTasksHTML();
    saveTasks();
}

function editTask(taskId) {
    const taskList = document.getElementById("taskList");
    const task = getTaskById(taskId);
    const newText = prompt("Edit task:", task.text);

    if (newText !== null) {
        task.text = newText;
        clearTaskList();
        taskList.innerHTML = getSortedTasksHTML();
        saveTasks();
    }
}

function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const taskList = document.getElementById("taskList");
        const task = getTaskById(taskId);

        taskList.removeChild(document.getElementById(taskId.toString()));
        deleteTaskById(taskId);
        saveTasks();
    }
}

function loadTasks() {
    const taskList = document.getElementById("taskList");
    const tasks = getTasks();

    clearTaskList();

    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks available.</p>";
        return;
    }

    taskList.innerHTML = getSortedTasksHTML();
}

function clearTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
}

function getSortedTasksHTML() {
    const tasks = getTasks();
    const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

    return sortedTasks.map(task => createTaskListItem(task).outerHTML).join("");
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function getTaskById(taskId) {
    const tasks = getTasks();
    return tasks.find(task => task.id === taskId);
}

function saveTasks() {
    const tasks = getTasks();
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks();
}

function deleteTaskById(taskId) {
    const tasks = getTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
