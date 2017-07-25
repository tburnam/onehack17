import ext from "./utils/ext";
import storage from "./utils/storage";


var popup = document.getElementById("app");

storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var LoadEntityMenu = () => {
  return (`
  <select>
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
    <p class="description">this will one day be a selection box</p>
  </div>
  <div class="action-container">
    <button id="save-btn" class="btn btn-primary">Create entity</button>
  </div>
  `);
}

// Utility method to send text to the #display-container
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

// Callback to modify UI after executing action
var renderBookmark = (data) => {
  debugger
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = dialog();
    displayContainer.innerHTML = tmpl;
  } else {
    renderMessage("Sorry, your already buggy software hit an unsupported flow. Good going...")
  }
}
debugger
renderBookmark(1)
loadAutoComplete()

// ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   console.log("click")
//   var activeTab = tabs[0];
//   chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
// });

// Adds an event handler for #create-entity
popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    var data = e.target.getAttribute("data-bookmark");
    ext.runtime.sendMessage({ action: "create-entity", data: data }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your entity was not created! Good luck doing it manually loser");
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
