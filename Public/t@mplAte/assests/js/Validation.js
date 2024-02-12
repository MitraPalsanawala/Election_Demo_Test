//#region Control Validation Function

$("body").on("keypress", ".AllowAlphabetKey", function (e) {
    AllowAlphabetKey(e);
});

$("body").on("keypress", ".AllowAlphabetNumberKey", function (e) {
    AllowAlphabetNumberKey(e);
});

$("body").on("keypress", ".AllowAlphabetNumberSpaceKey", function (e) {
    AllowAlphabetNumberSpaceKey(e);
});

$("body").on("keypress", ".AllowAlphabetSpaceKey", function (e) {
    AllowAlphabetSpaceKey(e);
});

$("body").on("keypress", ".AllowAlphabetSpaceAmpersandKey", function (e) {
    AllowAlphabetSpaceAmpersandKey(e);
});

$("body").on("keypress", ".AllowAlphabetSpaceHyphenKey", function (e) {
    AllowAlphabetSpaceHyphenKey(e);
});

$("body").on("keypress", ".AllowDotNumberKey", function (e) {
    AllowDotNumberKey(e);
});

$("body").on("keypress", ".AllowHyphenNumberKey", function (e) {
    AllowHyphenNumberKey(e);
});

$("body").on("keypress", ".AllowNumberKey", function (e) {
    AllowNumberKey(e);
});

$("body").on("keypress", ".AllowNumberSpaceKey", function (e) {
    AllowNumberSpaceKey(e);
});

function AllowAlphabetKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

function AllowAlphabetNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58) && //numeric (0-9)
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

function AllowAlphabetNumberSpaceKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space ( )
        !(code > 47 && code < 58) && //numeric (0-9)
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
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

function AllowAlphabetSpaceAmpersandKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space
        !(code == 38) && //ampersand (&)
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

function AllowAlphabetSpaceHyphenKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space
        !(code == 45) && //hyphen(-)
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

function AllowDotNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58) && //numeric (0-9)
        !(code == 46)) { //dot character (.)
        e.preventDefault();
    }
}

function AllowHyphenNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58) && //numeric (0-9)
        !(code == 45)) { //hyphen character (-)
        e.preventDefault();
    }
}

function AllowNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58)) { //numeric (0-9)
        e.preventDefault();
    }
}

function AllowNumberSpaceKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space ( )
        !(code > 47 && code < 58)) { //numeric (0-9)
        e.preventDefault();
    }
}
//#endregion Control Validation Function