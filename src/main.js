let setDefaults = true;
//array of parameters
//KEY: 0=name, 1=default, 2=element, 3=type, 4=optional
let parameterList = [
    ["mirrorType", "regular", "select", "mirror", false],
    ["intermediateUpdateDirectory", "c:\\temp\\mirrorTemp", "text", "mirror", false],
    ["offlineLicenseFilename", "c:\\temp\\offline.lf", "text", "mirror", false],
    ["updateServer", "", "text", "mirror", true],
    ["outputDirectory", "c:\\temp\\mirror", "text", "mirror", false],
    ["proxyHost", "", "text", "global", true],
    ["proxyPort", "", "text", "global", true],
    ["proxyUsername", "", "text", "global", true],
    ["proxyPassword", "", "text", "global", true],
    ["networkDriveUsername", "", "text", "mirror", true],
    ["networkDrivePassword", "", "text", "mirror", true],
    ["excludedProducts", "", "text", "mirror", true],
    ["repositoryServer", "AUTOSELECT", "text", "repository", false],
    ["intermediateRepositoryDirectory", "c:\\temp\\repositoryTemp", "text", "repository", false],
    ["mirrorOnlyLevelUpdates", false, "checkbox", "mirror", true],
    ["outputRepositoryDirectory", "c:\\temp\\repository", "text", "repository", false],
    ["mirrorFileFormat", "", "select", "mirror", true],
    ["compatibilityVersion", "", "text", "mirror", true],
    ["filterFilePath", "", "text", "repository", true],
    ["trustDownloadedFilesInRepositoryTemp", false, "checkbox", "repository", true]
]

