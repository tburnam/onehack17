import ext from "./utils/ext";

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "create-entity") {
      console.log("Received action to create entity")

      sendResponse({ action: "saved" });
    }
  }
);
