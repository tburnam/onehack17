import ext from "./utils/ext";
import storage from "./utils/storage";

console.log("First load")
var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  var json = JSON.stringify(data);
  return (`
  <div class="site-description">
    <h3 class="title">Choose an entity:</h3>
    <p class="description">this will one day be a selection box</p>
  </div>
  <div class="action-container">
    <button data-bookmark='${json}' onClick='${() => {console.log("hello!")}}' id="save-btn" class="btn btn-primary">Create entity</button>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;
  } else {
    renderMessage("Sorry, your already buggy software hit an unsupported flow. Good going...")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

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

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
