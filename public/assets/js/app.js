const stateAPI = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
const districtAPI =
  "https://cdn-api.co-vin.in/api/v2/admin/location/districts/";
const hospitalAPI =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict";
const registerAPI = "http://localhost:3001/api/users";
const stateControl = document.querySelector("#state");
let states = [];
let selctedState;

const districtCombox = document.querySelector("#districts");
const hospitalCombox = document.querySelector("#hospitals");
const registerBtn = document.getElementById("register");
const emailControl = document.getElementById("emailid");
const mobileControl = document.getElementById("mobile");

let districts = [];
let selctedDistricts = [];
let hospitals = [];
let selctedHospitals = [];

getAllStates();

// Populate All states in india
function getAllStates() {
  fetch(stateAPI)
    .then((response) => response.json())
    .then((stateData) => {
      states = stateData.states;
      states.forEach((state) => {
        let option = document.createElement("option");
        option.text = state.state_name;
        option.value = state.state_id;
        stateControl.appendChild(option);
      });
    });
}
// State selection
stateControl.addEventListener("input", (e) => {
  selctedState = e.target.value;
  hospitals = [];
  selctedHospitals = [];
  districts = [];
  document.querySelector("#hospitals .combox-selection").innerHTML = "";
  document.querySelector("#hospitals .combox-dropdown").innerHTML = "";
  getDistrictsById(selctedState);
  validate();
});

/**
 * Get Districts
 * @param {number} id : state id
 * */

function getDistrictsById(id) {
  fetch(districtAPI + id)
    .then((response) => response.json())
    .then((districtsData) => {
      districts = districtsData.districts;
      if (districts && districts.length) {
        // combox config
        comboxInit(
          districtCombox,
          districts,
          {
            id: "district_id",
            name: "district_name"
          },
          // Add or remove Districts
          (data, district) => {
            if (district && district.type === "add") {
              if (!selctedDistricts.includes(district.id)) {
                selctedDistricts.push(district.id);
                getHospital(district.id);
              }
            }
            if (district && district.type === "remove") {
              let i = selctedDistricts.indexOf(district.id);
              selctedDistricts.splice(i, 1);
            }
            // Validate button form
            validate();
          }
        );
      }
    });
}

/**
 *
 * Get Hospitals
 *
 * **/
