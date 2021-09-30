import {getElement, setStorageItem, displayMessage} from './utils.js';

const setTaskManager = (tasks) => {

    const tasksDOM = getElement('.tasks-container');
    const clearBtn = getElement('.clear-btn');
    const submitBtn = getElement('.add-task-btn');
    const form = getElement('.task-form');
    const input = getElement('.task-form input');
    let editElem = null;
    let editFlag = false;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const value = input.value;
        const id = new Date().getTime();
        if (!value) {
            displayMessage('alarm', 'Please, add some value!');
        } else if (editFlag) {
            displayMessage('notice', 'Task edited!');
            editElem.textContent = value;
            const taskItem = tasks.find(task => task.id == editElem.parentElement.dataset.id);
            taskItem.value = value;
            setBackToDefault();
            setStorageItem('tasks', tasks);
        } else {
            displayMessage('notice', 'Task added!');
            addTaskDOM(value, id);
            input.value = '';
            const taskItem = {id, value, done: false};
            tasks.push(taskItem);
            countTasks(); 
            setStorageItem('tasks', tasks);
        }
    });

    clearBtn.addEventListener('click', () => {
        if (editFlag) setBackToDefault();
        if (tasksDOM.children.length === 0) {
            displayMessage('alarm', 'Nothing to clear!'); 
        } else {
            displayMessage('notice', 'All is cleaned');
            [...tasksDOM.children].forEach(task => task.remove());
            tasks = [];
            countTasks();
            setStorageItem('tasks', tasks);
        }
    });

    tasksDOM.addEventListener('click', event => {
        // Delete task
        if (event.target.closest('.delete-task-btn')) {
            if (editFlag) setBackToDefault();
            const button = event.target.closest('.delete-task-btn');
            const parent = button.parentElement.parentElement;
            parent.addEventListener('transitionend', () => parent.remove());
            displayMessage('notice', 'Task deleted');
            parent.classList.add('delete');
            tasks = tasks.filter(task => task.id != parent.dataset.id);
            countTasks();
            setStorageItem('tasks', tasks);
        }
        // Edit task
        if (event.target.closest('.edit-task-btn')) {
            const button = event.target.closest('.edit-task-btn');
            const parent = button.parentElement;
            if (parent.parentElement.classList.contains('done')) {
                displayMessage('alarm', 'This task is done!');
            } else {
                input.value = parent.previousElementSibling.textContent;
                input.focus();
                submitBtn.textContent = 'Edit task';
                editElem = parent.previousElementSibling;
                editFlag = true;
            }
        }
        // Done task
        if (event.target.closest('.do-task-btn')) {
            if (editFlag) setBackToDefault();
            const button = event.target.closest('.do-task-btn');
            const parent = button.parentElement.parentElement;
            const taskItem = tasks.find(task => task.id == parent.dataset.id);
            parent.classList.toggle('done');
            if (parent.classList.contains('done')) {
                displayMessage('notice', 'Task is done!');
                taskItem.done = true;
                countTasks();
            } else {
                displayMessage('notice', 'Task is active!');
                taskItem.done = false;
                countTasks();
            }
            setStorageItem('tasks', tasks);
        }
    });

    function addTaskDOM (value, id, done) {
        const article = document.createElement('article');
        article.classList.add('task');
        if (done) article.classList.add('done');
        article.setAttribute('data-id', id);
        article.innerHTML = `<p class="task-content">${value}</p>
                            <div class="task-controls">
                                <button class="do-task-btn">
                                    <i class="fas fa-check-circle"></i>
                                </button>
                                <button class="edit-task-btn">
                                    <i class="fas fa-pen-square"></i>
                                </button>
                                <button class="delete-task-btn">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>`;
        tasksDOM.append(article);                    
    }

    function setBackToDefault () {
        input.value = '';
        input.blur();
        submitBtn.textContent = 'Add task';
        editElem = null;
        editFlag = false;
    }

    function countTasks () {
        let activeTasks = 0;
        let doneTasks = 0;
        tasks.forEach(task => {
            if (task.done) doneTasks++;
            else activeTasks++;
        });
        getElement('.active-tasks-amount').textContent = activeTasks;
        getElement('.done-tasks-amount').textContent = doneTasks;
    }

    function displayAllTasks () {
        tasks.forEach(task => addTaskDOM(task.value, task.id, task.done));
    }

    displayAllTasks();
    countTasks();

};

export default setTaskManager;