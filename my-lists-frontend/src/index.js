const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`
const RESOURCES_URL = `${BASE_URL}/resources`
document.addEventListener("DOMContentLoaded", myListsOnLoad);

function myListsOnLoad() {
    console.log("myListsOnLoad");
    initListeners();
    initializeDatalist();
}

function initListeners() {
    console.log("initListeners");
    addListNavbarListeners();
    addFormBtnListeners();
}

function addListNavbarListeners() {
    /* Navbar links open specific content/forms*/
    document.getElementById("add-list")
        .addEventListener('click', event => navbarOnClick(event, document.getElementById("list-form")));
    document.getElementById("add-address")
        .addEventListener('click', event => navbarOnClick(event, document.getElementById("website-form")));
}

function addFormBtnListeners() {
    document.querySelector("#list-form button").addEventListener("click", addListOnSubmit);
    document.querySelector("#website-form button").addEventListener("click", addWebsiteOnSubmit);
}

function navbarOnClick(event, targetForm) {
    let targetTab = event.target;
    /* Hide all other forms but the one passed as argument */
    document.querySelectorAll(".forms-container form").forEach(function(form) {
        if (form !== targetForm) {
            form.style.display = "none";
            resetInputFieldsforForm(form);

        }
    });
    /* setup default color (blue) for all the tabs but the one being targeted */
    document.querySelectorAll(".tablinks a").forEach(function(tab) {
        if (tab !== targetTab) {
            tab.style.color = "rgb(65, 145, 225)";
        }
    });
    /*toggle form and tab color*/
    if (isFormHidden(targetForm)) {
        targetTab.style.color = "white";
        targetForm.style.display = "block";

    } else {
        targetForm.style.display = "none";
        targetTab.style.color = rgb(65, 145, 225);
    }
}

function resetInputFieldsforForm(form) {
    console.log(form.id)
    document.querySelectorAll(`#${form.id} input`).forEach(input => input.value = "")
}

function isFormHidden(form) {
    return form.style.display === "" || form.style.display === "none";
}

function addListOnSubmit(ev) {
    ev.preventDefault();
    const formInput = document.querySelector("#list-form input");
    const confObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ name: formInput.value })
    }
    fetch(LISTS_URL, confObj)
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(json => addDataListEntry(json))
        .catch(error => console.error("There has been problems with the fetch operation:", error));

    console.log("Add List submitted");

}

function addWebsiteOnSubmit(ev) {
    ev.preventDefault();
    const website = document.querySelector("#website-form input[type=text]");
    const datalist = document.querySelector("#website-form input[list]");
    const selectedOption = Array.from(datalist.list.options).find(option => datalist.value === option.value);
    const list_id = selectedOption.dataset.listId;
    console.log(`website: ${website.value} list_id ${list_id} `)
    const confObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ address: website.value })
    }
    fetch(`${LISTS_URL}/${list_id}/resources`, confObj)
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(json => console.log(json))
        .catch(error => console.error("There has been problems with the fetch operation:", error));

    console.log("Website submitted");

}

function initializeDatalist() {
    console.log("initializeDatalist");
    let dataListNode = document.querySelector("#datalist-lists");
    let datalistOptions = dataListNode.children;
    for (const option of datalistOptions) {
        option.remove();
    }
    fetch(LISTS_URL)
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json()
        })
        .then(json => json.forEach(list => addDataListEntry(list)))
        .catch(error => console.error("There has been problems with the fetch operation:", error));
}

function addDataListEntry(listItem) {
    console.log("addDataListEntry");
    let dataList = document.querySelector("#datalist-lists");
    let datalistOption = document.createElement("option");
    datalistOption.setAttribute("data-list-id", listItem.id);
    datalistOption.setAttribute("value", listItem.name);
    dataList.appendChild(datalistOption);
    return dataList;
}