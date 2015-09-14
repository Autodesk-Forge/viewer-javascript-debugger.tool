// MyAuthToken.js
//
// object to encapsulate retrieval of an authorization code for the viewing service.  After declaring
// a global instance, you can repeatedly call value() whenever you need the token to pass to an API
// call.  It will keep track of the expiration of the token and referesh it when necessary.
//
// NOTE: there is another way to accomplish this by just calling the API function with a token without
// worrying about whether it has expired, and then if it returns "Invalid Token", then get a new token
// and retry.  This is possible with jQuery, but only works with the .success()/.error() constructs and 
// not with .done(), .fail() (at least not without a lot of convoluted extra work).  For now, I am 
// happier doing it this way, but am open to suggestions on best practices.
//
// Jim Awe
// Autodesk, Inc.


// CONS MyAuthToken():
// Make a call to the AuthTokenServer to get our authToken to pass on to the View and Data APIs.
// This is setup currently to call my AuthTokenService.  If you want to add your own models to this project
// then you will also have to have your own token service.  Adjust lines below appropriately to point
// to your service (either locally, or deployed on something like Heroku).


function MyAuthToken(env)
{
    if (env === "PROD") {
        //this.tokenService = "http://localhost:5000/auth";
        this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth";
    }
    else if (env === "STG") {
        //this.tokenService = "http://localhost:5000/auth-stg";
        this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth-stg";
    }
    else if (env === "DEV") {
        //this.tokenService = "http://localhost:5000/auth-dev";
        this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth-dev";
    }
    else {
        alert("DEVELOPER ERROR: No valid environment set for MyAuthToken()");
    }
    
    this.token = "";
    this.expires_in = 0;
    this.timestamp = 0;
}

// FUNC value():
// return the value of the token

MyAuthToken.prototype.value = function()
{
        // if we've never retrieved it, do it the first time
    if (this.token === "") {
        console.log("AUTH TOKEN: Getting for first time...");
        this.get();
    }
    else {
            // get current timestamp and see if we've expired yet
        var curTimestamp = Math.round(new Date() / 1000);   // time in seconds
        var secsElapsed = curTimestamp - this.timestamp;
        
        if (secsElapsed > (this.expires_in - 10)) { // if we are within 10 secs of expiring, get new token
            console.log("AUTH TOKEN: expired, refreshing...");
            this.get();
        }
        else {
            var secsLeft = this.expires_in - secsElapsed;
            console.log("AUTH TOKEN: still valid (" + secsLeft + " secs)");
        }
    }
    
    return this.token;      
};

// FUNC get():
// get the token from the Authentication service and cache it, along with the expiration time

MyAuthToken.prototype.get = function()
{
    var retVal = "";
    var expires_in = 0;
    
    var jqxhr = $.ajax({
        url: this.tokenService,
        type: 'GET',
        async: false,
        success: function(ajax_data) {
            console.log("AUTH TOKEN: " + ajax_data.access_token);
            retVal = ajax_data.access_token;  // NOTE: this only works because we've made the ajax call Synchronous (and "this" is not valid in this scope!)
            expires_in = ajax_data.expires_in;

        },
        error: function(jqXHR, textStatus) {
            alert("AUTH TOKEN: Failed to get new auth token!");
        }
    });
    
    this.token = retVal;
    this.expires_in = expires_in;
    this.timestamp = Math.round(new Date() / 1000);  // get time in seconds when we retrieved this token
};

