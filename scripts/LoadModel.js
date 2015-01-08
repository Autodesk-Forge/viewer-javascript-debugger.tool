
// LoadModel.js
//
// This file handles changing Models and Views (3D/2D).  All the models come from my bucket and are authorized by 
// a AuthToken Service running in the cloud.  If you want to extend this, you'll have to clone the AuthTokenServer 
// project and setup your own version with the appropriate ConsumerKey and SecretKey from your app.
//
// Jim Awe
// Autodesk, Inc.

    // some global vars  (TBD: consider consolidating into an object)
var _viewer = null;     // the viewer
var _curSelSet = [];    // init to empty array
var _savedGlobalCamera = null;
var _loadedDocument = null;
var _views2D = null;
var _views3D = null;
var _savedViewerStates = [];

    // setup for STAGING
var _viewerEnv = "AutodeskStaging";
var _myAuthToken = new MyAuthToken("STG");

var _lmvModelOptions = [
    { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9VcmJhbiUyMEhvdXNlJTIwLSUyMDIwMTUucnZ0"},
    { label : "Urban House (Revit - 11-18)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3N0Zy9VcmJhbiUyMEhvdXNlJTIwLSUyMDIwMTUucnZ0"},
    
    { label : "rme-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9ybWVfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0"},
    { label : "ViewTest1 (Revit)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9WaWV3VGVzdDEucnZ0"},
    { label : "Factory (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9Db21wbGV0ZWQlMjBQbGFudCUyMExheW91dCUyMGNvbnN0cnVjdGlvbi5ud2Q="},
    { label : "Lego Guy (Fusion)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9sZWdvX2d1eTIwMTQwMTMxMDkxOTU4LmYzZA=="},
    { label : "Utility Knife (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9VdGlsaXR5X0tuaWZlMjAxNDAxMjkxNDAwNDEuZjNk"}
];

    // setup for PRODUCTION
/*var _viewerEnv = "AutodeskProduction";
var _myAuthToken = new MyAuthToken("PROD");

var _lmvModelOptions = [
    { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvVXJiYW4lMjBIb3VzZSUyMC0lMjAyMDE1LnJ2dA=="},
    { label : "rme-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2Qvcm1lX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA=="},
    { label : "Audobon Structure (Revit)",  urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvQXVkb2JvbiUyMC0lMjBTdHJ1Y3R1cmUucnZ0"},
    { label : "Factory (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9Db21wbGV0ZWQlMjBQbGFudCUyMExheW91dCUyMGNvbnN0cnVjdGlvbi5ud2Q="},
    { label : "Gatehouse (Navisworks)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9nYXRlaG91c2UyLm53ZA=="},
    { label : "Lego Man (Fusion)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9sZWdvX2d1eTIwMTQwMTMxMDkxOTU4LmYzZA=="},
    { label : "Utility Knife (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9VdGlsaXR5X0tuaWZlMjAxNDAxMjkxNDAwNDEuZjNk"},
    { label : "Fender Guitar (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9GZW5kZXJfU3RyYXRfTlguc3RwLmM5ZTZhODg0LWU0NWItNGQ3ZC1iNjcyLTY2NjM1OTVhYTRkOTIwMTQwMjIwMTA0OTA3LmYzZA=="},
    { label : "Whiskey Drinks (DWG)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2Qvd2hpc2tleS1kcmlua3MuZHdn"}
    
    //{ label : "View Test (OLD VERSION)",    urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0L1ZpZXdUZXN0Mi5ydnQ"},
    //{ label : "Lego Guy (OLD VERSION)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0L2xlZ29fZ3V5MjAxNDAxMzEwOTE5NThfY29weS5mM2Q="},
    //{ label : "Fender Guitar (OLD VERSION)",    urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0L0ZlbmRlcl9TdHJhdF9OWC5zdHAuYzllNmE4ODQtZTQ1Yi00ZDdkLWI2NzItNjY2MzU5NWFhNGQ5MjAxNDAyMjAxMDQ5MDcuZjNk"}
];*/

    // when we switch models, we want to reset the UI for the Try It form or it might have left over
    // data about selection sets and stuff that isn't valid anymore.
function blankOutTryItForm() {
    $("div.lmvDbg_swap").empty();
    $("code.language-markup").empty();
}

    // populate the popup menu with the avaialable models to load (from the array above)
function loadModelMenuOptions() {
        // add the new options for models
    var sel = $("#pu_modelToLoad");
    $.each(_lmvModelOptions, function(i, item) {
        sel.append($("<option>", { 
            value: i,
            text : item.label 
        }));
    });
}

    // user selected a new model to load
 $("#pu_modelToLoad").change(function(evt) {  
    evt.preventDefault();
     
     blankOutTryItForm();

    var index = parseInt($("#pu_modelToLoad option:selected").val(), 10);
    console.log("Changing model to: " + _lmvModelOptions[index].label);
    loadDocument(_lmvModelOptions[index].urn);
});

    // populate the popup menu with the avaialable views to load (from the array above)
function loadViewMenuOptions() {
    var sel = $("#pu_viewToLoad");
    
    sel.find("option").remove().end();  // remove all existing options
    
            // add the 3D options
    $.each(_views3D, function(i, item) {
        sel.append($("<option>", { 
            value: i,
            text : item.name 
        }));
    });
    
    sel.append($("<option disabled>─────────────────</option>"));    // add a separator
    
        // add the 2D options
    $.each(_views2D, function(i, item) {
        sel.append($("<option>", { 
            value: i + 1000,    // make 2D views have a value greater than 1000 so we can tell from 3D
            text : item.name 
        }));
    });
}

    // user selected a new view to load
 $("#pu_viewToLoad").change(function(evt) {  
    evt.preventDefault();
     
     blankOutTryItForm();

    var index = parseInt($("#pu_viewToLoad option:selected").val(), 10);
     
    if (index >= 1000) {    // 2D views we gave a higher index to in the Popup menu
        index -= 1000;
        console.log("Changing to 2D view: " + _views2D[index].name);
        //initializeViewer();
        switchSheet();
        loadView(_views2D[index]);
    }
    else {
        console.log("Changing to 3D view: " + _views3D[index].name);
        //initializeViewer();
        switchSheet();
        loadView(_views3D[index]);
    }
});

    // As of build 0.1.204, you can switch sheets more directly instead of completely
    // initializing a new viewer.  But, we stil want to reset our global vars that keep
    // track of things like our current selection set.
function switchSheet() {
    
    if (_viewer !== null) {
        _viewer.tearDown();     // delete everything associated with the current loaded asset
        _curSelSet = [];
        _savedGlobalCamera = null;
        _savedViewerStates = [];
    }

    _viewer.setUp();    // set it up again for a new asset to be loaded
}

// STEPS:
//  0)  Initialize the Viewing Runtime
//  1)  Load a Document
//  2)  Get the available views (both 2D and 3D)
//  3)  Load a specific view
//      a)  initialize viewer for 2D or 3D
//      b)  load a "viewable" into the appropriate version of the viewer
//  4)  Attach a "listener" so we can keep track of events like Selection


    // initialize the viewer into the HTML placeholder
function initializeViewer() {
    
    if (_viewer !== null) {
        _viewer.uninitialize();
        _viewer = null;
        _curSelSet = [];
        _savedGlobalCamera = null;
        _savedViewerStates = [];
    }

    var viewerElement = document.getElementById("viewer");  // placeholder in HTML to stick the viewer
        
        // NOTE: as of October 2014, both 2D and 3D use the Viewer3D object.  But, that requires newly translated
        // content.  2D sheets translated before that date will not work in this viewer and you need some logic
        // to invoke the old Viewer2D object.
        // ALSO: because the use the same viewer object, the same API exists for both 2D and 3D, but some functions
        // obviously don't make sense in 2D.  The viewer object will have to be split into two or the API will have
        // to be more forgiving when called in the wrong context.  We will fix this as we move forward, but for now,
        // the "bad" answer is:  "don't do that!".
    _viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   
    var retCode = _viewer.initialize();
    if (retCode !== 0) {
        alert("ERROR: Couldn't initialize viewer!");
        console.log("ERROR Code: " + retCode);      // TBD: do real error handling here
    }
    _viewer.addEventListener("selection", function (event) {
        _curSelSet = event.dbIdArray;
        console.log("LmvDbg: [Selection Set]: ", _curSelSet);
        
            // if a single item, help debug by dumping it to the console window.
        if (_curSelSet.length == 1) {
            var tmpObj = _viewer.model.getNodeById(_curSelSet[0]);
            if (tmpObj)     // NOTE: 2D still returns Null for this because its not implemented
                console.debug(tmpObj);
        }
    });
    
        // NOTE: other events you can respond to:
    //Autodesk.Viewing.GEOMETRY_LOADED_EVENT       = 'geometry_loaded';
    //Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT    = 'frag->node array created';

    //Autodesk.Viewing.SELECTION_CHANGED_EVENT     = 'selection';
    //Autodesk.Viewing.ISOLATE_EVENT               = 'isolate';
    //Autodesk.Viewing.HIDE_EVENT                  = 'hide';
    //Autodesk.Viewing.SHOW_EVENT                  = 'show';
    //Autodesk.Viewing.HIGHLIGHT_EVENT             = 'highlight';

    //Autodesk.Viewing.CAMERA_CHANGE_EVENT         = 'cameraChanged';
    //Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT = 'renderOptionChanged';
}


    // load a specific document into the intialized viewer
function loadDocument(urnStr) {
    
    _loadedDocument = null; // reset to null if reloading

    if (!urnStr || (0 === urnStr.length)) {
        alert("You must specify a URN!");
        return;
    }
    var fullUrnStr = "urn:" + urnStr;
    
    Autodesk.Viewing.Document.load(fullUrnStr, function(document) {
        _loadedDocument = document; // keep this in a global var so we can reference it in other spots

            // get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UX)
        _views3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'3d'}, true);
        _views2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'2d'}, true);
        
        loadViewMenuOptions();                   // populate UX with views we just retrieved
        initializeViewer();
        
            // load up first 3D view by default
        if (_views3D.length > 0) {
            loadView(_views3D[0]);   
        }
        else if (_views2D.length > 0) {
            loadView(_views2D[0]);  
        }
        else {
            assert("ERROR: Can't find any Views in the current model!");
        }
        
    }, function(errorCode, errorMsg) {
        alert('Load Error: ' + errorMsg);
    });
}

    // for now, just simple diagnostic functions to make sure we know what is happing
function loadViewSuccessFunc()
{
    console.log("Loaded viewer successfully with given asset...");
}

function loadViewErrorFunc()
{
    console.log("ERROR: could not load asset into viewer...");
}

    // load a particular viewable into the viewer
function loadView(viewObj) {
    var path = _loadedDocument.getViewablePath(viewObj);
    console.log("Loading view URN: " + path);
    _viewer.load(path, _loadedDocument.getPropertyDbPath(), loadViewSuccessFunc, loadViewErrorFunc);
    //_viewer.load(path);
}

    // wrap this in a simple function so we can pass it into the Initializer options object
function getAccessToken() {
    return _myAuthToken.value();
}

    // called when HTML page is finished loading, trigger loading of default model into viewer
function loadInitialModel() {       
    loadModelMenuOptions();                  // populate the list of available models for the user
    
    var options = {};
    options.env = _viewerEnv;                // AutodeskProduction, AutodeskStaging, or AutodeskDevelopment (set in global var in this project)
    options.getAccessToken = getAccessToken;
    options.refreshToken   = getAccessToken;
    
    Autodesk.Viewing.Initializer(options, function() {
        loadDocument(_lmvModelOptions[0].urn);   // load first entry by default
    });
}
