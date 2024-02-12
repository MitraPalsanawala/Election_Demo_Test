const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

// const config = {
//     driver: process.env.SQL_DRIVER,
//     server: process.env.SQL_SERVER,
//     database: process.env.SQL_DATABASE,
//     user: process.env.SQL_UID,
//     password: process.env.SQL_PWD,
//     options: {
//         encrypt: false,
//         enableArithAbort: false
//     },
// };
// const pool = new mssql.ConnectionPool(config);

exports.setBooth = [async (req, res) => {
    try {
        if (!req.body.BoothNo) {
            res.json({ status: 0, message: "Please Enter Booth No", data: null, error: null });
        }
        else if (!req.body.BoothName) {
            res.json({ status: 0, message: "Please Enter Booth Name", data: null, error: null });
        }
        else {
            // var Query = {}
            // if (!req.body.BoothMasterID) {
            //     Query.name = "Query";
            //     Query.value = "Insert";
            // }
            // else {
            //     Query.name = "Query";
            //     Query.value = "Update";
            // }

            var data = [
                //Query,
                { name: 'Query', value: req.body.BoothMasterID ? 'Update' : 'Insert' },
                { name: 'BoothMasterID', value: req.body.BoothMasterID ? req.body.BoothMasterID : null },
                { name: 'BoothNo', value: req.body.BoothNo },
                { name: 'BoothName', value: req.body.BoothName },
            ]

            await Connection.connect();
            const result = await dataAccess.execute(`SP_BoothMaster`, data);
            //console.log("result===============>", result)
            if (result.rowsAffected == 1) {
                if (!req.body.BoothMasterID) {
                    res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                }
                else {
                    res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                }
            }
            else {
                res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
            }
        }
    } catch (error) {
        if (error.message.includes('UniqueBoothNo')) {
            return res.status(500).json({ status: 0, message: 'Booth No Already Exists!', data: null, error: null })
        }
        else {
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }
    }
}];

exports.getBooth = [async (req, res) => {
    try {
        // await pool.connect();
        await Connection.connect();
        const result = await dataAccess.execute(`SP_BoothMaster`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        const boothdata = result.recordset;
        if (result.recordset) {
            if (boothdata.length > 0) {
                console.log(boothdata)
                console.log(boothdata.length)
            }
            else {
                console.log("No Data")
            }
            res.status(200).json({ status: 1, message: "Success.", data: boothdata, error: null });
        }
        else {
            res.status(200).json({ status: 1, message: "Success.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

//module.exports = router;