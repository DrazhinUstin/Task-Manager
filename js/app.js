import * as utils from './modules/utils.js';
import setTaskManager from './modules/setTaskManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const tasks = utils.getStorageItem('tasks');
    setTaskManager(tasks);
    utils.setDate();
    utils.setTime();
});

window.addEventListener('load', utils.hidePreloader);