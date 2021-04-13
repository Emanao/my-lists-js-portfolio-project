const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`

const htmlTabLinks = document.querySelectorAll(".tablinks a");
const htmlTabForms = document.querySelectorAll(".forms-container form")
const tabBaseColor = "rgb(65, 145, 225)";
const tabActiveColor = "white"

// const RESOURCES_URL = `${BASE_URL}/resources`
document.addEventListener("DOMContentLoaded", myListsOnLoad);

class myListsTabHandler {
    constructor(htmlTab) {
        this._tab = htmlTab;
    }
    get tab() {
        return this._tab;
    }
    set tab(htmlTab) {
        this._tab = htmlTab;
    }
    get formHndlr() {
        return this._form;
    }
    set formHndlr(formHndlr) {
        this._form = formHndlr;
    }

    initListener() {
        console.log("initListener");
        this.tab.addEventListener('click', event => this.onClicked(event));
    }

    activateTab() {
        console.log("activateTab");
        this.tab.style.color = tabActiveColor;

    }

    deactivateTab() {
        console.log("deactivateTab");
        this.tab.style.color = tabBaseColor;
    }

    isTabActive() {
        return this.tab.style.color === tabActiveColor;
    }

    static resetAllTabsProps() {
        console.log("resetAllTabsProps")
            /* setup default color (blue) for all the tabs but the one being targeted */
        htmlTabLinks.forEach(tab => {
            const tabObj = new myListsTabHandler(tab);
            tabObj.deactivateTab();
        });
    }

    onClicked(event) {
        console.log("onClicked");

        /*Save the state before resetting all tabs and forms properties*/
        const isTargetTabActive = this.isTabActive();
        const targetForm = this.formHndlr;
        console.log(this);
        console.log(this.formHndlr);

        myListsTabHandler.resetAllTabsProps();
        myListsFormHandler.resetAllFormsProps();

        /* After resetting the state of all tabs and forms just activate 
        tab and form on when the previous state was inactive */
        if (!isTargetTabActive) {
            this.activateTab();
            targetForm.show();
        }
    }
}
class myListsFormHandler {
    constructor(htmlForm) {
        this._form = htmlForm;
    }
    get form() {
        return this._form;
    }
    set form(htmlForm) {
        this._form = htmlForm;
    }

    initListener() {
        console.log("initListener");
        document.querySelector(`#${this.form.id} button`).addEventListener("click", this.onSubmit);
    }
    static resetAllFormsProps() {
        /* Hide all other forms but the one passed as argument */
        /* Initialize forms color before toggle  */
        htmlTabForms.forEach(form => {
            const formObj = new myListsFormHandler(form);
            formObj.hide();
            formObj.resetInputFields();
        });
    }
    resetInputFields() {
        console.log("resetInputFields");
        console.log(this.form.id);
        document.querySelectorAll(`#${this.form.id} input`).forEach(input => input.value = "")
    }
    hide() {
        console.log("hide form");
        this.form.style.display = "none";
    }
    show() {
        console.log("show form");
        this.form.style.display = "block";
    }
    isActive() {
        return this.form.style.display === "block";
    }
    onSubmit(event) {
        console.log("I was clicked!")
    }

}
class myListsDatalistHandler {
    constructor(htmlDatalist) {
        this._datalist = htmlDatalist;
    }
    get datalist() {
        return this._datalist;
    }
    set datalist(datalist) {
        this._datalist = datalist;
    }
    initialize() {
        console.log("initializeDatalist");
        console.log(this.datalist);
        let datalistOptions = this.datalist.children;
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
            .then(json => json.forEach(list => this.addDataListEntry(list)))
            .catch(error => console.error("There has been problems with the fetch operation:", error));
    }

    addDataListEntry(jsonList) {
        console.log("addDataListEntry");
        console.log(this.datalist);
        let datalistOption = document.createElement("option");
        datalistOption.setAttribute("data-list-id", jsonList.id);
        datalistOption.setAttribute("value", jsonList.name);
        this.datalist.appendChild(datalistOption);
        return this.datalist;
    }
}


function myListsOnLoad() {
    console.log("myListsOnLoad");
    /*AddList objs: tab + form */
    const htmlAddListTab = document.getElementById("add-list");
    const htmlAddListForm = document.getElementById("list-form");

    const addListTab = new myListsTabHandler(htmlAddListTab);
    const addListForm = new myListsFormHandler(htmlAddListForm);

    addListTab.formHndlr = addListForm;
    addListTab.initListener();
    addListForm.initListener();

    /* AddAddress objs: tab + form */
    const htmlAddAddressTab = document.getElementById("add-address");
    const htmlAddAddressForm = document.getElementById("address-form");
    const htmlDataList = document.querySelector("#datalist-lists");

    const addAddressTab = new myListsTabHandler(htmlAddAddressTab);
    const addAddressForm = new myListsFormHandler(htmlAddAddressForm);
    const addAddressDatalist = new myListsDatalistHandler(htmlDataList);

    addAddressTab.formHndlr = addAddressForm;
    addAddressTab.initListener();
    addAddressForm.initListener();
    addAddressDatalist.initialize();





    // initializeDatalist();
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
    const website = document.querySelector("#address-form input[type=text]");
    const datalist = document.querySelector("#address-form input[list]");
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

// function initializeDatalist() {
//     console.log("initializeDatalist");
//     let dataListNode = document.querySelector("#datalist-lists");
//     let datalistOptions = dataListNode.children;
//     for (const option of datalistOptions) {
//         option.remove();
//     }
//     fetch(LISTS_URL)
//         .then(resp => {
//             if (!resp.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return resp.json()
//         })
//         .then(json => json.forEach(list => addDataListEntry(list)))
//         .catch(error => console.error("There has been problems with the fetch operation:", error));
// }

// function addDataListEntry(listItem) {
//     console.log("addDataListEntry");
//     let dataList = document.querySelector("#datalist-lists");
//     let datalistOption = document.createElement("option");
//     datalistOption.setAttribute("data-list-id", listItem.id);
//     datalistOption.setAttribute("value", listItem.name);
//     dataList.appendChild(datalistOption);
//     return dataList;
// }