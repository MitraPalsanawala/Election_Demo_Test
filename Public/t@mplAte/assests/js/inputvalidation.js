//#region Common Functions
$("body").on("keypress", ".AllowAlphabetSpaceKey", function (e) {

    AllowAlphabetSpaceKey(e);
});

$("body").on("keypress", ".AllowNumberKey", function (e) {

    AllowNumberKey(e);
});

function AllowNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58)) { //numeric (0-9)
        e.preventDefault();
    }
}

function AllowAlphabetSpaceKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space ( )
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

//#endregion Common Functions