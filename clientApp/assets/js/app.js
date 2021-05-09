

const stateAPI = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
const districtAPI = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/";
const HospitalAPI = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict";


const stateControl = document.querySelector('#state');
let states = [];
let selctedState;

const districtCombox = document.querySelector('#districts');
const hospitalCombox = document.querySelector('#hospitals');
const registerBtn = document.getElementById('register')

let districts = [];
let selctedDistricts = [];
let hospitals = [];
let selctedHospitals = [];

getAllStates();


// Populate All states in india
function getAllStates(){
    $.get(stateAPI , function( stateData ) {
        states = stateData.states;
        states.forEach(state => {
            $('#state').append(`<option value="${state.state_id}"> ${state.state_name}</option>`)
        })
    });
}
// State selection
stateControl.addEventListener('input', (e)=> {
    selctedState = e.target.value;
    hospitals = [];
    selctedHospitals = [];
    districts = [];
    $('#hospitals .combox-selection').html('');
    $('#hospitals .combox-dropdown').html('');
    getDistrictsById(selctedState);
    validate();
});




/**
 * Get Districts
 * @param {number} id : state id
 * */ 

function getDistrictsById(id){
    $.get(districtAPI + id , function( districtsData ) {
        districts = districtsData.districts;
        if(districts && districts.length){
            // combox config
            comboxInit(districtCombox , districts , "district_id" , "district_name", 
            // Add or remove Districts
            (data , district)=>{
                if(district && district.type === "add"){
                    
                    if(!selctedDistricts.includes(district.id)){
                        selctedDistricts.push(district.id);
                        getHospital(district.id)
                    }
                }
                if(district && district.type === "remove"){
                    let i = selctedDistricts.indexOf(district.id);
                    selctedDistricts.splice(i, 1);
                }
                // Validate button form
                validate();
            });
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
    let DD = d.getDate() <= 9? '0' + d.getDate(): d.getDate() ;
    let mm = d.getMonth() + 1;
    let MM = mm <= 9? '0' + mm: mm;
    let YYY = d.getFullYear();
    API_URL = `${HospitalAPI}?district_id=${district}&date=${DD}-${MM}-${YYY}` 

    $.get(API_URL , function( hospitalData ) {
        hospitals.push(...hospitalData.centers);

        if(hospitals && hospitals.length){
            comboxInit(hospitalCombox , hospitals , "center_id" , "name", 
            // Add or remove hospital
            (data , hospital)=>{
                if(hospital && hospital.type === "add"){
                    if(!selctedHospitals.includes(hospital.id)){
                        selctedHospitals.push(hospital.id);
                    }
                }
                if(hospital && hospital.type === "remove"){
                    let i = selctedHospitals.indexOf(hospital.id);
                    selctedHospitals.splice(i, 1);
                }
            })
        }
    });
}



function validate(){
   let validName =  $('#name').val()? true : false;
   let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   let validEmail =  $('#emailid').val() && emailRegex.test($('#emailid').val())? true : false;
   let validState =  $('#state').val()? true : false;
   let validDistricts =  selctedDistricts.length > 0 ? true : false;
   let notification = [];
   $("input[name='notification']:checked").each(function(){
       notification.push($(this).val());
   });
   let validNotificationCheck = notification.length > 0 ? true : false;




   if(validName && validEmail && validState && validDistricts && validNotificationCheck){
    registerBtn.removeAttribute('disabled')
   } else {
    registerBtn.setAttribute('disabled' , true)
   }
}


// Name
$('#name').on('keyup', function(){
    validate();
})

// emailid
$('#emailid').on('keyup', function(){
    let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let validEmail =  $('#emailid').val() && emailRegex.test($('#emailid').val())? true : false;
    if(!validEmail){
        email.setAttribute('disabled' , true);
    } else{
        email.removeAttribute('disabled');
        $('#email').attr('checked' , true);
        
    }
    validate();
})

// Mobile 
$('#mobile').on('keyup', function(){
    let phoneno = /^\d{10}$/;
    let validPhone = phoneno.test($(this).val());
    let sms = document.getElementById('sms');
    let whatsapp =  document.getElementById('whatsapp');
    if(!validPhone){
        sms.setAttribute('disabled' , true);
        whatsapp.setAttribute('disabled' , true);
    } else{
        sms.removeAttribute('disabled');
        whatsapp.removeAttribute('disabled');
    }
})
// Notification options
$("input[name='notification']").on('click', function(){
    validate();
});


// Registert
registerBtn.onclick = (e)=> {

    let notification = [];
    $("input[name='notification']:checked").each(function(){
        notification.push($(this).val());
    });

    let dateForm = {
        name: $('#name').val(),
        emailid: $('#emailid').val(),
        mobile: $('#mobile').val(),
        notification,
        selctedState,
        selctedDistricts,
        selctedHospitals,
    }
    console.log(dateForm)
}




/**
 * Combox 
 * **/ 
function comboxInit(combox , collection , id , name, comUpdateCallback ){
    const selectedEl = combox.children[0]; // Slector e;
    const ctrl = combox.children[1]; // Input
    const dropdown = combox.children[2]; // dropdown menu
    let dropdownItems = '';
    let selected = []; // selected 
    // reset first
    selectedEl.innerHTML = '';
    ctrl.value = '';
    dropdown.innerHTML = '';

    // Update dropdown
    const updateDropdown = () => {
        dropdownItems = '';
        collection.forEach(item => {
            if(!item.disable && !item.remove){
                dropdownItems += `<li data-id="${item[id]}">${item[name]}</li>`;
            }
        });
        dropdown.innerHTML = dropdownItems;

        // Select Item from dropdown
        const  dropdownList =  dropdown.children;
        for(let i =0; i < dropdownList.length; i++){
            dropdownList[i].onclick = (e) => {
                let itemId = e.target.dataset.id;
                let itemName = e.target.innerText;
                e.preventDefault();
                e.stopPropagation();
                ctrl.value = '';
                if(selected.findIndex(it => it.id === itemId) === -1 ){
                    updateSelection({
                        id: itemId,
                        name: itemName
                    });

                    comUpdateCallback(selected, {type: 'add', name: itemName , id:  itemId});
                    // Update dropdownlist 
                    collection = collection.map(item => {
                        if(item[id] == itemId){
                            return {...item , remove: true}
                        }
                        return item
                    })
                }
                dropdown.classList.remove('open');
            }
        }
   }

    //Update Selection List
    const updateSelection = ( data) => {
        let selectedItems = '';
        let dataSelected = '';
        selected.push(data);
        selected.forEach(item => {
            selectedItems += `<span data-id="${item.id}" class="item">${item.name}<button class="remove"></button></span>` 
            dataSelected += item.id + ',';
        });
        // update dataset attribute
        combox.dataset.selected = dataSelected;


        // Append Selected items
        selectedEl.innerHTML = selectedItems;
        // Remove Action
        for(let i =0; i < selectedEl.children.length; i++){
            let  selectedItem = selectedEl.children[i];
            let itemRemoveBtn =  selectedItem.children[0];
            let itemId =  selectedItem.dataset.id;
            let itemName =  selectedItem.innerText;
            itemRemoveBtn.onclick = (removeEvent) => {
                removeEvent.preventDefault();
                removeEvent.stopPropagation();
                dropdown.classList.remove('open');
                selectedItem.remove(); // remove Element
                selected = selected.filter(sclIt => sclIt.id !== itemId); // remove from Selected Array

                comUpdateCallback(selected, {type: 'remove', name: itemName , id: itemId});
                
                // update Date set attribute
                dataSelected = dataSelected.replace( itemId + ','  , '')
                combox.dataset.selected = dataSelected;

                collection = collection.map(item => {
                    if(item[id] == itemId || !item.remove) {
                        return {...item , remove: false}
                    }
                    return {...item , remove: true}
                }); 
                updateDropdown();
            }
        }
    }


    document.querySelector('body').onclick = (e) => {
        dropdown.classList.remove('open');
    }

    // Combox click
    combox.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        ctrl.focus();
        textBasedDropdownFilter(ctrl.value)
        dropdown.classList.add('open')
    }

    // Typing on combox
    ctrl.onkeyup = (e) => {
        textBasedDropdownFilter(e.target.value);
    }

    const textBasedDropdownFilter = (text) => {
        collection = collection.map(item => {
            if(item[name].toLowerCase().includes(text.toLowerCase()) && !item.remove) {
                return {...item , disable: false}
            }
            return {...item , disable: true}
        }); 
        updateDropdown();
    }

}

// get cobvalue

function getComboxValue (selector) {
   let combVal = selector.dataset.selected.split(',');
    combVal.pop();
    return combVal;
    
}

