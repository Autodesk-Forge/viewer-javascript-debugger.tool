/**
 * Created by awej on 7/15/14.
 */

function dbgErrorStr(jqXHR, exception) {
    if (jqXHR.status === 0) {
        return('Not connected. Please Verify Network.');
    } else if (jqXHR.status == 403) {
        return('Unauthorized. [403]');}
    else if (jqXHR.status == 404) {
        return('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        return('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        return('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        return('Time out error.');
    } else if (exception === 'abort') {
        return('Ajax request aborted.');
    } else {
        return('Uncaught Error.\n' + jqXHR.responseText);
    }
}

function dbgErrorAlert(event, jqXHR, ajaxSettings, thrownError) {
    alert(dbgErrorStr(jqXHR, thrownError));
}


function ajaxErrorStr(jqXHR) {
    var tmpStr = "ERROR!";
    tmpStr += "\nSTATUS: ";
    tmpStr += jqXHR.status;
    tmpStr += "\nSTATUS TEXT: ";
    tmpStr += jqXHR.statusText;
    
    console.error("AJAX ERROR: jqXHR = %O", jqXHR);
    
    return tmpStr;
}