
const alert = document.querySelector('.alert');
const groceryForm = document.querySelector('.grocery__form');
const groceryInput = document.getElementById('grocery__input');
const submitBtn = document.getElementById('submit__btn');
const itemsList = document.querySelector('.items');
const clearContainer = document.querySelector('.clear__btn');
const clearBtn = document.getElementById('clear');

let editChild;
let editCase = false;
let editElementId = '';

// *************** Event Listeners ****************
groceryForm.addEventListener('submit', addItem);
window.addEventListener('DOMContentLoaded', displayItems);
clearBtn.addEventListener('click', clearItems);
// ***************** Functions ********************
// add Item
function addItem(e) {
    e.preventDefault();
    let value = groceryInput.value;
    let id = new Date().getTime().toString();
    if (value && !editCase) {
        let li = document.createElement('li');
        let attr = document.createAttribute('data-id');
        attr.value = id;
        li.setAttributeNode(attr);
        li.classList.add('item');
        li.innerHTML = `
            <h3 class="item__title">${value}</h3>
            <div class="btns__container">
                <button type="button" id="edit__btn">
                    <img src="./assets/pen.png" alt="Edit Icon" height="25"/>
                </button>
                <button type="button" id="delete__btn">
                    <img src="./assets/delete.png" alt="Delete Icon" height="23" />
                </button>
            </div>
        `;
        itemsList.appendChild(li);
        itemsList.classList.add('show__items');
        defualt();
        addToLocalStorage(id, value);
        showClear();
        const deleteBtn = li.querySelector('#delete__btn');
        deleteBtn.addEventListener('click', deleteItem);
        const editBtn = li.querySelector('#edit__btn');
        editBtn.addEventListener('click', editItem);
        scrollItems();
        displayAlert('Item added', "success");
    } else if (value && editCase) {
        editChild.innerText = value;
        editOnLocalStorage(editElementId, value);
        defualt();
        displayAlert('edit item', "success");
    } else {
        displayAlert('enter item first', 'danger');
    }
}
// add to localstorage
function addToLocalStorage(id, value) {
    let item = {id, value};
    let items = localStorage.list?JSON.parse(localStorage.list):[];
    items.push(item);
    items = JSON.stringify(items);
    localStorage.list = items;
}
// display alert
function displayAlert(text, action) {
    alert.innerText = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.innerText = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}
// set back to defualt
function defualt() {
    groceryInput.value = "";
    submitBtn.value = "Submit";
    editCase = false;
    editElementId = "";
};
// show clear button
function showClear() {
    let items = document.querySelectorAll('ul li');
    if (items.length > 1) {
        clearContainer.classList.add('show__clear');
    } else {
        clearContainer.classList.remove('show__clear');
    }
}
// delete item
function deleteItem(e) {
    let element = e.currentTarget.parentElement.parentElement;
    let elementId = element.dataset.id;
    itemsList.removeChild(element);
    deleteFromLocalStorage(elementId);
    showClear();
    scrollItems();
    displayAlert('item deleted', 'danger');
}
function deleteFromLocalStorage(id) {
    let items = JSON.parse(localStorage.list);
    items = items.filter(item => {
        if(item.id != id ) {
            return item;
        }
    });
    items = JSON.stringify(items);
    localStorage.list = items;
}
// edit item
function editItem(e) {
    let element = e.currentTarget.parentElement.parentElement;
    editElementId = element.dataset.id;
    editChild = element.firstElementChild;
    groceryInput.value = editChild.innerHTML;
    editCase = true;
    submitBtn.value = "Edit";
}
function editOnLocalStorage(id, value) {
    let items = JSON.parse(localStorage.list);
    items = items.map(item => {
        if(item.id == id) {
            item.value = value;
        }
        return item;
    });
    items = JSON.stringify(items);
    localStorage.list = items;
}
// display items when refresh or close page or brawser
function  displayItems() {
    let items = localStorage.list?JSON.parse(localStorage.list):[];
    items.forEach(item => {
        let value = item.value;
        let id = item.id;
        let li = document.createElement('li');
        let attr = document.createAttribute('data-id');
        attr.value = id;
        li.setAttributeNode(attr);
        li.classList.add('item');
        li.innerHTML = `
            <h3 class="item__title">${value}</h3>
            <div class="btns__container">
                <button type="button" id="edit__btn">
                    <img src="./assets/pen.png" alt="Edit Icon" height="25"/>
                </button>
                <button type="button" id="delete__btn">
                    <img src="./assets/delete.png" alt="Delete Icon" height="23" />
                </button>
            </div>
        `;
        itemsList.appendChild(li);
        itemsList.classList.add('show__items');
        showClear();
        defualt();
        const deleteBtn = li.querySelector('#delete__btn');
        deleteBtn.addEventListener('click' ,deleteItem);
        const editBtn = li.querySelector('#edit__btn');
        editBtn.addEventListener('click', editItem); 
        scrollItems();
    });
};
// clear Items
function clearItems() {
    let items = itemsList.querySelectorAll('.item');
    if(itemsList.children.length !== 0) {
        items.forEach(item => {
            itemsList.removeChild(item);
        });
    }
    itemsList.classList.remove('show__list');
    localStorage.removeItem('list');
    showClear();
    defualt();
    scrollItems();
    displayAlert('items deleted', 'danger');
}
// scroll items 
function scrollItems() {
    if (itemsList.children.length > 5){
        itemsList.classList.add('items__scroll');
    } else {
        itemsList.classList.remove('items__scroll');
    }
}