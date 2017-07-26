// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// ENTRY POINT
document.crmDataStore = {}

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

function checkForSubmit() {
  for (var key in document.crmDataStore) {
    if (document.crmDataStore.hasOwnProperty(key)) {
      if (document.crmDataStore[key] == null) {
        return false;
      }
    }
  }
  return true
}

// Returns HTML for a form given an entity name
function loadForm(entity) {

  // TODO: Get required fields
  requiredFields = ["Name", "Country", "Phone Number", "Type Code"]

  var form = "";
  requiredFields.forEach(function(element) {
    // Update data store
    document.crmDataStore[element] = null

    form = form + createInput(element)
  })
  form = form + "Qty:<br><form><input type=\"number\"><br><input type=\"submit\"></form>"
  return form
}

// Editor
// <pre id="editor">function foo(items) {
//     var i;
//     for (i = 0; i &lt; items.length; i++) {
//         alert("Ace Rocks " + items[i]);
//     }
// }</pre>
// <script src="../../src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
// <script>
//     var editor = ace.edit("editor");
//     editor.setTheme("ace/theme/monokai")
//     editor.session.setMode("ace/mode/javascript");
// </script>

// Utility method to create a form input line
function createInput(item) {
  return item + " | <button onClick=openJS(this)>Add JS</button><br>"
}

function openJS(a) {
  const path = require('path');
  const url = require('url')

  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  var jsPopup = new BrowserWindow({ width: 450, height: 600 });

  jsPopup.webContents.on('did-finish-load', ()=>{
   jsPopup.show();
   jsPopup.focus();
  });

  // and load the index.html of the app.
  jsPopup.loadURL(url.format({
    pathname: path.join(__dirname, '../html/js.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  jsPopup.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    jsPopup = null
  })
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
