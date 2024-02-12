const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.setAddressBook = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.VibhagNameEnglish) {
            res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
        }
        else if (!req.body.UserType) {
            res.json({ status: 0, message: "Please Enter User Type", data: null, error: null });
        }
        else {
            try {
                var checkaddressbookdata = [
                    { name: 'Query', value: 'CheckAddressBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'VibhagNameEnglish', value: req.body.VibhagNameEnglish },
                    { name: 'AddressBookType', value: req.body.UserType },
                ]
                await Connection.connect();
                const CheckAddressBookResult = await dataAccess.execute(`SP_Election_Voter`, checkaddressbookdata);
                const addressbookdata = CheckAddressBookResult.recordset;
                // console.log(addressbookdata)
                if (addressbookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Successfully Synced.", data: addressbookdata, error: null });
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

exports.getAddressBook = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectUserAddressBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_AddressBook`, data);
                const addressbookdata = result.recordset;
                if (addressbookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: addressbookdata, countdata: result.recordsets[1], error: null });
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

exports.getKaryakartaAddressBook = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectKaryakartaAddressBookCountData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_AddressBook`, data);
                const karyakartaaddressbookdata = result.recordset;
                if (karyakartaaddressbookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: karyakartaaddressbookdata, countdata: result.recordsets[1], error: null });
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

exports.getKaryakartaAddressBookVoterDetail = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectUserAddressBookData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_AddressBook`, data);
                const addressbookdata = result.recordset;
                if (addressbookdata.length > 0) {
                    return res.status(200).json({ status: 1, message: "Success", data: addressbookdata, countdata: result.recordsets[1], error: null });
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