const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`
const WEBSITES_URL = `${BASE_URL}/websites`
document.addEventListener("DOMContentLoaded", myListsOnLoad);

function myListsOnLoad() {
    console.log("myListsOnLoad");
    initListeners();
}

function initListeners() {
    addListNavbarListeners();
    addFormBtnListeners();
}

function addListNavbarListeners() {
    document.getElementById("toggle-list").addEventListener('click', toggleListForm);
    document.getElementById("toggle-address").addEventListener('click', toggleWebsiteForm);
}

function addFormBtnListeners() {
    document.querySelector("#list-form .button").addEventListener("click", addListFetch);
}

function toggleListForm(ev) {
    ev.preventDefault();
    let addListNavbar = document.querySelector("#toggle-list");
    let listForm = document.getElementById("list-form");
    toggleForm(listForm);
    document.getElementById("website-form").style.display = "none";
}

function toggleWebsiteForm(ev) {
    ev.preventDefault();
    let addURLNavbar = document.querySelector("#toggle-address");
    let websiteForm = document.getElementById("website-form");
    toggleForm(websiteForm);
    document.getElementById("list-form").style.display = "none";

}

function toggleForm(form) {
    let isVisible = form.style.display
    if (!isVisible || isVisible === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
    console.log("in toggleForm");

}

function addListFetch(ev) {
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
    fetch(LISTS_URL, confObj).then(res => console.log(res.json()))

    console.log("Add List submitted");

}