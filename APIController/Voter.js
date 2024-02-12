const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.getVoterData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterData" },
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

exports.getSearchVoterData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectSearchVoterData" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'MobileNo', value: req.body.MobileNo ? req.body.MobileNo : null },
            { name: 'IDCardNo', value: req.body.IDCardNo ? req.body.IDCardNo : null },
            { name: 'HouseNoEnglish', value: req.body.HouseNoEnglish ? req.body.HouseNoEnglish : null },
            { name: 'PollingStation', value: req.body.PollingStation ? req.body.PollingStation : null },
            { name: 'FirstNameEnglish', value: req.body.FirstNameEnglish ? req.body.FirstNameEnglish : null },
            { name: 'MiddleNameEnglish', value: req.body.MiddleNameEnglish ? req.body.MiddleNameEnglish : null },
            { name: 'LastNameEnglish', value: req.body.LastNameEnglish ? req.body.LastNameEnglish : null },
            { name: 'FullNameEnglish', value: req.body.FullNameEnglish ? req.body.FullNameEnglish : null },
            { name: 'Address', value: req.body.Address ? req.body.Address : null },
            { name: 'VibhagNameEnglish', value: req.body.VibhagNameEnglish ? req.body.VibhagNameEnglish : null },
            { name: 'Surname', value: req.body.Surname ? req.body.Surname : null },
            { name: 'FromAge', value: req.body.FromAge ? req.body.FromAge : null },
            { name: 'ToAge', value: req.body.ToAge ? req.body.ToAge : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
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
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: null, error: null })
    }
}];

