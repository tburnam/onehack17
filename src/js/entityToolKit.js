function createEntityUsingWebAPI(entity) {
    var inputParams = {};
    inputParams.requestType = "POST";
    inputParams.url = document.clientUrl + "/api/data/v8.2/accounts";
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
    inputParams.url = document.clientUrl + "/api/data/v8.2/EntityDefinitions?$select=DisplayName";
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
      entities.push({id: entity.MetadataId, name: entity.DisplayName.UserLocalizedLabel.Label});
    }
  }
  document.entities = entities;
  console.log(entities);
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