// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
function test() {
  var Horseman = require('node-horseman');
  var horseman = new Horseman({phantomPath: "phantomjs.exe"});

  horseman
    .authentication('Administrator', 'T!T@n1130')
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://10.125.227.31/contoso/m/default.aspx')
    .injectJs('./entityToolKit.js')
    .screenshot("test.png")
    .close();

}
