


/**
 * Combox
 * **/
 export const comboxInit = (combox, collection, params, comUpdateCallback) => {
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
            ${item[params.address] ? ", " + item[params.address] : ""}
  
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
  
    // Combox click
    combox.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      ctrl.focus();
      textBasedDropdownFilter(ctrl.value);
      // Show Dropdown menu
      document.querySelectorAll('.combox-dropdown').forEach(ddMenu => {
        if (ddMenu !== dropdown) {
          ddMenu.classList.remove('open');
        } else{
          dropdown.classList.add("open");
        }
      });
    };
  
    // Typing on combox
    ctrl.onkeyup = (e) => {
      if(e.keyCode == 13 || e.key == 'Enter'){
        dropdown.classList.remove("open");
        e.target.value = '';
      }
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



      // let touchEvent = 'ontouchstart' in window ? 'touchstart ' : 'click';
    // Outside click hide dropdown
    window.addEventListener('click', (event)=>{
        if (!event.target.matches('combox')) {
        document.querySelectorAll('.combox-dropdown').forEach(ddMenu => {
            if (ddMenu.classList.contains('open')) {
            ddMenu.classList.remove('open');
            }
        });
        }
    });
  }
  
  // get cobvalue
  
  function getComboxValue(selector) {
    let combVal = selector.dataset.selected.split(",");
    combVal.pop();
    return combVal;
  }