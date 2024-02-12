const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setWard = [async (req, res) => {
    try {
        if (!req.body.WardName) {
            res.json({ status: 0, message: "Please Enter Ward Name", data: null, error: null });
        }
        else if (!req.body.WardNumber) {
            res.json({ status: 0, message: "Please Enter Ward Number", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'Insert' },
                { name: 'WardName', value: req.body.WardName ? req.body.WardName : null },
                { name: 'WardNumber', value: req.body.WardNumber ? req.body.WardNumber : null }
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_Ward`, data);
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
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getWard = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Ward`, [
            { name: 'Query', value: "SelectAll" },
            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
            // { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const warddata = result.recordset;
            if (warddata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: warddata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getWardPramukhData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Ward`, [
            { name: 'Query', value: "SelectWardDetail" },
            { name: 'WardID', value: req.body.WardID ? req.body.WardID : null },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const warddata = result.recordset;
            if (warddata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: warddata, countdata: result.recordsets[1], error: null });
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