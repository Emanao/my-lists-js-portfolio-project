const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`
const WEBSITES_URL = `${BASE_URL}/websites`
document.addEventListener("DOMContentLoaded", myListsOnLoad);

function myListsOnLoad() {
    console.log("myListsOnLoad");
    initListeners();
    loadAllListsInDL();
}

function initListeners() {
    console.log("initListeners");
    addListNavbarListeners();
    addFormBtnListeners();
}

function addListNavbarListeners() {
    /* Navbar links open specific content/forms*/
    document.getElementById("add-list")
        .addEventListener('click', (event) => { navbarOnClick(event, document.getElementById("list-form")) }, false);
    document.getElementById("add-address")
        .addEventListener('click', (event) => { navbarOnClick(event, document.getElementById("website-form")) }, false);
}

function addFormBtnListeners() {
    document.querySelector("#list-form .button").addEventListener("click", addListSubmit);
}

function navbarOnClick(event, targetForm) {
    let targetTab = event.target;
    /* Hide all other forms but the one passed as argument */
    document.querySelectorAll(".forms-container form").forEach(function(form) {
        if (form !== targetForm) {
            form.style.display = "none";
        }
    });
    /* setup default color (royalblue) for all the tabs but the one being targeted */
    document.querySelectorAll(".tablinks a").forEach(function(tab) {
        if (tab !== targetTab) {
            tab.style.color = "royalblue";
        }
    });
    /*toggle form and tab color*/
    if (isFormHidden(targetForm)) {
        targetTab.style.color = "white";
        targetForm.style.display = "block";

    } else {
        targetForm.style.display = "none";
        targetTab.style.color = "royalblue";
    }
}

function isFormHidden(form) {
    return form.style.display === "" || form.style.display === "none";
}

function addListSubmit(ev) {
    ev.preventDefault();
    const listNameInpt = document.querySelector("#list-form input").value;
    const confObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ name: listNameInpt })
    }
    fetch(LISTS_URL, confObj)
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(json => addDataList(json))
        .catch(error => console.error("There has been problems with the fetch operation:", error));

    console.log("Add List submitted");

}

function loadAllListsInDL() {
    let dataListNode = document.querySelector("#lists");
    let dlOptions = dataListNode.children;
    for (const option of dlOptions) {
        option.remove();
    }
    console.log(dataListNode);
    fetch(LISTS_URL)
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json()
        })
        .then(json => {
            console.log(json)
            json.forEach(list => addDataList(list));
        })
}

function addDataList(listItem) {
    let dataListNode = document.querySelector("#lists");
    let dlOptionElem = document.createElement("option");
    dlOptionElem.setAttribute("value", listItem.name);
    dataListNode.appendChild(dlOptionElem);
    return dataListNode;
}