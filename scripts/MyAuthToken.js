/**
 * Created by awej on 7/15/14.
 */

/*

This is based on a local token service from Ben Cochran (code available upon request).  Need to set it up locally with
installed copy of Node.js, and then run the following from the command line:

 Start Node server:  bash$ node theAppServer.js 8080 _consumerKey _consumerSecret&

Then, run your page from:  http://localhost/~username/AppDirectory/index.html

TODO:
    1)  make this class smarter to only refresh the token when necessary
    2)  package up the service into something redistributable so 3rd Parties don't have to roll their own to get going.

 */

// locally running token service (start with above Node.js command)
function MyAuthToken()
{
    //this.tokenService = "http://localhost:8080/auth";
    this.tokenService = "https://lmvdbgauth.iab.app42paas.com/auth";
}


MyAuthToken.prototype.httpRequest = function(url)
{
    var retval = "";

    if (window.XMLHttpRequest) {
        xmlHttp=new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        retval = xmlHttp.responseText;
    }
    else {
        alert ("Browser Not Supported!");
    }

    return retval;
};

MyAuthToken.prototype.get = function()
{
    var httpResponse = this.httpRequest(this.tokenService);
    var authParts = JSON.parse(httpResponse);
    return authParts.access_token ? authParts.access_token : "";
}