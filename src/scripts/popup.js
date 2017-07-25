import ext from "./utils/ext";
import storage from "./utils/storage";


var popup = document.getElementById("app");

storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

// TODO: Take these values from the DB file
var LoadEntityMenu = () => {
  return (`
  <select id="entitySelection">
    <option value="Account">Account</option>
    <option value="Work Order">Work Order</option>
    <option value="Product">Product</option>
    <option value="Vendor">Vendor</option>
  </select>
`)
}

// This is the jsx for the popup window
var dialog = () => {
  return (`
  <div class="site-description">
    <h3 class="title">Choose an entity:</h3>
    ${LoadEntityMenu()}
  </div>
  <div class="action-container">
    <button id="select-entity-btn" class="btn btn-primary">Select entity</button>
  </div>
  `);
}

var form = (entityName) => {
  return (`
  <div class="site-description">
    <h3 class="title">Create: ${entityName}</h3>
    <p class="description">this will one day be a form</p>
  </div>
  <div class="action-container">
    <button id="create-entity-btn" class="btn btn-primary">Build entity</button>
  </div>
  `);
}

// Utility method to send text to the #display-container
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

// Callback to modify UI after executing action
var renderDialog = () => {
  console.log("hello")
  var displayContainer = document.getElementById("display-container")

  if (displayContainer) {
    var content = dialog();
    displayContainer.innerHTML = content;
  } else {
    renderMessage("Sorry, your alread buggy software hit an unsupported flow. Good going...")
  }
}

var renderCreateForm = (entityName) => {
  var displayContainer = document.getElementById("display-container")

  if (displayContainer) {
    var content = form(entityName);
    displayContainer.innerHTML = content;
  } else {
    renderMessage("Sorry, your aleady buggy software hit an unsupported flow. Good going...")
  }
}

// Load step
renderDialog()

// ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   console.log("click")
//   var activeTab = tabs[0];
//   chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderDialog);
// });

// Selected entity, retrieve form attributes
popup.addEventListener("click", function(e) {
  debugger
  if(e.target && e.target.matches("#select-entity-btn")) {
    e.preventDefault();

    ext.runtime.sendMessage({ action: "create-entity", data: {test:"test"} }, function(response) {
      if (response && response.action === "saved") {
        var selection = document.getElementById('entitySelection');
        renderCreateForm(selection.value)
      } else {
        renderMessage("Sorry, your already buggy software hit an unsupported flow. Good going...");
      }
    })
  }
});

// Selected create entity, built entity
popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#create-entity-btn")) {
    e.preventDefault();

    ext.runtime.sendMessage({ action: "create-entity", data: {test:"test"} }, function(response) {
      if (response && response.action === "saved") {
        renderMessage("Lazy developers need to get it together");
      } else {
        renderMessage("Sorry, your already buggy software hit an unsupported flow. Good going...");
      }
    })
  }
});

// Displays options link on bottom of dialog
var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
