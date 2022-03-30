//Functions for CLI configuration

let setDefaults = true, pElement, isWindows = true;
enableWindows.checked = true;

let clipboard = new Clipboard(copyButton, {
    text: function () {
        update();
        toast("Copied to clipboard");
        return hidden.textContent;
    }
});

configureLink.addEventListener("click", function () { openSection(2); });
layerCLI.addEventListener("input", function () { update(); });
downloadButton.addEventListener("click", function () { enableWindows.checked ? download('test.bat', hidden.textContent) : download('test.sh', hidden.textContent.split("sudo ").pop()); });
resetButton.addEventListener("click", function () { reset(); });
enableWindows.addEventListener("click", function () { isWindows ? null : reset() });
enableLinux.addEventListener("click", function () { isWindows ? reset() : null });

update();

function update() {
    let baseDirectory = updateBaseDirectory();
    const regexPath = /^(.+)\\([^\\]+)$/gi,
    regexURL = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    regexURLRepository = /\bAUTOSELECT\b|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    regexPort = /[0-9]+/g,
    regexVersion = /^(\d+\.\d+)(\.\d+\.\d+)?$/gi;
    let pList = [
        ["mirrorType", "regular", "select", "mirror", false],
        ["intermediateUpdateDirectory", baseDirectory + "mirrorTemp", "text", "mirror", false, regexPath],
        ["offlineLicenseFilename", baseDirectory + "offline.lf", "text", "mirror", false, regexPath],
        ["updateServer", "", "text", "mirror", true, regexURL],
        ["outputDirectory", baseDirectory + "mirror", "text", "mirror", false, regexPath],
        ["proxyHost", "", "text", "global", true],
        ["proxyPort", "", "text", "global", true, regexPort],
        ["proxyUsername", "", "text", "global", true],
        ["proxyPassword", "", "password", "global", true],
        ["networkDriveUsername", "", "text", "mirror", true],
        ["networkDrivePassword", "", "password", "mirror", true],
        ["excludedProducts", "none", "select", "mirror", true],
        ["repositoryServer", "AUTOSELECT", "text", "repository", false, regexURLRepository],
        ["intermediateRepositoryDirectory", baseDirectory + "repositoryTemp", "text", "repository", false, regexPath],
        ["mirrorOnlyLevelUpdates", false, "checkbox", "mirror", true],
        ["outputRepositoryDirectory", baseDirectory + "repository", "text", "repository", false, regexPath],
        ["mirrorFileFormat", "none", "select", "mirror", true],
        ["compatibilityVersion", "", "text", "mirror", true, regexVersion],
        ["filterFilePath", baseDirectory + "filter.json", "text", "repository", true, regexPath],
        ["trustDownloadedFilesInRepositoryTemp", false, "checkbox", "repository", true]
    ];
    let command = "", invalid = 0;
    if (setDefaults) { enableMirror.checked = true; enableRepository.checked = false; enableGlobal.checked = false; enableOptional.checked = false; }
    let o = document.getElementsByClassName("optional");
    for (let i = 0; i < o.length; i++) { enableOptional.checked ? o[i].style.display = "block" : o[i].style.display = "none"; }
    for (let i = 0; i < pList.length; i++) {
        let pName = pList[i][0], pDefault = pList[i][1], pType = pList[i][2], pSectionCheckbox = document.getElementById("enable" + pList[i][3].charAt(0).toUpperCase() + pList[i][3].slice(1)), pOptional = pList[i][4], pRegex = pList[i][5];
        pElement = document.getElementById(pName);
        if (setDefaults) { pElement.value = pDefault; pElement.checked = pDefault; }
        if (pElement != null) {
            if (pSectionCheckbox.checked) {
                if (enableOptional.checked || !enableOptional.checked && pList[i][4] == false) {
                    switch (pType) {
                        case ("text"):
                            if (pElement.value != "") command += "<colorParameter>--" + pName + "</colorParameter> <colorArgument>" + pElement.value + "</colorArgument> ";
                            break;
                        case ("checkbox"):
                            if (pElement.checked) command += "<colorParameter>--" + pName + "</colorParameter> ";
                            break;
                        case ("select"):
                            if (pElement.options[pElement.selectedIndex].text != "none") command += "<colorParameter>--" + pName + "</colorParameter> <colorArgument>" + pElement.options[pElement.selectedIndex].value + "</colorArgument> ";
                            break;
                        case ("password"):
                            if (pElement.value != "") command += "<colorParameter>--" + pName + "</colorParameter> <colorPassword>" + pElement.value + "</colorPassword> ";
                            break;
                    }
                }
            }
        }
        if (!validate(pElement, pSectionCheckbox, pOptional, pRegex)) invalid++;
    }
    if (invalid > 0 || (!enableMirror.checked && !enableRepository.checked)) {
        copyButton.disabled = downloadButton.disabled = outputBox.disabled = true;
    } else {
        copyButton.disabled = downloadButton.disabled = outputBox.disabled = false;
    }
    command = command.trim();
    if (command.length != 0 && invalid == 0) {
        if (enableWindows.checked) {
            command = "<colorStart>MirrorTool.exe</colorStart> " + command
        } else {
            command = "<colorStart>sudo ./MirrorTool</colorStart> " + command
        }
    } else {
        command = "<colorWarn>Please check your configuration.</colorWarn>";
    }
    hidden.innerHTML = command;
    let passwordReplaceText = "&lt;hidden&gt;";
    if (document.getElementById("networkDrivePassword").value != "" && document.getElementById("networkDrivePassword").value != null) command = command.replace(new RegExp("--networkDrivePassword</colorParameter> <colorPassword>" + document.getElementById("networkDrivePassword").value), "--networkDrivePassword</colorParameter> <colorPassword>" + passwordReplaceText);
    if (document.getElementById("proxyPassword").value != "" && document.getElementById("proxyPassword").value != null) command = command.replace(new RegExp("--proxyPassword</colorParameter> <colorPassword>" + document.getElementById("proxyPassword").value), "--proxyPassword</colorParameter> <colorPassword>" + passwordReplaceText);
    outputBox.innerHTML = command;
    enableMirror.checked ? mirror.style.display = "block" : mirror.style.display = "none";
    enableRepository.checked ? repository.style.display = "block" : repository.style.display = "none";
    enableGlobal.checked ? global.style.display = "block" : global.style.display = "none";
    setDefaults = false;
}

