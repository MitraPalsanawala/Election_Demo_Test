const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getDesignation = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Designation`, [
            { name: 'Query', value: "SelectAll" },
        ]);
        if (result.recordset && result.recordset[0]) {
            const designationdata = result.recordset;
            if (designationdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: designationdata, countdata: result.recordsets[1], error: null });
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