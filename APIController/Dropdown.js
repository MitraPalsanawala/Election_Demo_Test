const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getBoothNameDropDown = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Booth`, [
            { name: 'Query', value: "SelectBoothDropDown" }
        ]);
        if (result.recordset && result.recordset[0]) {
            const boothnamedata = result.recordset;
            if (boothnamedata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: boothnamedata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        // return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.getAddressDropDown = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectAddressDropDown" },
        ]);
        if (result.recordset && result.recordset[0]) {
            const addressdata = result.recordset;
            if (addressdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: addressdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        // return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.getPollingStationDropDown = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectPollingStationDropDown" }
        ]);
        if (result.recordset && result.recordset[0]) {
            const pollingstationdata = result.recordset;
            if (pollingstationdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: pollingstationdata, countdata: result.recordsets[1], error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
        }
    } catch (error) {
        // return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
