import {getElement, setStorageItem, displayMessage} from './utils.js';

const setTaskManager = (tasks) => {

    const tasksDOM = getElement('.tasks-container');
    const form = getElement('.task-form');
    const input = getElement('.task-form input');
    const submitBtn = getElement('.add-task-btn');
    const clearBtn = getElement('.clear-btn');
    const filters = getElement('.filters');
    let editElem = null;
    let editFlag = false;
    let filteredElems = null;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const value = input.value;
        const id = new Date().getTime();
        if (!value) {
            displayMessage('alarm', 'Please, enter value!');
        } else if (editFlag) {
            displayMessage('notice', 'Task edited!');
            editElem.textContent = value;
            const taskItem = tasks.find(task => task.id == editElem.parentElement.dataset.id);
            taskItem.value = value;
            setEditToDefault();
            setStorageItem('tasks', tasks);
        } else {
            const taskItem = {id, value, done: false};
            tasks.push(taskItem);
            if (filteredElems) {
                filteredElems.push(taskItem);
                displayTasks(filteredElems);
            } else {
                displayTasks(tasks);
            }
            displayMessage('notice', 'Task added!');
            input.value = '';
            countTasks(); 
            setStorageItem('tasks', tasks);
        }
    });

    clearBtn.addEventListener('click', () => {
        if (editFlag) setEditToDefault();
        if (!tasksDOM.querySelector('.task')) {
            displayMessage('alarm', 'Nothing to clear!'); 
        } else {
            if (filteredElems) {
                tasks = tasks.filter(task => !filteredElems.includes(task));
                filteredElems = [];
            } else {
                tasks = [];
            }
            displayMessage('notice', 'All is cleared!');
            displayTasks();
            countTasks();
            setStorageItem('tasks', tasks);
        }
    });

    tasksDOM.addEventListener('click', event => {
        // Delete task
        if (event.target.closest('.delete-task-btn')) {
            if (editFlag) setEditToDefault();
            const button = event.target.closest('.delete-task-btn');
            const parent = button.parentElement.parentElement;
            parent.addEventListener('transitionend', () => {
                parent.remove();
                if (!tasksDOM.children.length) tasksDOM.innerHTML = '<p class="no-tasks">No tasks...</p>';
            });
            tasks = tasks.filter(task => task.id != parent.dataset.id);
            displayMessage('notice', 'Task deleted');
            parent.classList.add('delete');
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
            if (editFlag) setEditToDefault();
            const button = event.target.closest('.do-task-btn');
            const parent = button.parentElement.parentElement;
            const taskItem = tasks.find(task => task.id == parent.dataset.id);
            parent.classList.toggle('done');
            if (parent.classList.contains('done')) {
                displayMessage('notice', 'Task is done!');
                taskItem.done = true;
            } else {
                displayMessage('notice', 'Task is active!');
                taskItem.done = false;
            }
            countTasks();
            setStorageItem('tasks', tasks);
        }
    });

    filters.addEventListener('change', event => {
        if (editFlag) setEditToDefault();
        const value = event.target.value;
        switch (value) {
            case 'all':
                filteredElems = null;
                displayTasks(tasks);
                break;
            case 'active':
                filteredElems = tasks.filter(task => !task.done);
                displayTasks(filteredElems);
                break;
            case 'done':
                filteredElems = tasks.filter(task => task.done);
                displayTasks(filteredElems);
                break;   
        }
    });

    function displayTasks (items = []) {
        if (!items.length) {
            tasksDOM.innerHTML = '<p class="no-tasks">No tasks...</p>';
        } else {
            tasksDOM.innerHTML = '';
            items.forEach(item => addTaskDOM(item.value, item.id, item.done));
        }
    }

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

    function setEditToDefault () {
        input.value = '';
        input.blur();
        submitBtn.textContent = 'Add task';
        editElem = null;
        editFlag = false;
    }

    displayTasks(tasks);
    countTasks();

};

export default setTaskManager;