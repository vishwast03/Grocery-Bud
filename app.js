// ***** SELECT ITEMS *****
const alertContainer = document.querySelector('.alert-container');
const alert = document.querySelector('.alert');
const groceryForm = document.querySelector('.grocery-form');
const groceryInput = document.querySelector('#grocery');
const submitBtn = document.querySelector('#submit-btn');
const groceryContainer = document.querySelector('.grocery-container');
const groceryList = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('#clear-btn');

// edit options
let editElement;
let editFlag = false;
let editId = "";

// ***** EVENT LISTENERS *****
// add items
groceryForm.addEventListener('submit', addItems);

// clear all items
clearBtn.addEventListener('click', clearAllItems);

// ***** FUNCTIONS *****
function addItems(e) {
    e.preventDefault();
    const value = groceryInput.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        // create element
        const element = document.createElement('article');
        let att = document.createAttribute('data-id');
        att.value = id;
        element.setAttributeNode(att);
        element.classList.add('grocery-item');
        element.innerHTML = `<p class="grocery-title">${value}</p>
                            <div class="button-container">
                                <button class="edit-btn">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="delete-btn">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>`;
        // add event listeners
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem);
        const editBtn = element.querySelector('.edit-btn');
        editBtn.addEventListener('click', editItem);

        // append element to list
        groceryList.appendChild(element);

        // show alert
        showAlert('item added', 'success');

        // show grocery list
        groceryContainer.classList.add('show-grocery-list');

        // local storage
        addItemToLocalStorage(id, value);

        // set back to default
        setBackToDefault();
    }
    else if (value && editFlag) {
        // edit element
        editElement.textContent = value;
        showAlert('item changed', 'success');
        
        // edit in local storage
        editItemInLocalStorage(editId, value);

        // set back to default
        setBackToDefault();
    }
    else {
        showAlert('please add some value', 'danger');
    }
}

// show alert
function showAlert(text, type) {
    alert.textContent = text;
    alertContainer.classList.add(`alert-${type}`);

    // remove alert
    setTimeout(() => {
        alert.textContent = '';
        alertContainer.classList.remove(`alert-${type}`);
    }, 2000);
}

// delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    groceryList.removeChild(element);

    if (groceryList.children.length === 0) {
        groceryContainer.classList.remove('show-grocery-list');
    }

    showAlert('item removed', 'danger');

    setBackToDefault();

    // remove from local storage
    removeItemFromLocalStorage(id);
}

// edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;

    editElement = e.currentTarget.parentElement.previousElementSibling;
    groceryInput.value = editElement.textContent;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';
}

// clear all items
function clearAllItems() {
    // clear items
    groceryList.innerHTML = '';
    groceryContainer.classList.remove('show-grocery-list');

    showAlert('all items removed', 'danger');

    setBackToDefault();

    // clear all items form local storage
    localStorage.setItem('grocery-bud', JSON.stringify([]));
}

// set default
function setBackToDefault() {
    groceryInput.value = '';
    submitBtn.textContent = 'submit';
    editFlag = false;
    editId = '';
}

// ***** LOCAL STORAGE *****
// add items to local storage
function addItemToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getItemsFormLocalStorage();

    items.push(grocery);

    localStorage.setItem('grocery-bud', JSON.stringify(items));
}

// remove item from local storage
function removeItemFromLocalStorage(id) {
    let items = getItemsFormLocalStorage();
    items = items.filter(item => {
        if(item.id !== id)
            return item;
    });

    localStorage.setItem('grocery-bud', JSON.stringify(items));
}

// edit item in local storage
function editItemInLocalStorage(id, value) {
    let items = getItemsFormLocalStorage();

    items = items.map(item => {
        if(item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem('grocery-bud', JSON.stringify(items));
}

// get items from local storage
function getItemsFormLocalStorage() {
    let items = localStorage.getItem('grocery-bud');
    return items ? JSON.parse(items) : [];
}

// ***** SETUP ITEMS *****
let items = getItemsFormLocalStorage();

if(items.length > 0) {
    items.forEach(item => {
        createItem(item.id, item.value);
    });
    groceryContainer.classList.add('show-grocery-list');
}

function createItem(id, value) {
    const element = document.createElement('article');
    let att = document.createAttribute('data-id');
    att.value = id;
    element.setAttributeNode(att);
    element.classList.add('grocery-item');
    element.innerHTML = `<p class="grocery-title">${value}</p>
                        <div class="button-container">
                            <button class="edit-btn">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="delete-btn">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>`;
    
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    groceryList.appendChild(element);
}