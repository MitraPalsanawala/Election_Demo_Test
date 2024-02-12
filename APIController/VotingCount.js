const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getVoterSLNO = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterSLNo" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null }
        ]);
        if (result.recordset && result.recordset[0]) {
            const voterdata = result.recordset;
            if (voterdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: voterdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.setVotingOLD = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.VoterID) {
            res.json({ status: 0, message: "Please Enter VoterID", data: null, error: null });
        }
        else if (!req.body.BoothID) {
            res.json({ status: 0, message: "Please Enter BoothID", data: null, error: null });
        }
        else {
            var checkuserdata = [
                { name: 'Query', value: 'CheckUserData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'VoterID', value: req.body.VoterID ? req.body.VoterID : null },
                { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
                { name: 'IsDelete', value: '1' },
            ]
            await Connection.connect();
            const CheckDataResult = await dataAccess.execute(`SP_Election_Voting`, checkuserdata);
            const userdata = CheckDataResult.recordset;
            if (userdata.length > 0) {
                return res.status(200).json({ status: 0, message: 'Data Already Exists!', data: null, error: null })
            } else {
                var data = [
                    { name: 'Query', value: 'Insert' },
                    { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                    { name: 'VoterID', value: req.body.VoterID ? req.body.VoterID : null },
                    { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null }
                ]
                try {
                    await Connection.connect();
                    const result = await dataAccess.execute(`SP_Election_Voting`, data);
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
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.setVoting2 = [async (req, res) => {
    try {
        console.log("====req.body====", req.body)
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.BoothID) {
            res.json({ status: 0, message: "Please Enter BoothID", data: null, error: null });
        }
        else {
            await Connection.connect();
            var VoterDetailID = (req.body.VoterDetailID) ? (req.body.VoterDetailID) : [];

            if (typeof (VoterDetailID) === 'string') {
                VoterDetailID = JSON.parse(VoterDetailID)
            }

            if (VoterDetailID != null && VoterDetailID != "" && VoterDetailID !== []) {
                console.log("=====bind====", VoterDetailID)
                if (VoterDetailID.length > 0) {
                    for (let i = 0; i < VoterDetailID.length; i++) {
                        var checkuserdata = [
                            { name: 'Query', value: 'CheckUserData' },
                            { name: 'VoterID', value: VoterDetailID[i]["VoterID"] },
                            { name: 'IsDelete', value: '1' },
                        ]
                        const CheckDataResult = await dataAccess.execute(`SP_Election_Voting`, checkuserdata);
                        const userdata = CheckDataResult.recordset;
                        if (!userdata.length > 0) {
                            var data = [
                                { name: 'Query', value: 'Insert' },
                                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                                { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
                                { name: 'VoterID', value: VoterDetailID[i]["VoterID"] },
                            ]
                            const result = await dataAccess.execute(`SP_Election_Voting`, data);
                        }
                    }
                    res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                }
                else {
                    res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setVoting = [async (req, res) => {
    try {
        console.log("====req.body====", req.body)
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.BoothID) {
            res.json({ status: 0, message: "Please Enter BoothID", data: null, error: null });
        }
        else {
            await Connection.connect();
            var VoterDetailID = (req.body.VoterDetailID) ? (req.body.VoterDetailID) : [];
            if (VoterDetailID != null && VoterDetailID != "" && VoterDetailID !== []) {
                console.log("=====bind====", VoterDetailID)
                if (VoterDetailID.length > 0) {
                    VoterDetailID = req.body.VoterDetailID.split(',');
                    for (let i = 0; i < VoterDetailID.length; i++) {
                        var checkuserdata = [
                            { name: 'Query', value: 'CheckUserData' },
                            { name: 'VoterID', value: VoterDetailID[i] },
                            { name: 'IsDelete', value: '1' },
                        ]
                        const CheckDataResult = await dataAccess.execute(`SP_Election_Voting`, checkuserdata);
                        const userdata = CheckDataResult.recordset;
                        if (!userdata.length > 0) {
                            var data = [
                                { name: 'Query', value: 'Insert' },
                                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                                { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
                                { name: 'VoterID', value: VoterDetailID[i] },
                            ]
                            const result = await dataAccess.execute(`SP_Election_Voting`, data);
                        }
                    }
                    res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                }
                else {
                    res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                }
            }

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getTotalVoting = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voting`, [
            { name: 'Query', value: "SelectTotalVoting" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
        ]);
        if (result.recordset && result.recordset[0]) {
            const voterdata = result.recordset;
            if (voterdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: voterdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getBoothTotalVoting = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voting`, [
            { name: 'Query', value: "SelectTotalBoothVoting" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
        ]);
        if (result.recordset && result.recordset[0]) {
            const voterdata = result.recordset;
            if (voterdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: voterdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

