const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection');
const e = require('express');

const router = express.Router();

exports.setShareDetail = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.VoterID) {
            res.json({ status: 0, message: "Please Enter VoterID", data: null, error: null });
        }
        else if (!req.body.Type) {
            res.json({ status: 0, message: "Please Enter Type", data: null, error: null });
        }
        else {
            try {
                var checksharedetaildata = [
                    { name: 'Query', value: 'CheckShareDetailData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'VoterID', value: req.body.VoterID },
                    { name: 'Type', value: req.body.Type },
                    //{ name: 'IsActive', value: true },
                    { name: 'IsDelete', value: false },
                ]
                await Connection.connect();
                const CheckShareDetailResult = await dataAccess.execute(`SP_Election_ShareDetail`, checksharedetaildata);
                const sheredetaildataresult = CheckShareDetailResult.recordset;
                if (sheredetaildataresult.length > 0) {
                    return res.status(200).json({ status: 0, message: 'Data Already Exists!', data: null, error: null })
                }
                else {
                    var data = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'UserID', value: req.body.UserID },
                        { name: 'VoterID', value: req.body.VoterID },
                        { name: 'Type', value: req.body.Type }
                    ]

                    try {
                        await Connection.connect();
                        const result = await dataAccess.execute(`SP_Election_ShareDetail`, data);
                        if (result.rowsAffected == 1) {
                            res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                        }
                        else {
                            res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                        }
                    } catch (error) {
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getShareDetail = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.Type) {
            res.json({ status: 0, message: "Please Enter Type", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectShareDetailData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'Type', value: req.body.Type },
                    { name: 'IsActive', value: true },
                    { name: 'IsDelete', value: false },
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_ShareDetail`, data);
                if (result.recordset && result.recordset[0]) {
                    const sharedetaildata = result.recordset;
                    if (sharedetaildata.length > 0) {
                        res.status(200).json({ status: 1, message: "Success.", data: sharedetaildata, error: null });
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
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];