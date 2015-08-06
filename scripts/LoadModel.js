
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
var _savedGlobalCamera = null;
var _loadedDocument = null;
var _views2D = null;
var _views3D = null;
var _savedViewerStates = [];

    // setup for STAGING
/*var _viewerEnv = "AutodeskStaging";
var _myAuthToken = new MyAuthToken("STG");

var _lmvModelOptions = [
    { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3N0Zy9VcmJhbiUyMEhvdXNlJTIwLSUyMG5ldy5ydnQ="},
    { label : "rme-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9ybWVfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0"},
    { label : "ViewTest1 (Revit)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9WaWV3VGVzdDEucnZ0"},
    { label : "Factory (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9Db21wbGV0ZWQlMjBQbGFudCUyMExheW91dCUyMGNvbnN0cnVjdGlvbi5ud2Q="},
    { label : "Lego Guy (Fusion)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9sZWdvX2d1eTIwMTQwMTMxMDkxOTU4LmYzZA=="},
    { label : "Utility Knife (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9VdGlsaXR5X0tuaWZlMjAxNDAxMjkxNDAwNDEuZjNk"},
    { label : "2D Floorplan (DWG)",         urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3N0Zy8yRCUyMEZsb29ycGxhbi5kd2c="}
];*/

    // setup for PRODUCTION
var _viewerEnv = "AutodeskProduction";
var _myAuthToken = new MyAuthToken("PROD");

var _lmvModelOptions = [
    { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvVXJiYW4lMjBIb3VzZSUyMC0lMjAyMDE1LTIucnZ0"},
    // OLD: { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvVXJiYW4lMjBIb3VzZSUyMC0lMjBuZXcucnZ0"},
    { label : "Chruch (Revit)",             urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvQ2h1cmNoUmVub3ZhdGlvbjIucnZ0"},
    { label : "SaRang - Struct (Revit)",    urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvU2FSYW5nLVN0cnVjdHVyZS0yMDE1LnJ2dA=="},
    { label : "SaRang - ArchBase (Revit)",  urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvU2FSYW5nLUFyY2gtQmFzZS0yMDE1LnJ2dA=="},
    { label : "SaRang - ArchSkin (Revit)",  urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvU2FSYW5nLUFyY2gtU2tpbi0yMDE1LnJ2dA=="},
    { label : "rac-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA=="},
    { label : "rme-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2Qvcm1lX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA=="},
    { label : "Audobon Structure (Revit)",  urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvQXVkb2JvbiUyMC0lMjBTdHJ1Y3R1cmUucnZ0"},
    
    { label : "Factory (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9Db21wbGV0ZWQlMjBQbGFudCUyMExheW91dCUyMGNvbnN0cnVjdGlvbi5ud2Q="},
    { label : "Gatehouse (Navisworks)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9nYXRlaG91c2UyLm53ZA=="},
    { label : "Trapelo (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvVFJBUEVMTy5ud2Q="},
    { label : "Millenium (Navisworks)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvTWlsbGVuaXVtJTIwU3VwZXJtYXJrZXQubndk"},
    
    { label : "Lego Man (Fusion)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9sZWdvX2d1eTIwMTQwMTMxMDkxOTU4LmYzZA=="},
    { label : "Utility Knife (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9VdGlsaXR5X0tuaWZlMjAxNDAxMjkxNDAwNDEuZjNk"},
    { label : "Fender Guitar (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0NC9GZW5kZXJfU3RyYXRfTlguc3RwLmM5ZTZhODg0LWU0NWItNGQ3ZC1iNjcyLTY2NjM1OTVhYTRkOTIwMTQwMjIwMTA0OTA3LmYzZA=="},
    { label : "Go Kart (Fusion)",           urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvZ29rYXJ0LVY0LmYzZA=="},
    { label : "Rally Fighter (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvUmFsbHlGaWdodGVyMi5mM2Q="},
    
    { label : "Whiskey Drinks (DWG)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2Qvd2hpc2tleS1kcmlua3MuZHdn"},
    { label : "Slip Form Paver (DWG)",      urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvU2xpcCUyMEZvcm0lMjBQYXZlci5kd2c="},
    { label : "Engine (DWG)",               urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvRW5naW5lJTIwTUtJSS5kd2c="},
    
    { label : "AC11 Institute (IFC)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRza19xdWlja3N0YXJ0L0FDMTEtSW5zdGl0dXRlLVZhci0yLUlGQy5pZmM="},
    { label : "Hunter Residence (SKP)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvTUFUVEhFV19IVU5URS1SRVMtMDRfRVBELnNrcA=="},
];

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
        switchSheet();
        loadView(_views2D[index]);
    }
    else {
        console.log("Changing to 3D view: " + _views3D[index].name);
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
        _savedGlobalCamera = null;
        _savedViewerStates = [];
    }

    _viewer.setUp();    // set it up again for a new asset to be loaded
}


    // initialize the viewer into the HTML placeholder
function initializeViewer() {
    
    if (_viewer !== null) {
        //_viewer.uninitialize();
        _viewer.finish();
        _viewer = null;
        _savedGlobalCamera = null;
        _savedViewerStates = [];
    }

    var viewerElement = document.getElementById("viewer");  // placeholder in HTML to stick the viewer
    
    _viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   
    var retCode = _viewer.initialize();
    if (retCode !== 0) {
        alert("ERROR: Couldn't initialize viewer!");
        console.log("ERROR Code: " + retCode);      // TBD: do real error handling here
    }
    
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
        
        // TEST:  trying out loading only specific objects instead of the whole model.  Almost works, but needs
        // a little bit of polish.
    //var idArray = [1023, 1018, 1898];   // hardwire 3 walls of default revit file
    //_viewer.loadModel(path, idArray, _loadedDocument.getPropertyDbPath(), loadViewSuccessFunc, loadViewErrorFunc);
    
    _viewer.load(path, _loadedDocument.getPropertyDbPath(), loadViewSuccessFunc, loadViewErrorFunc);
}

    // wrap this in a simple function so we can pass it into the Initializer options object
function getAccessToken() {
    return _myAuthToken.value();
}

    // called when HTML page is finished loading, trigger loading of default model into viewer
function loadInitialModel() {
    dbgPrintLmvVersion();
    
    loadModelMenuOptions();                  // populate the list of available models for the user
    
    var options = {};
    options.env = _viewerEnv;                // AutodeskProduction, AutodeskStaging, or AutodeskDevelopment (set in global var in this project)
    options.getAccessToken = getAccessToken;
    options.refreshToken   = getAccessToken;
    
    Autodesk.Viewing.Initializer(options, function() {
        loadDocument(_lmvModelOptions[0].urn);   // load first entry by default
    });
}
