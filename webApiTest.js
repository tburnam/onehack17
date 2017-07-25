
// Create an Account entity
function createAccountUsingWebAPI() {
    var clientUrl = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("POST", encodeURI(clientUrl + "/api/data/v8.0/accounts"), true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        var accountUri = this.getResponseHeader("OData-EntityId");
    };
    var body = JSON.stringify({
        "name": "Sample Account",
        "creditonhold": false,
        "address1_latitude": 47.639583,
        "description": "This is the description of the sample account",
        "revenue": 5000000,
        "accountcategorycode": 1
    });
    req.send(body);
}


// Retrieve an Account entity
function retrieveAccountUsingWebAPI() {
    var clientUrl = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", encodeURI(clientUrl + "/api/data/v8.2/EntityDefinitions?$select=DisplayName,EntitySetName&$filter=SchemaName eq 'Account'"), true);
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
                console.log("Id we need is: " + result.value[0].MetadataId);
            }
            else {
                alert(this.statusText);
            }
        }
    };
    req.send();
}

// Retrieve an Account attributes
function retrieveAccountAttributesUsingWebAPI() {
    var clientUrl = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", encodeURI(clientUrl + "/api/data/v8.2/EntityDefinitions(70816501-edb9-4740-a16c-6a5efbc05d84)?$select=LogicalName&$expand=Attributes($select=RequiredLevel)"), true);
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
            }
            else {
                alert(this.statusText);
            }
        }
    };
    req.send();
}
