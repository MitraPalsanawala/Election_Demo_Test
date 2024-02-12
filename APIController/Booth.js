const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getBoothData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Booth`, [
            { name: 'Query', value: "SelectBoothDetail" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);

        if (result.recordset && result.recordset[0]) {
            const boothdata = result.recordset;
            if (boothdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: boothdata, countdata: result.recordsets[1], error: null });
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

exports.getBoothData2 = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Booth`, [
            { name: 'Query', value: "SelectBoothDetailNew" },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null }
        ]);

        if (result.recordset && result.recordset[0]) {
            const boothdata = result.recordset;
            if (boothdata.length > 0) {
                let data_ = boothdata.map((e) => {
                    var e = e
                    if (e.UserDetail != null && e.UserDetail != undefined) {
                        e.UserDetail = JSON.parse(e.UserDetail)
                    } else {

                    }
                    return e
                })
                //console.log(data_)
                res.status(200).json({ status: 1, message: "Success.", data: boothdata, countdata: result.recordsets[1], error: null });
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
        //return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getBoothPramukhData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Booth`, [
            { name: 'Query', value: "SelectBoothPramukh" },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const boothdata = result.recordset;
            if (boothdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: boothdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getElectionBoothData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Booth`, [
            { name: 'Query', value: "SelectBoothDetailElection" },
            // { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null }
        ]);

        if (result.recordset && result.recordset[0]) {
            const boothdata = result.recordset;
            if (boothdata.length > 0) {
                let data_ = boothdata.map((e) => {
                    var e = e
                    if (e.UserDetail != null && e.UserDetail != undefined) {
                        e.UserDetail = JSON.parse(e.UserDetail)
                    } else {

                    }
                    return e
                })
                //console.log(data_)
                res.status(200).json({ status: 1, message: "Success.", data: boothdata, countdata: result.recordsets[1], error: null });
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
        //return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];