const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setSurvey = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else if (!req.body.VoterID) {
            res.json({ status: 0, message: "Please Enter VoterID", data: null, error: null });
        }
        else if (!req.body.SurveyStatus) {
            res.json({ status: 0, message: "Please Enter Survey Status", data: null, error: null });
        }
        else {
            try {
                if (!req.body.SurveyID) {
                    var checksurveydata = [
                        { name: 'Query', value: 'CheckSurveyData' },
                        { name: 'UserID', value: req.body.UserID },
                        { name: 'VoterID', value: req.body.VoterID },
                        //{ name: 'IsActive', value: true },
                        { name: 'IsDelete', value: false },
                    ]
                    await Connection.connect();
                    const CheckSurveyResult = await dataAccess.execute(`SP_Election_Survey`, checksurveydata);
                    const surveydata = CheckSurveyResult.recordset;
                    if (surveydata.length > 0) {
                        return res.status(200).json({ status: 0, message: 'Survey Already Exists!', data: null, error: null })
                    }
                }
                var data = [
                    { name: 'Query', value: req.body.SurveyID ? 'Update' : 'Insert' },
                    { name: 'SurveyID', value: req.body.SurveyID ? req.body.SurveyID : null },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'VoterID', value: req.body.VoterID },
                    { name: 'YojnaID', value: req.body.YojnaID ? req.body.YojnaID : null },
                    { name: 'SurveyStatus', value: req.body.SurveyStatus },
                    { name: 'HopeFromCandidate', value: req.body.HopeFromCandidate ? req.body.HopeFromCandidate : null },
                    { name: 'CurrentAddress', value: req.body.CurrentAddress ? req.body.CurrentAddress : null },
                    { name: 'CurrentLatitude', value: req.body.CurrentLatitude ? req.body.CurrentLatitude : null },
                    { name: 'CurrentLongitude', value: req.body.CurrentLongitude ? req.body.CurrentLongitude : null },
                ]

                try {
                    await Connection.connect();
                    const result = await dataAccess.execute(`SP_Election_Survey`, data);
                    if (result.rowsAffected == 1) {
                        if (!req.body.SurveyID) {
                            res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                        }
                        else {
                            res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                        }
                    }
                    else {
                        res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                    }
                } catch (error) {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
                //}
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getSurvey = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'SelectSurveyData' },
                    { name: 'UserID', value: req.body.UserID },
                    { name: 'SurveyStatus', value: req.body.SurveyStatus ? req.body.SurveyStatus : null },
                    { name: 'IsActive', value: true },
                    { name: 'IsDelete', value: false },
                    { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
                ]
                await Connection.connect();
                const result = await dataAccess.execute(`SP_Election_Survey`, data);
                if (result.recordset && result.recordset[0]) {
                    const surveydata = result.recordset;
                    if (surveydata.length > 0) {
                        res.status(200).json({ status: 1, message: "Success.", data: surveydata, error: null });
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
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.removeSurvey = [async (req, res) => {
    try {
        if (!req.body.SurveyID) {
            res.json({ status: 0, message: "Please Enter SurveyID", data: null, error: null });
        }
        else {
            try {
                var data = [
                    { name: 'Query', value: 'Delete' },
                    { name: 'SurveyID', value: req.body.SurveyID },
                    { name: 'IsDelete', value: true }
                ]
                try {
                    await Connection.connect();
                    const result = await dataAccess.execute(`SP_Election_Survey`, data);
                    if (result.rowsAffected == 1) {
                        res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
                    }
                    else {
                        res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                    }
                } catch (error) {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getKedarSurvey = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectKedarSurveyData' }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const kedarsurveydata = result.recordset;
                if (kedarsurveydata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: kedarsurveydata, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getOverAllBoothPramukhSurveyCount = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectOverAllBoothPramukhSurveyCount' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const overallboothpramukhsurveycountdata = result.recordset;
                if (overallboothpramukhsurveycountdata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: overallboothpramukhsurveycountdata, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getBoothPramukhWiseSurveyData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectBoothPramukhWiseSurveyData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const boothpramukhwisesurveydata = result.recordset;
                if (boothpramukhwisesurveydata.length > 0) {
                    let data_ = boothpramukhwisesurveydata.map((e) => {
                        var e = e
                        if (e.SurveyDetail != null && e.SurveyDetail != undefined) {
                            e.SurveyDetail = JSON.parse(e.SurveyDetail)
                        } else {

                        }
                        return e
                    })
                    //console.log(data_)

                    res.status(200).json({ status: 1, message: "Success.", data: data_, countdata: result.recordsets[1], error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getBoothPramukhWiseSurveyVoterData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectBoothPramukhWiseSurveyVoterData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'SurveyStatus', value: req.body.SurveyStatus ? req.body.SurveyStatus : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const boothpramukhwisesurveyvoterdata = result.recordset;
                if (boothpramukhwisesurveyvoterdata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: boothpramukhwisesurveyvoterdata, countdata: result.recordsets[1], error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getOverAllPagePramukhSurveyCount = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectOverAllPagePramukhSurveyCount' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const overallpagepramukhsurveycountdata = result.recordset;
                if (overallpagepramukhsurveycountdata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: overallpagepramukhsurveycountdata, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPagePramukhWiseSurveyData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectPagePramukhWiseSurveyData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const pagepramukhwisesurveydata = result.recordset;
                if (pagepramukhwisesurveydata.length > 0) {
                    let data_ = pagepramukhwisesurveydata.map((e) => {
                        var e = e
                        if (e.SurveyDetail != null && e.SurveyDetail != undefined) {
                            e.SurveyDetail = JSON.parse(e.SurveyDetail)
                        } else {

                        }
                        return e
                    })
                    res.status(200).json({ status: 1, message: "Success.", data: data_, countdata: result.recordsets[1], error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPagePramukhWiseSurveyVoterData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectPagePramukhWiseSurveyVoterData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'SurveyStatus', value: req.body.SurveyStatus ? req.body.SurveyStatus : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const pagepramukhwisesurveyvoterdata = result.recordset;
                if (pagepramukhwisesurveyvoterdata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: pagepramukhwisesurveyvoterdata, countdata: result.recordsets[1], error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, countdata: result.recordsets[1], error: null })
    }
}];

exports.getBoothPramukhWiseNoSurveyData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectBoothPramukhWiseNoSurveyData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const boothpramukhwisesurveydata = result.recordset;
                if (boothpramukhwisesurveydata.length > 0) {
                    let data_ = boothpramukhwisesurveydata.map((e) => {
                        var e = e
                        if (e.SurveyDetail != null && e.SurveyDetail != undefined) {
                            e.SurveyDetail = JSON.parse(e.SurveyDetail)
                        } else {

                        }
                        return e
                    })
                    //console.log(data_)

                    res.status(200).json({ status: 1, message: "Success.", data: data_, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getYojnaData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectAll' },
                { name: 'YojnaID', value: req.body.YojnaID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Yojna`, data);
            if (result.recordset && result.recordset[0]) {
                const surveydata = result.recordset;
                if (surveydata.length > 0) {
                    res.status(200).json({ status: 1, message: "Success.", data: surveydata, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPagePramukhWiseNoSurveyData = [async (req, res) => {
    try {
        try {
            var data = [
                { name: 'Query', value: 'SelectPagePramukhWiseNoSurveyData' },
                { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
                { name: 'PageID', value: req.body.PageID ? req.body.PageID : null },
                { name: 'PaginationID', value: req.body.PaginationID ? req.body.PaginationID : 0 }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Election_Survey`, data);
            if (result.recordset && result.recordset[0]) {
                const boothpramukhwisesurveydata = result.recordset;
                if (boothpramukhwisesurveydata.length > 0) {
                    let data_ = boothpramukhwisesurveydata.map((e) => {
                        var e = e
                        if (e.SurveyDetail != null && e.SurveyDetail != undefined) {
                            e.SurveyDetail = JSON.parse(e.SurveyDetail)
                        } else {

                        }
                        return e
                    })
                    //console.log(data_)
                    res.status(200).json({ status: 1, message: "Success.", data: data_, error: null });
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
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];
