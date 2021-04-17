const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`

const htmlTabLinks = document.querySelectorAll(".tablinks a");
const htmlTabForms = document.querySelectorAll(".forms-container form")


document.addEventListener("DOMContentLoaded", myListsOnLoad);

class myListsTabHandler {
    constructor(htmlTab, formObj) {
        this._tab = {
            _html: htmlTab,
            _form: formObj
        };
        this.color = myListsTabHandler.getStatusColor().tabBaseColor;
        this.initListener();
    }
    get htmlTab() {
        return this._tab._html;
    }
    set htmlTab(htmlTab) {
        this._tab._html = htmlTab;
    }
    get form() {
        return this._tab._form;
    }
    set form(formObj) {
        this._tab._form = formObj;
    }
    get color() {
        return this.htmlTab.style.color;
    }
    set color(color) {
        this.htmlTab.style.color = color;
    }
    static getStatusColor() {
        return {
            tabBaseColor: "rgb(65, 145, 225)",
            tabActiveColor: "white"
        }
    }

    initListener() {
        console.log("Tab initListener");
        console.log(this);

        this.htmlTab.addEventListener('click', event => this.onClicked(event));
    }

    activateTab() {
        console.log("activateTab");
        console.log(this.htmlTab);
        this.color = myListsTabHandler.getStatusColor().tabActiveColor;

    }

    deactivateTab() {
        console.log("deactivateTab");
        this.color = myListsTabHandler.getStatusColor().tabBaseColor;
    }

    isTabActive() {
        // return this.tab.style.color === tabActiveColor;
    }

    static setAllTabsInactive() {
        console.log("resetTabProps")
            /* setup default color (blue) for all the tabs but the one being targeted */
        htmlTabLinks.forEach(tab => {
            tab.style.color = myListsTabHandler.getStatusColor().tabBaseColor;
        });
    }

    onClicked(event) {
        console.log("onClicked");

        /*Save the state before resetting all tabs and forms properties*/
        const currentColor = this.color;
        console.log(currentColor);

        myListsTabHandler.setAllTabsInactive();
        myListsFormHandler.setAllFormsInactive();

        // /* After resetting the state of all tabs and forms just activate 
        // tab and form on when the previous state was inactive */
        if (currentColor === myListsTabHandler.getStatusColor().tabBaseColor) {
            this.activateTab()
            this.form.show();
        }
    }
}
class myListsFormHandler {
    constructor(htmlForm, datalistObj) {
        this._form = {
            _html: htmlForm,
            _datalist: datalistObj
        }
        this.initListener();
    }
    get htmlForm() {
        return this._form._html;
    }
    set htmlForm(htmlForm) {
        this._form._html = htmlForm;
    }

    get datalist() {
        return this._form._datalist;
    }
    set datalist(dataListObj) {
        this._form._datalist = dataListObj;
    }

    initListener() {
        console.log("Form initListener");
        console.log(this);
        document.querySelector(`#${this.htmlForm.id} button`).addEventListener("click", (ev) => this.onSubmit(ev));
    }

    static setAllFormsInactive() {
        /* Hide all other forms but the one passed as argument */
        /* Initialize forms color before toggle  */
        htmlTabForms.forEach(form => {
            form.style.display = "none";
            document.querySelectorAll(`#${form.id} input`).forEach(input => input.value = "")
        });
    }

    resetInputFields() {
        console.log("resetInputFields");
        document.querySelectorAll(`#${this.form.id} input`).forEach(input => input.value = "")
    }
    hide() {
        console.log("hide form");
        this.htmlForm.style.display = "none";
    }
    show() {
        console.log("show form");
        this.htmlForm.style.display = "block";
    }
    isActive() {
        return this.htmlForm.style.display === "block";
    }

    onSubmit(ev) {
        console.log("onSubmit");
        ev.preventDefault();
        console.log(this);
        console.log(this.form);

        /*The submit event fires on the <form> element itself*/
        /* 1st step - Get the formData for the submmited form.*/
        const formData = {
            bodyData: {}
        };
        // let url, callback;
        const formInputs = document.querySelectorAll(`#${this.form.id} input`);
        formInputs.forEach((input) => {
            if (!!input.list) {
                formData.nestedId = {};
                const selectedOption = Array.from(input.list.options).find(option => input.value === option.value);
                formData.nestedId["id"] = selectedOption.dataset.listId;
            } else {
                formData.bodyData[input.name] = input.value;
            }
        });
        console.log(formData);

        /*2nd. Build configuration object.
        Form text inputs are sent in the body and 
        datalist input will be part of the nested route. 
        */
        const confObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData.bodyData)
        }

        // console.log(formData.nestedId);
        console.log(confObj);

        let url, callback;
        if (!!formData.nestedId) {
            url = `${LISTS_URL}/${formData.nestedId.id}/resources`;
            callback = function() {
                console.log("web resource added to the list");
            }
        } else {
            url = LISTS_URL;
            callback = (json) => {
                console.log(json);
                const datalist = new myListsDatalistHandler(document.querySelector("#datalist-lists"))
                datalist.addDataListEntry(json);
            };
        }

        console.log(url);
        fetch(url, confObj)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }
                return resp.json();
            })
            .then(callback)
            .catch(error => console.error("There has been problems with the fetch operation:", error));

        console.log("Form submit clicked");

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

    const addListForm = new myListsFormHandler(htmlAddListForm);
    const addListTab = new myListsTabHandler(htmlAddListTab, addListForm);

    /* AddAddress objs: tab + form and datalist*/
    const htmlAddAddressTab = document.getElementById("add-address");
    const htmlAddAddressForm = document.getElementById("address-form");
    const htmlDataList = document.querySelector("#datalist-lists");

    const addAddressDatalist = new myListsDatalistHandler(htmlDataList);
    const addAddressForm = new myListsFormHandler(htmlAddAddressForm, addAddressDatalist);
    const addAddressTab = new myListsTabHandler(htmlAddAddressTab, addAddressForm);

}