const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();


exports.getCast = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Cast`, [
            { name: 'Query', value: "SelectAll" },
            { name: 'CastID', value: req.body.CastID ? req.body.CastID : null },
        ]);

        if (result.recordset && result.recordset[0]) {
            const castdata = result.recordset;
            if (castdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: castdata, countdata: result.recordsets[1], error: null });
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