function update() {
    let s = "";
    let isOutputValid = 0;
    for (let i = 0; i < parameterList.length; i++) {
        let o = document.getElementsByClassName("optional");
        //iterate through optional parameters, hide them if enableoptional is not checked
        for (let i = 0; i < o.length; i++) {
            if (document.getElementById("enableOptional").checked) o[i].style.display = "block"; else o[i].style.display = "none";
        }
        //iterate through all the parameters
        if (document.getElementById(parameterList[i][0]) != null) {
            //set default values on form load
            if (setDefaults) {
                document.getElementById("windows").checked = true;
                document.getElementById(parameterList[i][0]).value = parameterList[i][1];
                document.getElementById(parameterList[i][0]).checked = parameterList[i][1];
                document.getElementById("enableMirror").checked = true;
                document.getElementById("enableRepository").checked = false;
                document.getElementById("enableGlobal").checked = false;
                document.getElementById("enableOptional").checked = false;
            }
            //check if section is enabled, if so allow the mandatory parameters to be written to the output
            if ((document.getElementById("enableMirror").checked && parameterList[i][3] == "mirror") ||
                (document.getElementById("enableRepository").checked && parameterList[i][3] == "repository") ||
                (document.getElementById("enableGlobal").checked && parameterList[i][3] == "global")) {
                //check if either optional parameters are enabled or optional parameters are disabled and current parameter is mandatory
                if (document.getElementById("enableOptional").checked || !document.getElementById("enableOptional").checked && parameterList[i][4] == false) {
                    switch (parameterList[i][2]) {
                        case ("text"):
                            //write parameter and args for text box
                            if (document.getElementById(parameterList[i][0]).value != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).value + " ";
                            break;
                        case ("checkbox"):
                            //write parameter for checkbox
                            if (document.getElementById(parameterList[i][0]).checked) s += "--" + parameterList[i][0] + " ";
                            break;
                        case ("select"):
                            //write parameter for currently selected item in dropdown box
                            if (document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text + " ";
                            break;
                    }
                }
            }
        }
        //if field is empty and mandatory then highlight the field red, modify the placeholder text, and declare the output as invalid
        if (document.getElementById(parameterList[i][0]).value == "" && !parameterList[i][4]) {
            document.getElementById(parameterList[i][0]).style.borderColor = "red"
            document.getElementById(parameterList[i][0]).placeholder = "This field cannot be blank";
            isOutputValid++
        }
    }
    //if the number of invalid fields are more than 0 or mandatory sections are disabled the disable the copy button, otherwise show it
    if (isOutputValid > 0 || (!document.getElementById("enableMirror").checked && !document.getElementById("enableRepository").checked)) {
        document.getElementById("copyButton").disabled = true;
    } else {
        document.getElementById("copyButton").disabled = false;
    }
    //trim whitespace
    s = s.trim();
    //if the string is not empty and there are no invalid fields then allow writing to the command line preview
    if (s.length != 0 && isOutputValid == 0) {
        if (document.getElementById("windows").checked) document.getElementById("commandLinePreview").value = "MirrorTool.exe " + s; else document.getElementById("commandLinePreview").value = "sudo ./MirrorTool " + s
    } else document.getElementById("commandLinePreview").value = "";
    //Show or hide the relevant sections dependent on checkbox state
    if (document.getElementById("enableMirror").checked) document.getElementById("mirror").style.display = "block"; else document.getElementById("mirror").style.display = "none";
    if (document.getElementById("enableRepository").checked) document.getElementById("repository").style.display = "block"; else document.getElementById("repository").style.display = "none";
    if (document.getElementById("enableGlobal").checked) document.getElementById("global").style.display = "block"; else document.getElementById("global").style.display = "none";
    //Workaround to auto-fit command line preview height to contents
    document.getElementById("commandLinePreview").setAttribute("style", "height: 0px");
    document.getElementById("commandLinePreview").setAttribute("style", "height:" + (document.getElementById("commandLinePreview").scrollHeight) + "px;overflow-y:hidden;");
    setDefaults = false;
}
update();
//copy command line preview contents to clipboad
var clipboard = new Clipboard(document.getElementById('copyButton'), {
    text: function (trigger) {
        update();
        return document.getElementById("commandLinePreview").value;
    }
});
document.getElementById("exportButton").addEventListener("click", function (event) {
    //do something
});
document.getElementById("saveButton").addEventListener("click", function (event) {
    //do something
});
//iterate through all inputs (text/checkbox), hook events so that we can update the command line preview dynamically
let input = document.querySelectorAll("input");
for (i = 0; i < input.length; i++) {
    input[i].addEventListener("input", function (event) {
        update();
    });
}
//add additional event listeners to drop down boxes
document.getElementById("mirrorType").addEventListener("input", function (event) { update(); });
document.getElementById("mirrorFileFormat").addEventListener("input", function (event) { update(); }); let setDefaults = true;
//array of parameters
//KEY: 0=name, 1=default, 2=element, 3=type, 4=optional
let parameterList = [
    ["mirrorType", "regular", "select", "mirror", false],
    ["intermediateUpdateDirectory", "c:\\temp\\mirrorTemp", "text", "mirror", false],
    ["offlineLicenseFilename", "c:\\temp\\offline.lf", "text", "mirror", false],
    ["updateServer", "", "text", "mirror", true],
    ["outputDirectory", "c:\\temp\\mirror", "text", "mirror", false],
    ["proxyHost", "", "text", "global", true],
    ["proxyPort", "", "text", "global", true],
    ["proxyUsername", "", "text", "global", true],
    ["proxyPassword", "", "text", "global", true],
    ["networkDriveUsername", "", "text", "mirror", true],
    ["networkDrivePassword", "", "text", "mirror", true],
    ["excludedProducts", "", "text", "mirror", true],
    ["repositoryServer", "AUTOSELECT", "text", "repository", false],
    ["intermediateRepositoryDirectory", "c:\\temp\\repositoryTemp", "text", "repository", false],
    ["mirrorOnlyLevelUpdates", false, "checkbox", "mirror", true],
    ["outputRepositoryDirectory", "c:\\temp\\repository", "text", "repository", false],
    ["mirrorFileFormat", "", "select", "mirror", true],
    ["compatibilityVersion", "", "text", "mirror", true],
    ["filterFilePath", "", "text", "repository", true],
    ["trustDownloadedFilesInRepositoryTemp", false, "checkbox", "repository", true]
]

function update() {
    let s = "";
    let isOutputValid = 0;
    for (let i = 0; i < parameterList.length; i++) {
        let o = document.getElementsByClassName("optional");
        //iterate through optional parameters, hide them if enableoptional is not checked
        for (let i = 0; i < o.length; i++) {
            if (document.getElementById("enableOptional").checked) o[i].style.display = "block"; else o[i].style.display = "none";
        }
        //iterate through all the parameters
        if (document.getElementById(parameterList[i][0]) != null) {
            //set default values on form load
            if (setDefaults) {
                document.getElementById("windows").checked = true;
                document.getElementById(parameterList[i][0]).value = parameterList[i][1];
                document.getElementById(parameterList[i][0]).checked = parameterList[i][1];
                document.getElementById("enableMirror").checked = true;
                document.getElementById("enableRepository").checked = false;
                document.getElementById("enableGlobal").checked = false;
                document.getElementById("enableOptional").checked = false;
            }
            //check if section is enabled, if so allow the mandatory parameters to be written to the output
            if ((document.getElementById("enableMirror").checked && parameterList[i][3] == "mirror") ||
                (document.getElementById("enableRepository").checked && parameterList[i][3] == "repository") ||
                (document.getElementById("enableGlobal").checked && parameterList[i][3] == "global")) {
                //check if either optional parameters are enabled or optional parameters are disabled and current parameter is mandatory
                if (document.getElementById("enableOptional").checked || !document.getElementById("enableOptional").checked && parameterList[i][4] == false) {
                    switch (parameterList[i][2]) {
                        case ("text"):
                            //write parameter and args for text box
                            if (document.getElementById(parameterList[i][0]).value != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).value + " ";
                            break;
                        case ("checkbox"):
                            //write parameter for checkbox
                            if (document.getElementById(parameterList[i][0]).checked) s += "--" + parameterList[i][0] + " ";
                            break;
                        case ("select"):
                            //write parameter for currently selected item in dropdown box
                            if (document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text + " ";
                            break;
                    }
                }
            }
        }
        //if field is empty and mandatory then highlight the field red, modify the placeholder text, and declare the output as invalid
        if (document.getElementById(parameterList[i][0]).value == "" && !parameterList[i][4]) {
            document.getElementById(parameterList[i][0]).style.borderColor = "red"
            document.getElementById(parameterList[i][0]).placeholder = "This field cannot be blank";
            isOutputValid++
        }
    }
    //if the number of invalid fields are more than 0 or mandatory sections are disabled the disable the copy button, otherwise show it
    if (isOutputValid > 0 || (!document.getElementById("enableMirror").checked && !document.getElementById("enableRepository").checked)) {
        document.getElementById("copyButton").disabled = true;
    } else {
        document.getElementById("copyButton").disabled = false;
    }
    //trim whitespace
    s = s.trim();
    //if the string is not empty and there are no invalid fields then allow writing to the command line preview
    if (s.length != 0 && isOutputValid == 0) {
        if (document.getElementById("windows").checked) document.getElementById("commandLinePreview").value = "MirrorTool.exe " + s; else document.getElementById("commandLinePreview").value = "sudo ./MirrorTool " + s
    } else document.getElementById("commandLinePreview").value = "";
    //Show or hide the relevant sections dependent on checkbox state
    if (document.getElementById("enableMirror").checked) document.getElementById("mirror").style.display = "block"; else document.getElementById("mirror").style.display = "none";
    if (document.getElementById("enableRepository").checked) document.getElementById("repository").style.display = "block"; else document.getElementById("repository").style.display = "none";
    if (document.getElementById("enableGlobal").checked) document.getElementById("global").style.display = "block"; else document.getElementById("global").style.display = "none";
    //Workaround to auto-fit command line preview height to contents
    document.getElementById("commandLinePreview").setAttribute("style", "height: 0px");
    document.getElementById("commandLinePreview").setAttribute("style", "height:" + (document.getElementById("commandLinePreview").scrollHeight) + "px;overflow-y:hidden;");
    setDefaults = false;
}
update();
//copy command line preview contents to clipboad
var clipboard = new Clipboard(document.getElementById('copyButton'), {
    text: function (trigger) {
        update();
        return document.getElementById("commandLinePreview").value;
    }
});
document.getElementById("exportButton").addEventListener("click", function (event) {
    //do something
});
document.getElementById("saveButton").addEventListener("click", function (event) {
    //do something
});
//iterate through all inputs (text/checkbox), hook events so that we can update the command line preview dynamically
let input = document.querySelectorAll("input");
for (i = 0; i < input.length; i++) {
    input[i].addEventListener("input", function (event) {
        update();
    });
}
//add additional event listeners to drop down boxes
document.getElementById("mirrorType").addEventListener("input", function (event) { update(); });
document.getElementById("mirrorFileFormat").addEventListener("input", function (event) { update(); }); let setDefaults = true;
//array of parameters
//KEY: 0=name, 1=default, 2=element, 3=type, 4=optional
let parameterList = [
    ["mirrorType", "regular", "select", "mirror", false],
    ["intermediateUpdateDirectory", "c:\\temp\\mirrorTemp", "text", "mirror", false],
    ["offlineLicenseFilename", "c:\\temp\\offline.lf", "text", "mirror", false],
    ["updateServer", "", "text", "mirror", true],
    ["outputDirectory", "c:\\temp\\mirror", "text", "mirror", false],
    ["proxyHost", "", "text", "global", true],
    ["proxyPort", "", "text", "global", true],
    ["proxyUsername", "", "text", "global", true],
    ["proxyPassword", "", "text", "global", true],
    ["networkDriveUsername", "", "text", "mirror", true],
    ["networkDrivePassword", "", "text", "mirror", true],
    ["excludedProducts", "", "text", "mirror", true],
    ["repositoryServer", "AUTOSELECT", "text", "repository", false],
    ["intermediateRepositoryDirectory", "c:\\temp\\repositoryTemp", "text", "repository", false],
    ["mirrorOnlyLevelUpdates", false, "checkbox", "mirror", true],
    ["outputRepositoryDirectory", "c:\\temp\\repository", "text", "repository", false],
    ["mirrorFileFormat", "", "select", "mirror", true],
    ["compatibilityVersion", "", "text", "mirror", true],
    ["filterFilePath", "", "text", "repository", true],
    ["trustDownloadedFilesInRepositoryTemp", false, "checkbox", "repository", true]
]

function update() {
    let s = "";
    let isOutputValid = 0;
    for (let i = 0; i < parameterList.length; i++) {
        let o = document.getElementsByClassName("optional");
        //iterate through optional parameters, hide them if enableoptional is not checked
        for (let i = 0; i < o.length; i++) {
            if (document.getElementById("enableOptional").checked) o[i].style.display = "block"; else o[i].style.display = "none";
        }
        //iterate through all the parameters
        if (document.getElementById(parameterList[i][0]) != null) {
            //set default values on form load
            if (setDefaults) {
                document.getElementById("windows").checked = true;
                document.getElementById(parameterList[i][0]).value = parameterList[i][1];
                document.getElementById(parameterList[i][0]).checked = parameterList[i][1];
                document.getElementById("enableMirror").checked = true;
                document.getElementById("enableRepository").checked = false;
                document.getElementById("enableGlobal").checked = false;
                document.getElementById("enableOptional").checked = false;
            }
            //check if section is enabled, if so allow the mandatory parameters to be written to the output
            if ((document.getElementById("enableMirror").checked && parameterList[i][3] == "mirror") ||
                (document.getElementById("enableRepository").checked && parameterList[i][3] == "repository") ||
                (document.getElementById("enableGlobal").checked && parameterList[i][3] == "global")) {
                //check if either optional parameters are enabled or optional parameters are disabled and current parameter is mandatory
                if (document.getElementById("enableOptional").checked || !document.getElementById("enableOptional").checked && parameterList[i][4] == false) {
                    switch (parameterList[i][2]) {
                        case ("text"):
                            //write parameter and args for text box
                            if (document.getElementById(parameterList[i][0]).value != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).value + " ";
                            break;
                        case ("checkbox"):
                            //write parameter for checkbox
                            if (document.getElementById(parameterList[i][0]).checked) s += "--" + parameterList[i][0] + " ";
                            break;
                        case ("select"):
                            //write parameter for currently selected item in dropdown box
                            if (document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text != "") s += "--" + parameterList[i][0] + " " + document.getElementById(parameterList[i][0]).options[document.getElementById(parameterList[i][0]).selectedIndex].text + " ";
                            break;
                    }
                }
            }
        }
        //if field is empty and mandatory then highlight the field red, modify the placeholder text, and declare the output as invalid
        if (document.getElementById(parameterList[i][0]).value == "" && !parameterList[i][4]) {
            document.getElementById(parameterList[i][0]).style.borderColor = "red"
            document.getElementById(parameterList[i][0]).placeholder = "This field cannot be blank";
            isOutputValid++
        }
    }
    //if the number of invalid fields are more than 0 or mandatory sections are disabled the disable the copy button, otherwise show it
    if (isOutputValid > 0 || (!document.getElementById("enableMirror").checked && !document.getElementById("enableRepository").checked)) {
        document.getElementById("copyButton").disabled = true;
    } else {
        document.getElementById("copyButton").disabled = false;
    }
    //trim whitespace
    s = s.trim();
    //if the string is not empty and there are no invalid fields then allow writing to the command line preview
    if (s.length != 0 && isOutputValid == 0) {
        if (document.getElementById("windows").checked) document.getElementById("commandLinePreview").value = "MirrorTool.exe " + s; else document.getElementById("commandLinePreview").value = "sudo ./MirrorTool " + s
    } else document.getElementById("commandLinePreview").value = "";
    //Show or hide the relevant sections dependent on checkbox state
    if (document.getElementById("enableMirror").checked) document.getElementById("mirror").style.display = "block"; else document.getElementById("mirror").style.display = "none";
    if (document.getElementById("enableRepository").checked) document.getElementById("repository").style.display = "block"; else document.getElementById("repository").style.display = "none";
    if (document.getElementById("enableGlobal").checked) document.getElementById("global").style.display = "block"; else document.getElementById("global").style.display = "none";
    //Workaround to auto-fit command line preview height to contents
    document.getElementById("commandLinePreview").setAttribute("style", "height: 0px");
    document.getElementById("commandLinePreview").setAttribute("style", "height:" + (document.getElementById("commandLinePreview").scrollHeight) + "px;overflow-y:hidden;");
    setDefaults = false;
}
update();
//copy command line preview contents to clipboad
var clipboard = new Clipboard(document.getElementById('copyButton'), {
    text: function (trigger) {
        update();
        return document.getElementById("commandLinePreview").value;
    }
});
document.getElementById("exportButton").addEventListener("click", function (event) {
    //do something
});
document.getElementById("saveButton").addEventListener("click", function (event) {
    //do something
});
//iterate through all inputs (text/checkbox), hook events so that we can update the command line preview dynamically
let input = document.querySelectorAll("input");
for (i = 0; i < input.length; i++) {
    input[i].addEventListener("input", function (event) {
        update();
    });
}
//add additional event listeners to drop down boxes
document.getElementById("mirrorType").addEventListener("input", function (event) { update(); });
document.getElementById("mirrorFileFormat").addEventListener("input", function (event) { update(); });