function getHospital(district) {
  let d = new Date();
  let DD = d.getDate() <= 9 ? "0" + d.getDate() : d.getDate();
  let mm = d.getMonth() + 1;
  let MM = mm <= 9 ? "0" + mm : mm;
  let YYY = d.getFullYear();
  API_URL = `${hospitalAPI}?district_id=${district}&date=${DD}-${MM}-${YYY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((hospitalData) => {
      hospitals.push(...hospitalData.centers);

      if (hospitals && hospitals.length) {
        comboxInit(
          hospitalCombox,
          hospitals,
          {
            id: "center_id",
            name: "name",
            address: "address"
          },
          // Add or remove hospital
          (data, hospital) => {
            if (hospital && hospital.type === "add") {
              if (!selctedHospitals.includes(hospital.id)) {
                selctedHospitals.push(hospital.id);
              }
            }
            if (hospital && hospital.type === "remove") {
              let i = selctedHospitals.indexOf(hospital.id);
              selctedHospitals.splice(i, 1);
            }
          }
        );
      }
    });
}

function validate() {
  let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  let validEmail =
    emailControl.value && emailRegex.test(emailControl.value) ? true : false;
  let phoneno = /^\d{10}$/;
  let validPhone = phoneno.test(mobileControl.value);

  let validState = stateControl.value ? true : false;
  let validDistricts = selctedDistricts.length > 0 ? true : false;
  let notification = [];
  document.querySelector(".error-badge").classList.remove("show");

  document
    .querySelectorAll("input[name='notification']:checked")
    .forEach((el) => {
      notification.push(el.value);
    });
  let validNotificationCheck = notification.length > 0 ? true : false;

  if ((validEmail || validPhone) && validState && validDistricts && validNotificationCheck) {
    registerBtn.removeAttribute("disabled");
  } else {
    registerBtn.setAttribute("disabled", true);
  }
}

// emailid
emailControl.onkeyup = () => {
  let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  let validEmail =
    emailControl.value && emailRegex.test(emailControl.value) ? true : false;
  let emailCh = document.getElementById("email");
  if (!validEmail) {
    email.setAttribute("disabled", true);
    emailCh.checked = false;
  } else {
    email.removeAttribute("disabled");
    emailCh.checked = true;
  }
  validate();
};

// Mobile
mobileControl.onkeyup = () => {
  let phoneno = /^\d{10}$/;
  let validPhone = phoneno.test(mobileControl.value);
  let sms = document.getElementById("sms");
  let whatsapp = document.getElementById("whatsapp");
  if (!validPhone) {
    sms.setAttribute("disabled", true);
    sms.checked = false;
    whatsapp.setAttribute("disabled", true);
    whatsapp.checked = false;
  } else {
    sms.removeAttribute("disabled");
    sms.checked = true;
    whatsapp.removeAttribute("disabled");
  }
  validate()
};
// Notification options
document.querySelectorAll("input[name='notification']").forEach((channel) => {
  channel.addEventListener("click", validate);
});

// Registert
registerBtn.onclick = (e) => {
  let alert = document.querySelector(".alert");
  let errorBadge = document.querySelector(".error-badge");
  let errorMessage = document.querySelector("#error-message");
  let notification = [];
  errorBadge.classList.remove("show");
  // Show waiting
  register.classList.add("show-loading");
  // Disable further action
  registerBtn.setAttribute("disabled", true);

  document
    .querySelectorAll("input[name='notification']:checked")
    .forEach((el) => {
      notification.push(el.value);
    });

  let dateForm = {
    email: emailControl.value,
    phone: mobileControl.value || null,
    notificationChannels: notification,
    districts: selctedDistricts,
    hospitals: selctedHospitals,
  };

  fetch(registerAPI, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dateForm),
  })
    .then(async (res) => {
      if (!res.ok) {
        throw await res.json();
      }
      return res.json();
    })
    .then((res) => {
      alert.classList.add("show");
    })
    .catch((err) => {
      console.log(err);
      errorMessage.innerText = err?.message || err;
      errorBadge.classList.add("show");
      registerBtn.removeAttribute("disabled");
      register.classList.remove("show-loading");
    });
};

/**
 * Combox
 * **/
function comboxInit(combox, collection, params , comUpdateCallback) {
  const selectedEl = combox.children[0]; // Slector e;
  const ctrl = combox.children[1]; // Input
  const dropdown = combox.children[2]; // dropdown menu
  let dropdownItems = "";
  let selected = []; // selected
  // reset first
  selectedEl.innerHTML = "";
  ctrl.value = "";
  dropdown.innerHTML = "";

  // Update dropdown
  const updateDropdown = () => {
    dropdownItems = "";
    collection.forEach((item) => {
      if (!item.disable && !item.remove) {
        dropdownItems += `<li data-id="${item[params.id]}">
          ${item[params.name]}
          ${item[params.address]?', ' + item[params.address]: ''}

          </li>`;
      }
    });
    dropdown.innerHTML = dropdownItems;

    // Select Item from dropdown
    const dropdownList = dropdown.children;
    for (let i = 0; i < dropdownList.length; i++) {
      dropdownList[i].onclick = (e) => {
        let itemId = e.target.dataset.id;
        let itemName = e.target.innerText;
        e.preventDefault();
        e.stopPropagation();
        ctrl.value = "";
        if (selected.findIndex((it) => it.id === itemId) === -1) {
          updateSelection({
            id: itemId,
            name: itemName,
          });

          comUpdateCallback(selected, {
            type: "add",
            name: itemName,
            id: itemId,
          });
          // Update dropdownlist
          collection = collection.map((item) => {
            if (item[params.id] == itemId) {
              return { ...item, remove: true };
            }
            return item;
          });
        }
        dropdown.classList.remove("open");
      };
    }
  };

  //Update Selection List
  const updateSelection = (data) => {
    let selectedItems = "";
    let dataSelected = "";
    selected.push(data);
    selected.forEach((item) => {
      selectedItems += `<span data-id="${item.id}" class="item">${item.name} <button class="remove"></button></span>`;
      dataSelected += item.id + ",";
    });
    // update dataset attribute
    combox.dataset.selected = dataSelected;

    // Append Selected items
    selectedEl.innerHTML = selectedItems;
    // Remove Action
    for (let i = 0; i < selectedEl.children.length; i++) {
      let selectedItem = selectedEl.children[i];
      let itemRemoveBtn = selectedItem.children[0];
      let itemId = selectedItem.dataset.id;
      let itemName = selectedItem.innerText;
      itemRemoveBtn.onclick = (removeEvent) => {
        removeEvent.preventDefault();
        removeEvent.stopPropagation();
        dropdown.classList.remove("open");
        selectedItem.remove(); // remove Element
        selected = selected.filter((sclIt) => sclIt.id !== itemId); // remove from Selected Array

        comUpdateCallback(selected, {
          type: "remove",
          name: itemName,
          id: itemId,
        });

        // update Date set attribute
        dataSelected = dataSelected.replace(itemId + ",", "");
        combox.dataset.selected = dataSelected;

        collection = collection.map((item) => {
          if (item[params.id] == itemId || !item.remove) {
            return { ...item, remove: false };
          }
          return { ...item, remove: true };
        });
        updateDropdown();
      };
    }
  };

  document.querySelector("body").onclick = (e) => {
    dropdown.classList.remove("open");
  };

  // Combox click
  combox.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    ctrl.focus();
    textBasedDropdownFilter(ctrl.value);
    dropdown.classList.add("open");
  };

  // Typing on combox
  ctrl.onkeyup = (e) => {
    textBasedDropdownFilter(e.target.value);
  };

  const textBasedDropdownFilter = (text) => {
    collection = collection.map((item) => {
      if (
        item[params.name].toLowerCase().includes(text.toLowerCase()) &&
        !item.remove
      ) {
        return { ...item, disable: false };
      }
      return { ...item, disable: true };
    });
    updateDropdown();
  };
}

// get cobvalue

function getComboxValue(selector) {
  let combVal = selector.dataset.selected.split(",");
  combVal.pop();
  return combVal;
}

