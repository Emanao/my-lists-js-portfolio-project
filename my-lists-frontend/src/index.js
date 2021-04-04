document.addEventListener("DOMContentLoaded", myListsOnLoad);

function myListsOnLoad() {
    console.log("myListsOnLoad");
    document.querySelectorAll("#navbar a").forEach(navbarItem => navbarItem.addEventListener('click', handleToggle));
}

function handleToggle(event) {
    event.preventDefault();
    let addListNavbar = document.querySelector("#toggle-list");
    let addURLNavbar = document.querySelector("#toggle-address");
    let listForm = document.getElementById("list-form");
    let websiteForm = document.getElementById("website-form");

    if (addListNavbar === event.target) {
        toggleForm(listForm);
        websiteForm.style.display = "none"
    } else if (addURLNavbar === event.target) {
        toggleForm(websiteForm);
        listForm.style.display = "none"
    }

    console.log("in handleNavClick");

}

function toggleForm(form) {
    let isVisible = form.style.display
    if (!isVisible || isVisible === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}