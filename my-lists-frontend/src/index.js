const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`
const RESOURCES_URL = `${BASE_URL}/resources`

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

    static getStatusColor() {
        return {
            tabBaseColor: "rgb(65, 145, 225)",
            tabActiveColor: "white"
        }
    }

    static setDefaults() {
        // console.log("static tab setDefaults")
        const htmlTabLinks = document.querySelectorAll(".tablinks a");
        /* setup default color (blue) for all the tabs but the one being targeted */
        htmlTabLinks.forEach(tab => {
            tab.style.color = myListsTabHandler.getStatusColor().tabBaseColor;
        });
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

    initListener() {
        // console.log("Tab initListener");
        // console.log(this);

        this.htmlTab.addEventListener('click', event => this.onClicked(event));
    }

    activateTab() {
        console.log("activateTab");
        // console.log(this.htmlTab);
        this.color = myListsTabHandler.getStatusColor().tabActiveColor;

    }

    deactivateTab() {
        // console.log("deactivateTab");
        this.color = myListsTabHandler.getStatusColor().tabBaseColor;
    }


    onClicked(event) {
        // console.log("onClicked");

        /*Save the state before resetting all tabs and forms properties*/
        const currentColor = this.color;
        // console.log(currentColor);

        myListsTabHandler.setDefaults();
        myListsFormHandler.setDefaults();

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

    static setDefaults() {
        // console.log("static form setDefaults");
        const htmlTabForms = document.querySelectorAll(".forms-container form");
        /* Hide all other forms but the one passed as argument */
        /* Initialize forms color before toggle  */
        htmlTabForms.forEach(form => {
            form.style.display = "none";
            document.querySelectorAll(`#${form.id} input`).forEach(input => input.value = "")
        });
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
        // console.log("Form initListener");
        document.querySelector(`#${this.htmlForm.id} button`).addEventListener("click", (ev) => this.onSubmit(ev));
    }
    hide() {
        this.htmlForm.style.display = "none";
    }
    show() {
        this.htmlForm.style.display = "block";
    }
    buildDataForSubmit() {
        const formData = {
            bodyData: {}
        };
        // console.log(this)

        const formInputs = document.querySelectorAll(`#${this.htmlForm.id} input`);
        formInputs.forEach((input) => {
            if (!!input.list) {
                formData.nestedId = {};
                const selectedOption = Array.from(input.list.options).find(option => input.value === option.value);
                formData.nestedId["id"] = selectedOption.dataset.listId;
            } else {
                formData.bodyData[input.name] = input.value;
            }
        });
        return formData;
    }

    onSubmit(ev) {
        // console.log("onSubmit");
        ev.preventDefault();
        console.log(this);

        const formData = this.buildDataForSubmit();
        // console.log(formData);

        if (!!formData.nestedId) {
            // Add Website Form On Submit (contains an input and a datalist field)
            myListsAddressHandler.onSubmit(formData)
        } else {
            // Add List Form On Submit (contains only an input field )
            myListsFieldsetHandler.onSubmit(formData);

        };
    }
}

class myListsDatalistHandler {
    constructor() {
        this._datalist = myListsDatalistHandler.htmlDatalist();
        this.initializeOptions();
    }
    get htmlDatalist() {
        return this._datalist;
    }
    set htmlDatalist(htmlDatalist) {
        this._datalist = htmlDatalist;
    }
    static htmlDatalist() {
        return document.querySelector("#datalist-lists");
    }
    initializeOptions() {
        // console.log("Datalist initializeOptions");;
        for (const option of this.htmlDatalist.children) {
            option.remove();
        }
        // console.log(this.htmlDatalist);
        const jsonResp = myListsFetchRequest.myGetReq(LISTS_URL)
            .then(json => json.forEach(jsonOption =>
                this.htmlDatalist.appendChild(myListsDatalistHandler.createDatalistOption(jsonOption))))
    }
    static createDatalistOption(jsonList) {
        // console.log("static createDatalistOption");
        const datalistOption = document.createElement("option");
        datalistOption.setAttribute("data-list-id", jsonList.id);
        datalistOption.setAttribute("value", jsonList.name);
        return datalistOption;
    }
}

class myListsFieldsetHandler {
    static fieldsetContainer() {
        return document.querySelector("#main");
    }

    static onLoad() {
        // console.log("onLoad");
        myListsFetchRequest.myGetReq(LISTS_URL)
            .then(resp => resp.forEach(list => this.fieldsetContainer().appendChild(this.buildFieldset(list))))
    }

    static onSubmit(data) {
        const url = LISTS_URL;
        const jsonResp = myListsFetchRequest.myPostReq(url, data.bodyData)
            .then(resp => {
                // Update Datalist in the Add Addreses Form with response
                myListsDatalistHandler.htmlDatalist().appendChild(myListsDatalistHandler.createDatalistOption(resp));
                // Update Fieldset with new List
                this.fieldsetContainer().appendChild(
                    this.buildFieldset(resp));

            });
    }

    static buildFieldset(list) {
        // console.log("buildFieldset");
        const fieldset = document.createElement("fieldset");
        fieldset.setAttribute("data-list-id", list.id);

        const legend = document.createElement("legend");
        legend.innerText = list.name;
        fieldset.appendChild(legend);
        fieldset.appendChild(myListsAddressHandler.buildAddresses(list));

        return fieldset;

    }

