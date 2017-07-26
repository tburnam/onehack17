// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// ENTRY POINT
// Loads a selection box with given list
var entities = ["Account", "Work order", "Sale", "Product"]
var options = "<center><select>"
entities.forEach(function(element) {
  options = options + "\n<option>" + element + "</option>\n"
});
options = options + "</select></center><button onclick=\"selectEntity()\">Build entity</button>"
document.getElementById("main-container").innerHTML = options
document.getElementsByTagName('body')[0].focus();


// Calls when a selection is made from the entity drop down
function selectEntity(e) {
  document.getElementById("main-container").innerHTML = loadForm("account");
  document.getElementsByTagName('body')[0].focus();
}

// Returns HTML for a form given an entity name
function loadForm(entity) {

  // TODO: Get required fields
  requiredFields = ["Name", "Country", "Phone Number", "Type Code"]

  var form = "<form>"
  requiredFields.forEach(function(element) {
    form = form + createInput(element)
  })
  form = form + "Qty:<br><input type=\"number\"><br><input type=\"submit\"></form>"
  return form
}

// Utility method to create a form input line
function createInput(item) {
  return item + ":<br><div id=\"input\"><input type=\"text\" name=" + item + "><input type=\"radio\"><div id=\"random\">Random?</div><br>"
}


// Deprecated test method for bot-CRM access
function test() {
  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  var phantomPath = "./binaries/spectrejs"
  if (!isMac) {
    phantomPath = "phantomjs.exe"
  }

  var Horseman = require('node-horseman');
  var horseman = new Horseman({phantomPath: phantomPath});

  horseman
    .authentication('Administrator', 'T!T@n1130')
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://10.125.227.31/contoso/m/default.aspx')
    .injectJs('./entityToolKit.js')
    .screenshot("test.png")
    .close();
}
