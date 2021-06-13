import {comboxInit} from './combox.js';
import {stateAPI , districtAPI , hospitalAPI } from './const.js';


const stateControl = document.querySelector("#state");
let states = [];
let selctedState;

const districtCombox = document.querySelector("#districts");
const startBtn = document.getElementById("start-alert");
const stopBtn = document.getElementById("stop-alert");
const locationEl = document.getElementById("location");
const resultCnt = document.getElementById("results");
const resultEl = document.getElementById("result-row");
const alertForm = document.getElementById("alert-form");
const bellEl = document.getElementById("audio-bell");
const counterEl = document.getElementById("counter");
let districts = [];
let hospitals = [];
let selctedDistricts = [];
let intervelHit;
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
  districts = [];
  selctedDistricts = [];
  getDistrictsById(selctedState);
  clearResults();
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
            // Hide result continer
            clearResults();

            if (district && district.type === "add") {
              if (!selctedDistricts.includes(district.id)) {
                selctedDistricts.push(district.id);
              }
            }
            if (district && district.type === "remove") {
              let i = selctedDistricts.indexOf(district.id);
              selctedDistricts.splice(i, 1);
            }

            // Show hide controls based on district
            if(selctedDistricts.length){
                startBtn.removeAttribute('disabled');
            } else{
                startBtn.setAttribute('disabled' , true);
            }
          }
        );
      }
    });
}



// Start notification
startBtn.addEventListener('click' , (e)=> {
    clearResults();
    selctedDistricts.forEach(districtId => getHospital(districtId));
    alertForm.classList.add('disable');
    startBtn.classList.add('hide');
    stopBtn.classList.remove('hide');
    counterEl.classList.remove('hide');
    let count = 1;
    counterEl.innerText = count;
    
    intervelHit =    setInterval(()=> {
        clearResults();
        count++;
        counterEl.innerText = count;
        selctedDistricts.forEach(district => getHospital(district));
    }, (1000 * 60))

})


stopBtn.addEventListener('click' , (e)=> {
    clearInterval(intervelHit);
    clearResults();
    startBtn.classList.remove('hide');
    stopBtn.classList.add('hide');
    counterEl.classList.add('hide');
    alertForm.classList.remove('disable');
    bellEl.pause()
    bellEl.currentTime = 0;
})


function clearResults(){
    resultEl.innerHTML = '';
    resultCnt.classList.add('hide');
    hospitals = [];
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
    let API_URL = `${hospitalAPI}?district_id=${district}&date=${DD}-${MM}-${YYY}`;
    
    fetch(API_URL)
    .then((response) => response.json())
    .then((hospitalData) => {
        hospitals.push(...hospitalData.centers);
        
        if (hospitals && hospitals.length) {
            let hospitalCards = '';
        hospitals.forEach(hospital => {
            let sessions = '';
            let isAvailable = false;
            // Pirnt Sessions
            hospital.sessions.forEach(session => {
                let age_limits = []
                document.querySelectorAll('[name="min_age_limit"]:checked').forEach(age => age_limits.push(parseInt(age.value)));
                
                let vaccines = []
                document.querySelectorAll('[name="vaccine"]:checked').forEach(vaccine => vaccines.push(vaccine.value));
                
                
                let fee_types = []
                document.querySelectorAll('[name="fee_type"]:checked').forEach(fee_type => fee_types.push(fee_type.value));
                
                
                if(session.available_capacity == 0 || 
                    age_limits.length  && !age_limits.includes(session.min_age_limit) ||
                    vaccines.length  && !vaccines.includes(session.vaccine) ||
                    fee_types.length  && !fee_types.includes(hospital.fee_type) 
                ){ return } 
                
                isAvailable = true;
                sessions += `
                    <div class="tbox">
                        <h4 class="tbox-th"> ${session.date} </h4>
                        <div class="tbox-td"> 
                            <h5 class="cpc">${session.available_capacity}</h5>
                            <span class="vaccine">${session.vaccine}</span>
                            <span class="age">${session.min_age_limit}+</span>
                        </div>
                    </div>
                `;
            })

            /**
             * If Vaccine not avilabe return 
             * */ 
            if(!isAvailable){
                return true
            }



            /**
             * Vaccine Avilabe
             * */ 
            bellEl.play();
            resultCnt.classList.remove('hide');
            // Print Hospitails
            hospitalCards += `
            <div class="grid">
                <div class="card">
                    <div class="card-body">
                        <h3>${hospital.name}</h3>
                        <p> 
                            ${hospital.address}, 
                            ${hospital.block_name}, 
                            ${hospital.district_name},
                            Pin:  ${hospital.pincode}
                        </p>
                        <p>Fee : 
                            <span class="fee-type ${hospital.fee_type}">
                                ${hospital.fee_type} 
                            </span>
                            <span class="fee">
                            ${hospital.vaccine_fees? ', Rs '+ hospital.vaccine_fees[0].fee: ''}
                            <span>
                        </p>
                        <div class="flex-table"> ${sessions} </div>
                    </div>
                </div>
            </div>
            `
        });
        
        resultEl.innerHTML = hospitalCards;

      }
    });
}