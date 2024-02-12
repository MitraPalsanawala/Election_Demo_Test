const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const fs = require('fs')

const otpGenerator = require('otp-generator')
const { v4: uuidv4 } = require('uuid');

var multer = require('multer');
// const { verify } = require('crypto')
const crypto = require("crypto");
const DIR = './Public/UploadFiles/UserImage';
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR) },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error(ImageError), false);
    }
    cb(null, true);
};
var ImageError = 'Only .png, .jpg and .jpeg format allowed!';
const router = express.Router();

const ENC = process.env.ENC;
const IV = process.env.IV;
const ALGO = process.env.ALGO;

const encrypt = (text) => {
    let cipher = crypto.createCipheriv(ALGO, ENC, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
};

const decrypt = (text) => {
    let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
    let decrypted = decipher.update(text, "base64", "utf8");
    return decrypted + decipher.final("utf8");
};

console.log("=====encrypt====", encrypt('123'))
console.log("=====decrypt====", decrypt('o1HKEE1x9PtuJHk4oiLDwg=='));

exports.setUser = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("UserImage");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                return res.json({ status: 0, message: ImageError, data: null, error: null });
            }
            else {
                // if (!req.body.DesignationID) {
                //     res.json({ status: 0, message: "Please Enter Designation", data: null, error: null });
                // }

                if (!req.body.MobileNo) {
                    res.json({ status: 0, message: "Please Enter Mobile No", data: null, error: null });
                }
                else if (!req.body.UserType) {
                    res.json({ status: 0, message: "Please Enter User Type", data: null, error: null });
                }
                else {
                    var UserImageName = '';
                    if (req.body.UserImageUploadType == 'New') {
                        UserImageName = (req.file) ? (req.file.filename) : null;

                        if (req.body.OldUserImage) {
                            const deleteFile = './Public/UploadFiles/UserImage/' + req.body.OldUserImage;
                            if (fs.existsSync(deleteFile)) {
                                fs.unlink(deleteFile, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    //console.log('deleted');
                                })
                            }
                        }
                    }
                    else if (req.body.UserImageUploadType == 'Old') {
                        UserImageName = (req.body.OldUserImage) ? (req.body.OldUserImage) : null
                    }
                    else {
                        UserImageName = (req.body.OldUserImage) ? (req.body.OldUserImage) : null
                    }

                    try {
                        var checkmobilenodata = [
                            { name: 'Query', value: 'CheckUserMobileNo' },
                            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                            { name: 'MobileNo', value: req.body.MobileNo },
                            { name: 'IsDelete', value: '1' },
                        ]
                        await Connection.connect();
                        const CheckMobileNoResult = await dataAccess.execute(`SP_Election_User`, checkmobilenodata);
                        const mobilenodata = CheckMobileNoResult.recordset;
                        if (mobilenodata.length > 0) {
                            return res.status(200).json({ status: 0, message: 'Mobile No Already Exists!', data: null, error: null })
                        }
                        else {
                            var checkdesignationdata = [
                                { name: 'Query', value: 'SelectAll' },
                                { name: 'DesignationName', value: req.body.UserType }
                            ]

                            try {
                                await Connection.connect();
                                const designationresult = await dataAccess.execute(`SP_Election_Designation`, checkdesignationdata);
                                if (designationresult.recordset && designationresult.recordset[0]) {
                                    const designationdata = designationresult.recordset;
                                    if (designationdata.length > 0) {
                                        var data = [
                                            //Query,
                                            { name: 'Query', value: req.body.UserID ? 'Update' : 'Insert' },
                                            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                                            //{ name: 'DesignationID', value: req.body.DesignationID ? req.body.DesignationID : null },
                                            { name: 'DesignationID', value: designationdata[0].DesignationID },
                                            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null },
                                            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
                                            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
                                            { name: 'Name', value: req.body.Name },
                                            { name: 'MobileNo', value: req.body.MobileNo },
                                            { name: 'UserImage', value: UserImageName },
                                            { name: 'UserType', value: req.body.UserType },
                                            { name: 'CreatedByUserID', value: req.body.CreatedByUserID ? req.body.CreatedByUserID : null },
                                            { name: 'CreatedByUserName', value: req.body.CreatedByUserName ? req.body.CreatedByUserName : null },
                                        ]

                                        try {
                                            await Connection.connect();
                                            const result = await dataAccess.execute(`SP_Election_User`, data);
                                            if (result.rowsAffected == 1) {
                                                if (!req.body.UserID) {
                                                    res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                                                }
                                                else {

                                                    const resultuser = await dataAccess.execute(`SP_Election_User`, [
                                                        { name: 'Query', value: "SelectUser" },
                                                        { name: 'UserID', value: req.body.UserID }
                                                    ]);

                                                    if (resultuser.recordset && resultuser.recordset[0]) {
                                                        const userdata = resultuser.recordset;
                                                        if (userdata.length > 0) {
                                                            res.status(200).json({ status: 1, message: "Successfully Updated.", data: userdata, error: null });
                                                        }
                                                        else {
                                                            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
                                                        }
                                                    }
                                                    // res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                                                }
                                            }
                                            else {
                                                res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                                            }
                                        } catch (error) {
                                            if (error.message.includes('UniqueElectionUserMobileNo')) {
                                                return res.status(200).json({ status: 0, message: 'Mobile No Already Exists!', data: null, error: null })
                                            }
                                            else {
                                                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                                            }
                                        }
                                    }
                                    else {
                                        res.status(200).json({ status: 0, message: "Designation Not Found.", data: null, error: null });
                                    }
                                }

                            } catch (error) {
                                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                            }
                        }
                    } catch (error) {
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserLogin = [async (req, res) => {
    try {
        if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'UserLogin' },
                { name: 'MobileNo', value: req.body.MobileNo },
                { name: 'IsDelete', value: '0' },
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_User`, data);
                // console.log("=====result111", result)
                if (result.recordset && result.recordset[0]) {
                    const userdata = result.recordset;

                    if (userdata.length > 0) {
                        if (userdata[0].IsActive == false) {
                            return res.status(200).json({ status: 0, message: "User is In Active", data: null, error: null });
                        }
                        else {
                            var LoginOTP = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                            try {
                                await Connection.connect();
                                var loginotpupdatedata = [
                                    { name: 'Query', value: 'UpdateLoginOTP' },
                                    { name: 'UserID', value: userdata[0].UserID },
                                    { name: 'LoginOTP', value: LoginOTP },
                                ]

                                const LoginOTPUpdateResult = await dataAccess.execute(`SP_Election_User`, loginotpupdatedata);

                                if (LoginOTPUpdateResult.rowsAffected == 1) {

                                    //Update OTP in json response
                                    userdata[0].LoginOTP = LoginOTP;
                                    return res.status(200).json({ status: 1, message: "User Login Successfully.", data: userdata, error: null });
                                }
                                else {
                                    res.status(200).json({ status: 0, message: "Data Not Update.", data: null, error: null });
                                }
                            } catch (error) {
                                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                            }
                        }
                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Mobile No is not available.", data: null, error: null });
                    }
                }
                else {
                    return res.status(200).json({ status: 0, message: "Mobile No is not available.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserLogout = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                await Connection.connect();
                var logoutupdatedata = [
                    { name: 'Query', value: 'UpdateLogOutData' },
                    { name: 'LogInOutStatus', value: 'Logout' },
                    { name: 'UserID', value: req.body.UserID }
                ]
                const LogoutResult = await dataAccess.execute(`SP_Election_User`, logoutupdatedata);

                if (LogoutResult.rowsAffected == 1) {
                    return res.status(200).json({ status: 1, message: "User Logout Successfully.", data: null, error: null });
                }
                else {
                    res.status(200).json({ status: 0, message: "Data Not Update.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserLoginOTPVerification = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        } else if (!req.body.LoginOTP) {
            res.json({ status: 0, message: "Please Enter Login OTP", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'UpdateLogInData' },
                { name: 'UserID', value: req.body.UserID },
                { name: 'LogInOutStatus', value: 'Login' },
                { name: 'AppVersion', value: req.body.AppVersion ? req.body.AppVersion : null },
                { name: 'AndroidDeviceID', value: req.body.AndroidDeviceID ? req.body.AndroidDeviceID : null },
                { name: 'IOSAppVersion', value: req.body.IOSAppVersion ? req.body.IOSAppVersion : null },
                { name: 'IOSDeviceID', value: req.body.IOSDeviceID ? req.body.IOSDeviceID : null }
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_User`, data);
                if (result.rowsAffected == 1) {
                    try {
                        await Connection.connect();
                        var appusagelogdata = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'UserID', value: req.body.UserID }
                        ]
                        const AppUsageLogResult = await dataAccess.execute(`SP_Election_AppUsageLog`, appusagelogdata);

                        if (AppUsageLogResult.rowsAffected == 1) {
                            return res.status(200).json({ status: 1, message: "User Verified.", data: null, error: null });
                        }
                        else {
                            res.status(200).json({ status: 0, message: "App log data not inserted.", data: null, error: null });
                        }
                    } catch (error) {
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
                else {
                    return res.status(200).json({ status: 0, message: "Data is not available.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setResendLoginOTP = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No", data: null, error: null });
        }
        else {
            try {
                var LoginOTP = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                try {
                    await Connection.connect();
                    var loginotpupdatedata = [
                        { name: 'Query', value: 'UpdateLoginOTP' },
                        { name: 'UserID', value: req.body.UserID },
                        { name: 'LoginOTP', value: LoginOTP },
                    ]
                    var returndata = [{ "LoginOTP": LoginOTP }]
                    const LoginOTPUpdateResult = await dataAccess.execute(`SP_Election_User`, loginotpupdatedata);
                    if (LoginOTPUpdateResult.rowsAffected == 1) {
                        return res.status(200).json({ status: 1, message: "Login OTP Resend Successfully.", data: returndata, error: null });
                    }
                    else {
                        res.status(200).json({ status: 0, message: "Login OTP Not Update.", data: null, error: null });
                    }
                } catch (error) {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getUser = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_User`, [
            { name: 'Query', value: "SelectUser" },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null },
            { name: 'UserType', value: req.body.UserType ? req.body.UserType : null },
            { name: 'IsDelete', value: false },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const userdata = result.recordset;
            if (userdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: userdata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserAddress = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.Address) {
            res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'UpdateAddress' },
                { name: 'UserID', value: req.body.UserID },
                { name: 'Address', value: req.body.Address }
            ]
            try {
                await Connection.connect();
                const userresult = await dataAccess.execute(`SP_Election_User`, data);

                if (userresult.rowsAffected == 1) {

                    const result = await dataAccess.execute(`SP_Election_User`, [
                        { name: 'Query', value: "SelectUser" },
                        { name: 'UserID', value: req.body.UserID },
                    ]);

                    if (result.recordset && result.recordset[0]) {
                        const userdata = result.recordset;
                        if (userdata.length > 0) {
                            res.status(200).json({ status: 1, message: "Success.", data: userdata, error: null });
                        }
                        else {
                            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
                        }
                    }
                    else {
                        res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
                    }
                }
                else {
                    res.status(200).json({ status: 0, message: "Data Not Update.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getBoothSangathanUserData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_User`, [
            { name: 'Query', value: "SelectBoothSangathanUserData" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'UserType', value: 'Booth Prabhari,Booth Sah Incharge' },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);

        if (result.recordset && result.recordset[0]) {
            const boothsangathanuserdata = result.recordset;
            if (boothsangathanuserdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: boothsangathanuserdata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPageSangathanUserData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_User`, [
            { name: 'Query', value: "SelectPageSangathanUserData" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'UserType', value: 'Page Samiti' },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);

        if (result.recordset && result.recordset[0]) {
            const pagesangathanuserdata = result.recordset;
            if (pagesangathanuserdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: pagesangathanuserdata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserActiveStatus = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.IsActive) {
            res.json({ status: 0, message: "Please Enter IsActive", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'UpdateUserIsActiveStatus' },
                { name: 'UserID', value: req.body.UserID },
                { name: 'IsActive', value: req.body.IsActive }
            ]
            try {
                await Connection.connect();
                const userresult = await dataAccess.execute(`SP_Election_User`, data);

                if (userresult.rowsAffected == 1) {
                    res.status(200).json({ status: 1, message: "Success.", data: null, error: null });
                }
                else {
                    res.status(200).json({ status: 0, message: "Data Not Update.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.deleteUser = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'Delete' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'IsDelete', value: true }
                ]
                try {
                    await Connection.connect();
                    const result = await dataAccess.execute(`SP_Election_User`, data);
                    if (result.rowsAffected == 1) {
                        res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
                    }
                    else {
                        res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                    }
                } catch (error) {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.OfficerLoginOLD = [async (req, res) => {
    try {
        var Password = req.body.Password ? req.body.Password : '';
        var UserName = req.body.UserName ? req.body.UserName : '';
        if (!UserName) {
            res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
        }
        else if (!Password) {
            res.json({ status: 0, message: "Please Enter Password", data: null, error: null });
        }
        else {
            if (Password) {
                Password = encrypt(Password);
            }
            var data = [
                { name: 'Query', value: 'OfficerLogin' },
                { name: 'UserName', value: UserName },
                { name: 'Password', value: Password },
                { name: 'IsDelete', value: '0' },
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_User`, data);
                if (result.recordset && result.recordset[0]) {
                    const userdata = result.recordset;
                    if (userdata.length > 0) {
                        if (userdata[0].IsActive == false) {
                            return res.status(200).json({ status: 0, message: "User is In Active", data: null, error: null });
                        }
                        else {
                            return res.status(200).json({ status: 1, message: "User Login Successfully.", data: userdata, error: null });
                        }
                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                    }
                }
                else {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                }
            } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.OfficerLogin = [async (req, res) => {
    try {
        var Password = req.body.Password ? req.body.Password : '';
        var UserName = req.body.UserName ? req.body.UserName : '';
        if (!UserName) {
            res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
        }
        else if (!Password) {
            res.json({ status: 0, message: "Please Enter Password", data: null, error: null });
        }
        else {
            // if (Password) {
            //     Password = encrypt(Password);
            // }
            var data = [
                { name: 'Query', value: 'OfficerLogin' },
                { name: 'UserName', value: UserName },
                { name: 'Password', value: Password },
                { name: 'IsDelete', value: '0' },
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_User`, data);
                if (result.recordset && result.recordset[0]) {
                    const userdata = result.recordset;
                    if (userdata.length > 0) {
                        if (userdata[0].IsActive == false) {
                            return res.status(200).json({ status: 0, message: "User is In Active", data: null, error: null });
                        }
                        else {
                            return res.status(200).json({ status: 1, message: "User Login Successfully.", data: userdata, error: null });
                        }
                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                    }
                }
                else {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                }
            } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];