function updateBaseDirectory() {
    if (enableWindows.checked) { isWindows = true; b = "C:\\mirrorTool\\"; } else { b = "/tmp/mirrorTool/"; isWindows = false; }
    return b;
}

function reset() {
    setDefaults = confirm("Reset all settings and filters?");
    update();
}

function validate(pElement, pSectionCheckbox, pOptional, pRegex) {
    if (pElement.nextSibling.tagName == "IMG") pElement.nextElementSibling.remove();
    let tickImage = new Image(16, 16);
    let crossImage = new Image(16, 16);
    tickImage.src = "/res/tick.png";
    crossImage.src = "/res/cross.png";
    let valid = true;
    if ((pOptional && enableOptional.checked && pSectionCheckbox.checked) || (!pOptional && !enableOptional.checked && pSectionCheckbox.checked) || (!pOptional && enableOptional.checked && pSectionCheckbox.checked)) {
    if (!document.getElementById(pElement.id).value.match(pRegex)) valid = false;
    if (valid || (pOptional && pElement.value == "")) {
        pElement.parentNode.insertBefore(tickImage, pElement.nextSibling);
        pElement.style.borderColor = "rgba(119, 252, 3,0.5)";
        valid = true;
    }
    if ((pOptional && pElement.value != "" && !valid) || (!pOptional && (!valid || pElement.value == ""))){
        pElement.parentNode.insertBefore(crossImage, pElement.nextSibling);
        pElement.style.borderColor = "rgba(252, 3, 3,0.5)";
        valid = false;
    }
    } else { valid = true; }
    return valid;
}