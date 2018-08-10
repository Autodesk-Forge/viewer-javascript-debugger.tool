# Viewer Debugger

[![Viewer](https://img.shields.io/badge/Viewer-v1.2.23-green.svg)](https://developer.autodesk.com/api/view-and-data-api/)

This sample uses an old version on the API and will need to be reviewed, until then will be offline.

Designed to test out all the API functions of the <b>Viewer</b>. You can use as a learning and diagnostic tool for the library and to steal source code snippets to jumpstart your own app.

The models available to use and Forge Client ID & Secret keys are hardwired into the code for this app.  If you want to add your own models, you will have to get them translated to produce your unique URNS. Then you will need to swap out the AuthTokenServer reference in MyAuthToken.js (currently pointing to testing token service).  If you need suggestions on how to create your own AuthTokenService, there is a tutorial [here](https://developer.autodesk.com/en/docs/oauth/v2/tutorials/get-2-legged-token/):  

See the README file that is part of the live app (by clicking on the README link) for more details on how to use this app.

## Demo
[Live Demo](http://autodesk-forge.github.io/viewer-javascript-debugger.tool/)

![thumbnail](./lmvdbg-screenshot.png)

## Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Usage
Following [this link](http://autodesk-forge.github.io/viewer-javascript-debugger.tool/), then click on the menu links on the right of the page to see sample codes associated with each viewer functionalities.
