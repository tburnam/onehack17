// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// ENTRY POINT
// Loads a selection box with given list
function loadEntrypoint(entities) {
  var options = "<center><select id ='selectEntityDrop'>"
  entities.forEach(function(element) {
    options = options + "\n<option>" + element.name + "</option>\n"
  });
  options = options + "</select></center><button onclick=\"selectEntity()\">Build entity</button>"
  document.getElementById("main-container").innerHTML = options
  document.getElementsByTagName('body')[0].focus();
}

// Calls when a selection is made from the entity drop down
function selectEntity(e) {
  debugger;
  var selectedEntity = document.getElementById("selectEntityDrop").value;
  document.getElementById("main-container").innerHTML = loadForm(selectedEntity);
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

function validateUser() {
  document.clientUrl = document.getElementById("clientUrl").value;
  document.clientUsername = document.getElementById("clientUsername").value;
  document.clientPassword = document.getElementById("clientPassword").value;
  // TODO: validate is a correct CRM service.

  // evaluateJs(retrieveAccountUsingWebAPI, loadSelectionScreen);
  // retrieve entities
  retrieveEntitiesUsingWebAPI();

  // retrieve account
  // retrieveRequiredAttributesUsingWebAPI("70816501-edb9-4740-a16c-6a5efbc05d84");

  // create account

  // var entity = JSON.stringify({
  //       "name": "ppp",
  //       "creditonhold": false,
  //       "address1_latitude": 47.639583,
  //       "description": "This is the description of the sample account",
  //       "revenue": 5000000,
  //       "accountcategorycode": 1
  //   });
  // createEntityUsingWebAPI("accounts", entity);
}


function createEntityUsingWebAPI(entitySetName,entity) {
    var inputParams = {};
    inputParams.requestType = "POST";
    inputParams.url = document.clientUrl + "/api/data/v8.2/" + entitySetName;
    inputParams.username = document.clientUsername;
    inputParams.password = document.clientPassword;
    inputParams.data = entity;
    sendRequest(inputParams)
    // .then(parseMetadataAttributes)
    .catch(function (err) {
      console.error(err);
    });
}

function retrieveRequiredAttributesUsingWebAPI(entityId) {
    var inputParams = {};
    inputParams.requestType = "GET";
    inputParams.url = document.clientUrl + "/api/data/v8.2/EntityDefinitions(" + entityId + ")?$select=LogicalName&$expand=Attributes($select=RequiredLevel,DisplayName)";
    inputParams.username = document.clientUsername;
    inputParams.password = document.clientPassword;
    sendRequest(inputParams)
    .then(parseMetadataAttributes)
    .catch(function (err) {
      console.error(err);
    });
}


function parseMetadataAttributes(metadataAttributes) {
  var attributes = [];
  for (idx in metadataAttributes.Attributes) {
    var attribute = metadataAttributes.Attributes[idx];
    // console.log(entity, entity.DisplayName.UserLocalizedLabel, entity.DisplayName.UserLocalizedLabel.Label);
    if (attribute.RequiredLevel.Value !== "None") {
      attributes.push(attribute);
    }
  }
  console.log(attributes);
}

function retrieveEntitiesUsingWebAPI() {
    var inputParams = {};
    inputParams.requestType = "GET";
    inputParams.url = document.clientUrl + "/api/data/v8.2/EntityDefinitions?$select=DisplayName,EntitySetName";
    inputParams.username = document.clientUsername;
    inputParams.password = document.clientPassword;
    sendRequest(inputParams)
    .then(parseMetadataEntities)
    .catch(function (err) {
      console.error(err);
    });
}

function parseMetadataEntities(metadataEntities) {
  var entities = [];
  for (idx in metadataEntities.value) {
    var entity = metadataEntities.value[idx];
    // console.log(entity, entity.DisplayName.UserLocalizedLabel, entity.DisplayName.UserLocalizedLabel.Label);
    if (entity.DisplayName.UserLocalizedLabel !== null) {
      entities.push({
        id: entity.MetadataId,
        name: entity.DisplayName.UserLocalizedLabel.Label,
        setName: entity.EntitySetName
      });
    }
  }
  entities.sort(function(a,b) {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });

  document.entities = entities;
  console.log(entities);
  loadEntrypoint(entities);
}


function sendRequest(inputParams) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    var response;
    req.open(inputParams.requestType, encodeURI(inputParams.url), true, inputParams.username, inputParams.password);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
      if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 200) {
              var result = JSON.parse(this.response);
              console.log(result);
              resolve(result);
          } else if (this.status == 204) {
            // Success but no response
            // With the next line we can get the entity form of the new entity.
            var accountUri = this.getResponseHeader("OData-EntityId");
            console.log(accountUri);
          }
          else {
              reject({
                status: this.status,
                statusText: this.statusText
              });
          }
      }
    };
    req.send(inputParams.data);
  });
}