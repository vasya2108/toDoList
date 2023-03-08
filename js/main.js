//находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((item) => renderTask(item));
}

form.addEventListener('submit', addTask);

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);

function addTask(evt) {
    evt.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);
    
    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();
    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(evt) {
    evt.preventDefault();
    if (evt.target.dataset.action === 'delete') {
        
        const parentNode = evt.target.closest('.list-group-item');
        const id = Number(parentNode.id);

        tasks = tasks.filter((item) => item.id !== id);

        // const index = tasks.findIndex((item) => item.id === id);
        // tasks.splice(index, 1);

        parentNode.remove();
        checkEmptyList();
        saveToLocalStorage();
    }

}

function doneTask(evt) {
    evt.preventDefault();
    if (evt.target.dataset.action === 'done') {
        const parentNode = evt.target.closest('.list-group-item');

        const id = Number(parentNode.id);
        const task = tasks.find((item) => item.id === id);

        task.done = !task.done;

        console.log(task)

        parentNode.querySelector('.task-title').classList.toggle('task-title--done');
        saveToLocalStorage();
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <div id="emptyList">Список дел пуст</div>
        `;
        tasksList.parentElement.insertAdjacentHTML('beforebegin',emptyListHTML);
    } else {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove(): null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `
        <li id="${task.id}" class="list-group-item task">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" class="button-action" data-action="done">Готово</button>
                <button type="button" class="button-action" data-action="delete">Удалить</button>
            </div>
        </li>
    `;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

checkEmptyList();

