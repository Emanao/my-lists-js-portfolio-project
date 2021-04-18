const BASE_URL = "http://localhost:3000"
const LISTS_URL = `${BASE_URL}/lists`

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
        console.log("static tab setDefaults")
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
        console.log("Tab initListener");
        // console.log(this);

        this.htmlTab.addEventListener('click', event => this.onClicked(event));
    }

    activateTab() {
        console.log("activateTab");
        // console.log(this.htmlTab);
        this.color = myListsTabHandler.getStatusColor().tabActiveColor;

    }

    deactivateTab() {
        console.log("deactivateTab");
        this.color = myListsTabHandler.getStatusColor().tabBaseColor;
    }


    onClicked(event) {
        console.log("onClicked");

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
        console.log("static form setDefaults");
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
        console.log("Form initListener");
        document.querySelector(`#${this.htmlForm.id} button`).addEventListener("click", (ev) => this.onSubmit(ev));
    }
    hide() {
        console.log("hide");
        this.htmlForm.style.display = "none";
    }
    show() {
        console.log("show");
        this.htmlForm.style.display = "block";
    }
    buildDataForSubmit() {
        const formData = {
            bodyData: {}
        };

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
        console.log("onSubmit");
        ev.preventDefault();
        // console.log(this);
        // console.log(this.htmlForm);

        /*The submit event fires on the <form> element itself*/
        /* 1st step - Get the formData for the submmited form.*/
        const formData = this.buildDataForSubmit();
        console.log(formData);

        if (!!formData.nestedId) {
            const url = `${LISTS_URL}/${formData.nestedId.id}/resources`;
            const jsonResp = myListsFetchRequest.myPostReq(url, formData.bodyData)
                .then(json => {
                    console.log(json);
                })

        } else {
            // console.log(this);
            const url = LISTS_URL;
            const jsonResp = myListsFetchRequest.myPostReq(url, formData.bodyData)
                .then(json => {
                    const htmlDataList = document.querySelector("#datalist-lists");
                    // console.log(htmlDataList);
                    // console.log(myListsDatalistHandler.createDatalistOption(json));
                    htmlDataList.appendChild(myListsDatalistHandler.createDatalistOption(json))
                });
        };
        console.log("Form submit clicked");
    }
}

class myListsDatalistHandler {
    constructor(htmlDatalist) {
        this._datalist = htmlDatalist;
        this.initializeOptions();
    }
    get htmlDatalist() {
        return this._datalist;
    }
    set htmlDatalist(htmlDatalist) {
        this._datalist = htmlDatalist;
    }
    initializeOptions() {
        console.log("Datalist initializeOptions");;
        for (const option of this.htmlDatalist.children) {
            option.remove();
        }
        console.log(this.htmlDatalist);
        const jsonResp = myListsFetchRequest.myGetReq(LISTS_URL)
            .then(json => json.forEach(jsonOption =>
                this.htmlDatalist.appendChild(myListsDatalistHandler.createDatalistOption(jsonOption))))
    }
    static createDatalistOption(jsonList) {
        console.log("static createDatalistOption");
        let datalistOption = document.createElement("option");
        datalistOption.setAttribute("data-list-id", jsonList.id);
        datalistOption.setAttribute("value", jsonList.name);
        return datalistOption;
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
        console.log("myGetReq")
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
        console.log("myPostReq")
        console.log(myListsFetchRequest.HEADERS);
        console.log(data);
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