function setZero(ref) {
    if (ref == "") {
        return 0;
    }
    else {
        if (isNaN(parseFloat(ref))) {
            return 0;
        }
        else {
            return parseFloat(ref);
        }
    }
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 45 || charCode > 57))
        return false;

    return true;
}
function onlyAlphabets(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if ((charCode > 64 && charCode < 91 || charCode > 96 && charCode < 122 || charCode == 32))
            return true;
        else
            return false;
    }
    catch (err) {
        alert(err.Description);
    }
}