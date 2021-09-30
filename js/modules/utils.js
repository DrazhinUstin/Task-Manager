const getElement = selector => {
    const elem = document.querySelector(selector);
    return elem ? elem : `Sorry, there is no element with selector ${selector}`;
};

const getStorageItem = (key) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

const setStorageItem = (key, item) => {
    return localStorage.setItem(key, JSON.stringify(item));
};

const setDate = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    const date = formatter.format(new Date());
    getElement('.date').textContent = date;
};

const setTime = () => {
    const date = new Date();
    const format = value => value < 10 ? `0${value}` : value;
    let hours = date.getHours();
    hours = format(hours);
    let minutes = date.getMinutes();
    minutes = format(minutes);
    let seconds = date.getSeconds();
    seconds = format(seconds);
    getElement('.time').textContent = `${hours}:${minutes}:${seconds}`;
    setTimeout(setTime, 1000);
};

const displayMessage = (className, message) => {
    const messageDOM = getElement('.message-area');
    messageDOM.classList.add(className);
    messageDOM.textContent = message;
    setTimeout(() => {
        messageDOM.classList.remove(className);
        messageDOM.textContent = '';
    }, 800);
};

export {getElement, getStorageItem, setStorageItem, setDate, setTime, displayMessage};
