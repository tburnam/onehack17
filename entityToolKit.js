function createAccountUsingWebAPI() {
    alert("title")
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
        "name": "Panchiiiiii",
        "creditonhold": false,
        "address1_latitude": 47.639583,
        "description": "This is the description of the sample account",
        "revenue": 5000000,
        "accountcategorycode": 1
    });
    req.send(body);
}

createAccountUsingWebAPI()
