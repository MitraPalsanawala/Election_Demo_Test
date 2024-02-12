const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getStarKaryaKarta = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_StarKaryakarta`, [
            { name: 'Query', value: "SelectAll" },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'UserType', value: req.body.UserType ? req.body.UserType : null },
            { name: 'DesignationID', value: req.body.DesignationID ? req.body.DesignationID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
        ]);

        if (result.recordset && result.recordset[0]) {
            const userdata = result.recordset;
            if (userdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: userdata, error: null });
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
}];