exports.getUniqueVoterAddresss = [async (req, res) => {
    try {
        await Connection.connect();
        const pageSize = 30;
        const page = req.body.NextPage || 1;
        const offset = (page - 1) * pageSize;
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectAddress" },
            //{ name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            { name: 'OFFSET', value: offset },
            { name: 'Limit', value: pageSize }
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
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getUniqueVoterSurnameAddressWise = [async (req, res) => {
    try {
        // const pageSize = 30;
        // const page = req.body.NextPage || 1;
        // const offset = (page - 1) * pageSize;
        if (!req.body.VibhagNameEnglish) {
            res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
        }
        else {
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Voter`, [
                { name: 'Query', value: "SelectAddressSurnameWiseVoterCount" },
                { name: 'VibhagNameEnglish', value: req.body.VibhagNameEnglish ? req.body.VibhagNameEnglish : null },
                // { name: 'OFFSET', value: offset },
                // { name: 'Limit', value: pageSize }
            ]);

            if (result.recordset && result.recordset[0]) {
                const surnamedata = result.recordset;
                if (surnamedata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: surnamedata, countdata: result.recordsets[1], error: null });
                }
                else {
                    res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
                }
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, countdata: result.recordsets[1], error: null });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getUniquePollingStation = [async (req, res) => {
    try {
        await Connection.connect();
        const pageSize = 30;
        const page = req.body.NextPage || 1;
        const offset = (page - 1) * pageSize;
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectPollingStation" },
            { name: 'OFFSET', value: offset },
            { name: 'Limit', value: pageSize }
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
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getUniqueVoterSurname = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectSurname" }
        ]);

        if (result.recordset && result.recordset[0]) {
            const surnamedata = result.recordset;
            if (surnamedata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: surnamedata, countdata: result.recordsets[1], error: null });
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

exports.getBoothVoterData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterData" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'VoterID', value: req.body.VoterID ? req.body.VoterID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
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

exports.getPageVoterData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterData" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
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

exports.getVoterFamilyData = [async (req, res) => {
    try {
        if (!req.body.BoothNo) {
            res.json({ status: 0, message: "Please Enter Booth No", data: null, error: null });
        }
        else if (!req.body.VibhagNo) {
            res.json({ status: 0, message: "Please Enter Vibhag No", data: null, error: null });
        }
        else if (!req.body.VibhagNameEnglish) {
            res.json({ status: 0, message: "Please Enter Vibhag Name", data: null, error: null });
        }
        else if (!req.body.HouseNoEnglish) {
            res.json({ status: 0, message: "Please Enter House No", data: null, error: null });
        }
        else {
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Voter`, [
                { name: 'Query', value: "SelectVoterFamilyData" },
                { name: 'BoothNo', value: req.body.BoothNo ? req.body.BoothNo : null },
                { name: 'VibhagNo', value: req.body.VibhagNo ? req.body.VibhagNo : null },
                { name: 'VibhagNameEnglish', value: req.body.VibhagNameEnglish ? req.body.VibhagNameEnglish : null },
                { name: 'HouseNoEnglish', value: req.body.HouseNoEnglish ? req.body.HouseNoEnglish : null },
                //{ name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
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
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getVoterCountData = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterCountData" },
            { name: 'UserID', value: req.body.UserID }
        ]);

        if (result.recordset && result.recordset[0]) {
            const voterdata = result.recordset;
            if (voterdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: voterdata, error: null });
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

exports.getVotingStatusWiseVoterData = [async (req, res) => {
    try {
        await Connection.connect();
        if (!req.body.VotingStatus) {
            res.json({ status: 0, message: "Please Enter VotingStatus", data: null, error: null });
        } else {
            const result = await dataAccess.execute(`SP_Election_Voter`, [
                { name: 'Query', value: "SelectStatusWiseVoterData" },
                { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
                { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
                { name: 'VotingStatus', value: req.body.VotingStatus ? req.body.VotingStatus : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 },
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
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.setVoterMobileNoCast = [async (req, res) => {
    try {
        if (!req.body.VoterID) {
            res.json({ status: 0, message: "Please Enter VoterID", data: null, error: null });
        } else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No", data: null, error: null });
        }
        else {
            var data = [
                { name: 'Query', value: 'UpdateVoter_MobileNo_Cast' },
                { name: 'VoterID', value: req.body.VoterID ? req.body.VoterID : null },
                { name: 'MobileNo', value: req.body.MobileNo ? req.body.MobileNo : null },
                { name: 'CastNameGujarati', value: req.body.CastNameGujarati ? req.body.CastNameGujarati : null },
                { name: 'CastNameEnglish', value: req.body.CastNameEnglish ? req.body.CastNameEnglish : null },
                { name: 'Address', value: req.body.Address ? req.body.Address : null },
                { name: 'AddressGujarati', value: req.body.AddressGujarati ? req.body.AddressGujarati : null }
            ]
            try {
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_Voter`, data);
                if (result.rowsAffected == 1) {
                    return res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                }
                else {
                    return res.status(200).json({ status: 0, message: "Data not updated.", data: null, error: null });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getSearchVoterDataPanel = [async (req, res) => {
    try {
        // console.log("=====bodyDataaa==", req.body);
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectSearchVoterDataPanel" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
            { name: 'MobileNo', value: req.body.MobileNo ? req.body.MobileNo : null },
            { name: 'IDCardNo', value: req.body.IDCardNo ? req.body.IDCardNo : null },
            { name: 'HouseNoEnglish', value: req.body.HouseNoEnglish ? req.body.HouseNoEnglish : null },
            { name: 'PollingStation', value: req.body.PollingStation ? req.body.PollingStation : null },
            { name: 'FirstNameEnglish', value: req.body.FirstNameEnglish ? req.body.FirstNameEnglish : null },
            { name: 'MiddleNameEnglish', value: req.body.MiddleNameEnglish ? req.body.MiddleNameEnglish : null },
            { name: 'LastNameEnglish', value: req.body.LastNameEnglish ? req.body.LastNameEnglish : null },
            { name: 'FullNameEnglish', value: req.body.FullNameEnglish ? req.body.FullNameEnglish : null },
            { name: 'Address', value: req.body.Address ? req.body.Address : null },
            { name: 'VibhagNameEnglish', value: req.body.VibhagNameEnglish ? req.body.VibhagNameEnglish : null },
            { name: 'Surname', value: req.body.Surname ? req.body.Surname : null },
            { name: 'FromAge', value: req.body.FromAge ? req.body.FromAge : null },
            { name: 'ToAge', value: req.body.ToAge ? req.body.ToAge : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 },
            { name: 'PageLength', value: req.body.PageLength ? req.body.PageLength : 30 }
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
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
        // return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getBoothVoterDataPanel = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Election_Voter`, [
            { name: 'Query', value: "SelectVoterDataPanel" },
            { name: 'BoothID', value: req.body.BoothID ? req.body.BoothID : null },
            { name: 'VoterID', value: req.body.VoterID ? req.body.VoterID : null },
            { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 },
            { name: 'PageLength', value: req.body.PageLength ? req.body.PageLength : 30 }
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
