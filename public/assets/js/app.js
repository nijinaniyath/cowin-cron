import {WhatsAppGroups} from './whatsapp-groups.js';
import {comboxInit} from './combox.js';
import {stateAPI , districtAPI ,  registerAPI } from './const.js';


const stateControl = document.querySelector("#state");
let states = [];
let selctedState;

const districtCombox = document.querySelector("#districts");
const registerBtn = document.getElementById("register");
const registerGrp = document.getElementById("register-action");
const emailControl = document.getElementById("emailid");
const mobileControl = document.getElementById("mobile");
const whatsappControl = document.getElementById("whatsapp");
const whatsappGrps = document.getElementById("whatsapp-grps");
const emailCheckControl = document.getElementById("email");
const locationEl = document.getElementById("location");
const emailGrpEl = document.getElementById("email-grp");
const registerForm = document.getElementById("register-form");
let isEmailValid = false;
let isMobileValid = false;
let districts = [];
let selctedDistricts = [];
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
  locationEl.classList.add('show');
  selctedState = e.target.value;
  selctedHospitals = [];
  districts = [];
  whatsappGrps.innerHTML = '';
  document.querySelector("#hospitals .combox-selection").innerHTML = "";
  document.querySelector("#hospitals .combox-dropdown").innerHTML = "";
  selctedDistricts = [];
  whatsappControl.setAttribute('disabled', true);
  emailCheckControl.setAttribute('disabled', true);
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
            name: "district_name",
          },
          // Add or remove Districts
          (data, district) => {
            if (district && district.type === "add") {
              if (!selctedDistricts.includes(district.id)) {
                selctedDistricts.push(district.id);
                // getHospital(district.id);
              }
            }
            if (district && district.type === "remove") {
              let i = selctedDistricts.indexOf(district.id);
              selctedDistricts.splice(i, 1);
            }

            // Show hide controls based on district
            if(selctedDistricts.length){
              whatsappControl.removeAttribute('disabled');
              emailCheckControl.removeAttribute('disabled');
              // /Generate whatsapp join button based on selection
              generateWhatsappJoin();
            } else  {
              whatsappControl.setAttribute('disabled' , true);
              emailCheckControl.setAttribute('disabled' , true);
            }

            // Validate button form
            validate();
          }
        );
      }
    });
}



function validate() {
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

  if (
    (isEmailValid || isMobileValid) &&
    validState &&
    validDistricts &&
    validNotificationCheck
  ) {
    registerBtn.removeAttribute("disabled");
  } else {
    registerBtn.setAttribute("disabled", true);
  }
}

// email Check 
emailCheckControl.onclick = (e) => {
  emailGrpEl.classList.add('show')
  registerGrp.classList.remove('hide');
  whatsappGrps.classList.add('hide');
  validate();
}

// Mobile
 whatsappControl.onclick = (e) => {
  whatsappGrps.classList.remove('hide');
  registerGrp.classList.add('hide');
  emailGrpEl.classList.remove('show');
  // mobileGrpEl.classList.add('show');
  generateWhatsappJoin()
}

function generateWhatsappJoin(){
  whatsappGrps.innerHTML = '';

  if(selctedState != 17){
    whatsappGrps.innerHTML = `<p>
    Apologies ! Currently vaccine bell doesn't support whatsapp notification on this city. 
    Instead,you can make use of email service or vaccine bell mobile app.
    </p>
    `
    return 
  }


  whatsappGrps.innerHTML = `<p>
  To get WhatsApp vaccine availability notification, 
  Join on Vaccine Bell WhatsApp city groups
  </p>
  `
  WhatsAppGroups.forEach(grp=> {
    if(selctedDistricts.some(id =>  grp.cityId == id)) {
        grp.groups.forEach( wtGrp=> {
          let whatsappJoinBtn = document.createElement('a')
          whatsappJoinBtn.setAttribute('href', wtGrp.link);
          whatsappJoinBtn.setAttribute('target','_blank');
          whatsappJoinBtn.setAttribute('class','btn wa-jn-btn');
          whatsappJoinBtn.innerText = wtGrp.name;
          whatsappGrps.appendChild(whatsappJoinBtn);
        });
    }
  })
}



// emailid
emailControl.onkeyup = () => {
  let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  isEmailValid = emailControl.value && emailRegex.test(emailControl.value) ? true : false;
  let validatorFlag = emailControl.nextElementSibling;
  if (isEmailValid) {
    validatorFlag.classList.remove('false');
    validatorFlag.classList.add('true');
  } else {
    validatorFlag.classList.remove('true');
    validatorFlag.classList.add('false');
  }
  validate();
};

// Mobile
mobileControl.onkeyup = () => {
  let phoneno = /^\d{10}$/;
  isMobileValid = phoneno.test(mobileControl.value);
  let validatorFlag = mobileControl.nextElementSibling;
  if (isMobileValid) {
    validatorFlag.classList.remove('false');
    validatorFlag.classList.add('true');
  } else {
    validatorFlag.classList.remove('true');
    validatorFlag.classList.add('false');
  }
  validate();
};



// Registert
registerBtn.onclick = (e) => {
  let alert = document.querySelector(".alert");
  let errorBadge = document.querySelector(".error-badge");
  let errorMessage = document.querySelector("#error-message");
  let notification = [];
  registerForm.classList.add("disable");
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
    notificationChannels: notification,
    districts: selctedDistricts,
    hospitals: selctedHospitals,
  };

  if(isEmailValid){
    dateForm.email = emailControl.value;
  } else {
    dateForm.notificationChannels = notification.filter(i=> i == 'whatsapp')
  }
  if(isMobileValid){
    dateForm.phone = mobileControl.value;
  } else {
    dateForm.notificationChannels = notification.filter(i=> i == 'mail')
  }

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
      window.scrollTo(0, 0);
      alert.classList.add("show");
    })
    .catch((err) => {
      window.scrollTo(0, 0);
      errorMessage.innerText = err.message || err;
      errorBadge.classList.add("show");
      registerForm.classList.remove("disable");
      registerBtn.removeAttribute("disabled");
      register.classList.remove("show-loading");
    });
};



// close disclaimer
document.getElementById('close-data-use').addEventListener('click', ()=> {
  document.querySelector('.data-use').classList.add('hide');
})
