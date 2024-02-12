const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const fs = require('fs')

const otpGenerator = require('otp-generator')
const { v4: uuidv4 } = require('uuid');

var multer = require('multer');
const { verify } = require('crypto')
const DIR = './Public/UploadFiles/Contact';
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR) },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
        req.fileValidationError = 'Only csv files are allowed!';
        return cb(new Error(FileError), false);
    }
    cb(null, true);
};

const csv = require('fast-csv')

var FileError = 'Only .csv format allowed!';

const router = express.Router();

exports.setPhoneBookOld = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.UserType) {
            res.json({ status: 0, message: "Please Enter User Type", data: null, error: null });
        }
        else if (!req.body.ContactDetail) {
            res.json({ status: 0, message: "Please Enter Contact Detail", data: null, error: null });
        }
        else {
            //var arrContactDetail = req.body.ContactDetail.split(',');

            // let data_ = arrContactDetail.map((e) => {
            //     var e = e
            //     //console.log(e);
            //     console.log(e, '====>', e.length);
            //     console.log(e.includes('+91'))
            //     if (e.length == 10) {
            //         return e
            //     } else if (e.includes == 12) {

            //     }
            // })

            // console.log(data_);

            try {
                var checkphonebookdata = [
                    { name: 'Query', value: 'CheckPhoneBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'MobileNo', value: req.body.ContactDetail },
                    { name: 'PhoneBookType', value: req.body.UserType },
                ]
                await Connection.connect();
                const CheckPhoneBookResult = await dataAccess.execute(`SP_Election_Voter`, checkphonebookdata);
                const phonebookdata = CheckPhoneBookResult.recordset;
                // console.log(phonebookdata)
                if (phonebookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Successfully Synced.", data: phonebookdata, error: null });
                }
                else {
                    return res.status(200).json({ status: 1, message: "Successfully Synced.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setPhoneBook = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: fileFilter }).single("ContactFile");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                return res.json({ status: 0, message: FileError, data: null, error: null });
            }
            else {
                if (!req.body.UserID) {
                    res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
                }
                else if (!req.body.UserType) {
                    res.json({ status: 0, message: "Please Enter User Type", data: null, error: null });
                }
                else if (!req.file) {
                    res.json({ status: 0, message: "Please Upload Contact Detail", data: null, error: null });
                }
                else {
                    try {
                        // const readData = fs.createReadStream('./Public/UploadFiles/Contact/6b34f916-7e91-4d7d-830a-f6414a920c5f-analysisdata-bonika.csv.csv')
                        const readData = fs.createReadStream('./Public/UploadFiles/Contact/' + req.file.filename)

                        var strContactDetail = '';
                        const data = []
                        readData
                            .pipe(csv.parse())
                            .on('data', (row) => {
                                // data.push(row)
                                strContactDetail += row + ','
                            })
                            .on('end', async (rowCount) => {
                                //console.log(`${rowCount} rows parsed!`)
                                // console.log(data)
                                //console.log(strContactDetail)

                                //remove file
                                //fs.unlinkSync('./Public/UploadFiles/Contact/' + req.file.filename)

                                if (strContactDetail == '' || strContactDetail == ',') {
                                    return res.status(200).json({ status: 1, message: "Data not passed in csv file", data: null, error: null })
                                }
                                else {
                                    try {
                                        //console.log(strContactDetail.length)
                                        var checkphonebookdata = [
                                            { name: 'Query', value: 'CheckPhoneBookData' },
                                            { name: 'UserID', value: req.body.UserID },
                                            { name: 'MobileNo', value: strContactDetail },
                                            { name: 'PhoneBookType', value: req.body.UserType },
                                        ]
                                        //console.log("strContactDetail.length=========>", strContactDetail.length)
                                        //console.log("checkphonebookdata=========>", checkphonebookdata)
                                        await Connection.connect();
                                        const CheckPhoneBookResult = await dataAccess.execute(`SP_Election_Voter`, checkphonebookdata);
                                        const phonebookdata = CheckPhoneBookResult.recordset;
                                        if (phonebookdata.length > 0) {
                                            return res.status(200).json({ status: 1, message: "Successfully Synced.", data: phonebookdata, error: null });
                                        }
                                        else {
                                            return res.status(200).json({ status: 1, message: "Successfully Synced.", data: null, error: null });
                                        }

                                        // return res.status(200).json({ status: 1, message: "Successfully Synced.", data: null, error: null });

                                    } catch (error) {
                                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                                    }
                                }
                            })
                            .on('error', (e) => {
                                console.error("1==>", e.message)
                                return res.status(200).json({ status: 1, message: e.message, data: null, error: null })
                            })
                    } catch (error) {
                        console.log(error.message)
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPhoneBook = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectUserPhoneBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_PhoneBook`, data);
                const phonebookdata = result.recordset;
                if (phonebookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: phonebookdata, countdata: result.recordsets[1], error: null });
                }
                else {
                    return res.status(200).json({ status: 0, message: "No Data Found", data: null, countdata: result.recordsets[1], error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getKaryakartaPhoneBook = [async (req, res) => {
    try {
        console.log("API Called ====>")
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectKaryakartaPhoneBookCountData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_PhoneBook`, data);
                const karyakartaphonebookdata = result.recordset;
                if (karyakartaphonebookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: karyakartaphonebookdata, countdata: result.recordsets[1], error: null });
                }
                else {
                    return res.status(200).json({ status: 0, message: "No Data Found", data: null, countdata: result.recordsets[1], error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getKaryakartaPhoneBookVoterDetail = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectUserPhoneBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_PhoneBook`, data);
                const phonebookdata = result.recordset;
                if (phonebookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: phonebookdata, countdata: result.recordsets[1], error: null });
                }
                else {
                    return res.status(200).json({ status: 0, message: "No Data Found", data: null, countdata: result.recordsets[1], error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];