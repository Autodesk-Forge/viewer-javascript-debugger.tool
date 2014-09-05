LmvDbg Test App:

Designed to test out all the API functions of the LMV Viewer.  Currently only works for a Model that
is hardwired into the code.

To use the source for yourself, you must do the following:

1)  edit ./NodeAppServer/AuthCodeServer.js and add your key and secret to the location specified.
2)  install Node.js (if not already present)
3)  from Terminal window, run the command:  user> "node AuthCodeServer.js"
4)  edit file ./scripts/MyAuthToken.js.  Make sure path to the service matches where the Node.js server in step 3 is running.
5)  edit file ./index.html.  In function "initialize()", replace the URN for the document with one that is valid for your authCode.

That's it!