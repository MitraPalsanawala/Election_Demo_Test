const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const router = express.Router();

exports.getPageData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Page`, [
            { name: 'Query', value: "SelectPageDetail" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const pagedata = result.recordset;
            if (pagedata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: pagedata, countdata: result.recordsets[1], error: null });
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

exports.getPagePramukhData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Page`, [
            { name: 'Query', value: "SelectPagePramukh" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);
        if (result.recordset && result.recordset[0]) {
            const pagedata = result.recordset;
            if (pagedata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: pagedata, countdata: result.recordsets[1], error: null });
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