    static deleteFieldset(ev) {
        console.log("deleteFieldset");
        const fieldsetNode = ev.currentTarget.parentElement.parentNode.parentNode;
        console.log(fieldsetNode.dataset.listId)
        this.fieldsetContainer().removeChild(fieldsetNode);
        myListsFetchRequest.myDeleteReq(`${LISTS_URL}/${fieldsetNode.dataset.listId}`);
    }

}
class myListsAddressHandler {

    static onSubmit(data) {
        // Add Addresses Form On Submit (contains an input field +  datalist element)
        const url = `${LISTS_URL}/${data.nestedId.id}/resources`;
        const jsonResp = myListsFetchRequest.myPostReq(url, data.bodyData)
            .then(nestedResp => {
                console.log(nestedResp);

                // Find fieldset for rested resource
                const fieldset = document.querySelector(`fieldset[data-list-id="${nestedResp.list_id}"]`);

                const fieldsetUl = fieldset.querySelector("ul");
                const listEmptyMsg = fieldsetUl.querySelector("ul li > p");
                console.log(fieldsetUl)
                console.log(listEmptyMsg);

                // Remove empty list message, if any,  when adding a new address.
                if (!!listEmptyMsg) {
                    fieldsetUl.removeChild(fieldsetUl.querySelector("li"));
                }
                fieldsetUl.appendChild(this.buildAddress(nestedResp));
            })
    }

    static buildAddresses(list) {
        // console.log("buildAddresses");
        const ul = document.createElement("ul");

        myListsFetchRequest.myGetReq(`${LISTS_URL}/${list.id}/resources`)
            .then(resources =>
                // If response is an empty object > Show empty list message.
                // if not append addresses to ul
                (resources.length === 0) ? ul.appendChild(this.buildEmptyListDummy()) : resources.forEach(website =>
                    ul.appendChild(this.buildAddress(website))))
        return ul;

    }

    static buildAddress(website) {
        // console.log("buildAddress");

        const li = document.createElement("li");
        const a = document.createElement("a");
        const deleteButton = document.createElement("button");


        a.setAttribute("href", website.address);
        a.setAttribute("target", "_blank");
        a.innerText = website.address;

        deleteButton.innerText = "x";
        deleteButton.addEventListener("click", (ev) => this.deleteAddress(ev));

        li.setAttribute("data-address-id", website.id);
        li.appendChild(a);
        li.appendChild(deleteButton);

        return li;
    }

    static buildEmptyListDummy() {
        // console.log("buildEmptyListDummy");

        const li = document.createElement("li");

        const startP = document.createElement("p");
        startP.innerText = "Your list is empty! Click ";

        const aDeleteList = document.createElement("a");
        aDeleteList.setAttribute("href", "#");
        aDeleteList.innerText = "here";
        aDeleteList.addEventListener("click", (ev) => myListsFieldsetHandler.deleteFieldset(ev));

        const middleP = document.createElement("p");
        middleP.innerText = ` to delete it or `;

        const aAddWebsite = document.createElement("a");
        aAddWebsite.setAttribute("href", "#main-header");
        aAddWebsite.innerText = "here";

        const endP = document.createElement("p");
        endP.innerText = ` to add a website from the menu.`;


        li.appendChild(startP);
        li.appendChild(aDeleteList);
        li.appendChild(middleP);
        li.appendChild(aAddWebsite);
        li.appendChild(endP);

        return li;

    }

    static deleteAddress(event) {
        console.log("deleteAddress");

        const childNode = event.currentTarget.parentElement;
        const parentNode = childNode.parentNode;
        const addressId = childNode.dataset.addressId;

        parentNode.removeChild(childNode);
        console.log(parentNode.children);
        if (!parentNode.children.length) {
            parentNode.appendChild(this.buildEmptyListDummy());
        }

        myListsFetchRequest.myDeleteReq(`${RESOURCES_URL}/${addressId}`);

    }
}

class myListsFetchRequest {
    static get HEADERS() {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
    static myGetReq(url) {
        // console.log("myGetReq")
        return fetch(url)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }
                return resp.json()
            })
            .catch(error => console.error("There has been problems with the fetch operation:", error));
    }
    static myPostReq(url, data) {
        // console.log("myPostReq")
        return fetch(url, {
                method: "POST",
                headers: myListsFetchRequest.HEADERS,
                body: JSON.stringify(data)
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }
                return resp.json()
            })
            .catch(error => console.error("There has been problems with the fetch operation:", error));
    }
    static myDeleteReq(url, data) {
        // console.log("myDeleteReq")

        return fetch(url, {
                method: 'DELETE',
                headers: myListsFetchRequest.HEADERS,
                body: JSON.stringify(data)
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            })
            .catch(error => console.error("There has been problems with the fetch operation:", error));
    }
}

function myListsOnLoad() {
    // console.log("myListsOnLoad");

    /*AddList objs: tab + form */
    const htmlAddListTab = document.getElementById("add-list");

    const htmlAddListForm = document.getElementById("list-form");
    const addListForm = new myListsFormHandler(htmlAddListForm);

    const addListTab = new myListsTabHandler(htmlAddListTab, addListForm);

    /* AddAddress objs: tab + form and datalist*/
    const htmlAddAddressTab = document.getElementById("add-address");
    const htmlAddAddressForm = document.getElementById("address-form");

    const addAddressDatalist = new myListsDatalistHandler();
    const addAddressForm = new myListsFormHandler(htmlAddAddressForm, addAddressDatalist);
    const addAddressTab = new myListsTabHandler(htmlAddAddressTab, addAddressForm);

    myListsFieldsetHandler.onLoad();
}