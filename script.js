document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks');
    const sun = document.getElementById('sun');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const createTaskButton = document.getElementById('create-task');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close');
    const saveTaskButton = document.getElementById('save-task');
    const taskList = document.getElementById('task-list');
    let currentTask = null;
    let startTime;
    let running = false;
    let timerInterval;
    const sunImages = {
        rising: 'images/sun_rising.png',
        midday: 'images/sun_midday.png',
        setting: 'images/sun_setting.png'
    };
    const moonImages = {
        rising: 'images/moon_rising.png',
        full: 'images/moon_full.png',
    };

    // Initial tasks
    const initialTasks = [
        { name: 'Work', duration: 6 },
        { name: 'Meditation', duration: 1 }
    ];

    initialTasks.forEach(task => createTaskElement(task.name, task.duration));

    // Function to create task element
    function createTaskElement(name, duration) {
        const newTask = document.createElement('div');
        newTask.className = 'task';
        newTask.innerHTML = `
            <span class="time"></span>
            <span class="name">${name}</span>
            <span class="duration">${duration}h</span>
        `;
        newTask.addEventListener('click', () => {
            document.querySelectorAll('.task').forEach(t => t.classList.remove('active'));
            newTask.classList.add('active');
            currentTask = newTask;
        });
        tasksContainer.appendChild(newTask);
    }

    // Function to update timer display
    function updateTimer() {
        const elapsedTime = moment.duration(moment().diff(startTime));
        const hours = String(Math.floor(elapsedTime.asHours())).padStart(2, '0');
        const minutes = String(elapsedTime.minutes()).padStart(2, '0');
        if (currentTask) {
            const timeElement = currentTask.querySelector('.time');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // Function to update sun position based on the time of day
    function updateSunPosition() {
        const now = new Date();
        const hours = now.getHours();
        const sunY = (hours / 24) * window.innerHeight;

        if (hours >= 5 && hours < 12) {
            sun.style.backgroundImage = `url(${sunImages.rising})`;
        } else if (hours >= 12 && hours < 16) {
            sun.style.backgroundImage = `url(${sunImages.midday})`;
        } else if (hours >= 16 && hours < 18) {
            sun.style.backgroundImage = `url(${sunImages.setting})`;
        } else if (hours >= 18 && hours < 20) {
            sun.style.backgroundImage = `url(${moonImages.rising})`;
        } else if (hours >= 20 || hours < 5) {
            sun.style.backgroundImage = `url(${moonImages.full})`;
        }
        sun.style.top = `${sunY}px`;
    }

    setInterval(updateSunPosition, 1000);

    // Start timer
    startButton.addEventListener('click', () => {
        if (currentTask && !running) {
            const currentTime = currentTask.querySelector('.time').textContent.split(':').map(Number);
            startTime = moment().subtract(currentTime[0], 'hours').subtract(currentTime[1], 'minutes');
            running = true;
            timerInterval = setInterval(updateTimer, 1000);
        }
    });

    // Pause timer
    pauseButton.addEventListener('click', () => {
        if (running) {
            clearInterval(timerInterval);
            running = false;
        }
    });

    // Reset timer
    resetButton.addEventListener('click', () => {
        if (currentTask) {
            currentTask.querySelector('.time').textContent = '';
            clearInterval(timerInterval);
            running = false;
        }
    });

    // Open create task modal
    createTaskButton.addEventListener('click', () => {
        taskModal.style.display = 'block';
        updateTaskList();
    });

    // Close create task modal
    closeModal.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    // Save new task
    saveTaskButton.addEventListener('click', () => {
        const taskName = document.getElementById('task-name').value;
        const taskDuration = document.getElementById('task-duration').value;
        if (taskName && taskDuration) {
            createTaskElement(taskName, taskDuration);
            taskModal.style.display = 'none';
            updateTaskList();
        }
    });

    // Update task list in the modal
    function updateTaskList() {
        taskList.innerHTML = '';
        const tasks = document.querySelectorAll('.task');
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                ${task.querySelector('.name').textContent} - ${task.querySelector('.duration').textContent}
                <button class="delete-task" data-index="${index}">Delete</button>
            `;
            taskItem.querySelector('.delete-task').addEventListener('click', () => {
                task.remove();
                updateTaskList();
            });
            taskList.appendChild(taskItem);
        });
    }
});
