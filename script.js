// Initialize unique ID generator
const uid = new ShortUniqueId();

// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedPriority = 'medium'; // Default priority

// DOM Elements
const modal = document.getElementById('taskModal');
const addButton = document.querySelector('.add');
const deleteButton = document.querySelector('.delete');
const saveButton = document.querySelector('.modal-content .save');
const cancelButton = document.querySelector('.modal-content .cancel');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const grid = document.querySelector('.grid');
const priorityOptions = document.querySelectorAll('.priority-option');

// Modal handling
function showModal() {
    modal.style.display = 'block';
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    selectedPriority = 'medium';
    updatePrioritySelection();
}

function hideModal() {
    modal.style.display = 'none';
}

function saveTask() {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const newTask = {
        id: uid(),
        title,
        description,
        priority: selectedPriority,
        selected: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    hideModal();
}

// Event Listeners
function setupEventListeners() {
    addButton.addEventListener('click', showModal);
    cancelButton.addEventListener('click', hideModal);
    saveButton.addEventListener('click', saveTask);

    // Priority selection
    priorityOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            selectedPriority = e.target.dataset.priority;
            updatePrioritySelection();
        });
    });
}

function updatePrioritySelection() {
    priorityOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.priority === selectedPriority) {
            option.classList.add('selected');
        }
    });
}

// Render Tasks
function renderTasks() {
    grid.innerHTML = tasks.length === 0 
        ? `<div class="empty-state">
            <span class="material-icons">note_add</span>
            <p>No tasks yet. Click the + button to add one!</p>
           </div>`
        : '';

    tasks.forEach(task => {
        const ticket = createTicketElement(task);
        grid.appendChild(ticket);
    });
}

function createTicketElement(task) {
    const ticket = document.createElement('div');
    ticket.className = `ticket ${task.selected ? 'selected' : ''}`;
    ticket.draggable = true;
    ticket.dataset.id = task.id;

    ticket.innerHTML = `
        <div class="ticket-color ${task.priority}"></div>
        <div class="ticket-id">#${task.id}</div>
        <div class="ticket-title">${task.title}</div>
        <div class="ticket-description">${task.description}</div>
    `;

    return ticket;
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize the app
setupEventListeners();
renderTasks();