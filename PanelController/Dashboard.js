const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const VotingAPIManger = require('../helpers/apiManager');
var dotenv = require('dotenv');
dotenv.config()
const router = express.Router();
const excel = require("exceljs");

exports.GetDashboard = [async (req, res) => {
    try {
        const totalvoting = await new Promise((resolve, reject) => {
            VotingAPIManger.getDashboardTotalCount(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        const totalboothvoting = await new Promise((resolve, reject) => {
            VotingAPIManger.getDashboardBoothTotalCount(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        res.render('./Panel/Dashboard', { title: 'Dashboard', TotalVoteData: totalvoting, BoothTotalVoteData: totalboothvoting });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetVoterDetail = [async (req, res) => {
    try {
        var BoothID = req.params.BoothID;
        var params = {
            "BoothID": BoothID
        }
        const votingdetail = await new Promise((resolve, reject) => {
            VotingAPIManger.getBoothwiseVoterDeatil(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        res.render('./Panel/VoterDetail', { title: 'VoterDetail', VoteDetailData: votingdetail, BoothID: BoothID });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetVoterDetail = [async (req, res) => {
    try {
        var BoothID = req.body.BoothID;
        var bodylastElement = req.body.lastElement;
        var bodyPageLength = req.body.PageLength ? req.body.PageLength : '';
        var params = {
            "BoothID": BoothID,
            "PaginationID": bodylastElement,
            "PageLength": bodyPageLength,
        }

        const votingdetail = await new Promise((resolve, reject) => {
            VotingAPIManger.getBoothwiseVoterDeatil(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        // console.log("====vvvvvv====", votingdetail)
        // res.render('./Panel/VoterDetail', { title: 'VoterDetail', VoteDetailData: votingdetail });
        res.json(votingdetail);
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.VoterDetailExcel = [async (req, res) => {
    try {
        var BoothID = req.body.BoothID ? req.body.BoothID : '';
        var bodylastElement = -1;
        var paramsbody = {
            "BoothID": BoothID,
            "PaginationID": bodylastElement

        }
        console.log("=====params111mmmm=====", paramsbody)
        const votingdetail = await new Promise((resolve, reject) => {
            VotingAPIManger.getBoothwiseVoterDeatil(paramsbody, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        let excelgetVoterDetail = votingdetail.data;
        var count = 1;
        var AllData = [];
        if (excelgetVoterDetail.length > 0) {
            for (const vdata of excelgetVoterDetail) {
                AllData.push({
                    'Sr.No.': count++,
                    FullNameEnglish: vdata.FullNameEnglish ? vdata.FullNameEnglish : '',
                    MobileNo: vdata.MobileNo ? vdata.MobileNo : '',
                    Gender: vdata.Gender == 'M' ? 'Male' : 'Female',
                    Age: vdata.Age ? vdata.Age : '',
                    PollingStation: vdata.PollingStation ? vdata.PollingStation : '',
                    SLNo: vdata.SLNo ? vdata.SLNo : '',
                    Address: vdata.Address ? vdata.Address : '',
                    Pincode: vdata.Pincode ? vdata.Pincode : '',
                    VotingStatus: vdata.VotingStatus ? vdata.VotingStatus : '',
                });
            }
        }
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Voter Detail Report");
        worksheet.columns = [
            { header: "Sr. No.", key: "Sr.No.", width: 8 },
            { header: "Name", key: "FullNameEnglish", width: 20 },
            { header: "Mobile No", key: "MobileNo", width: 13 },
            { header: "Gender", key: "Gender", width: 12 },
            { header: "Age", key: "Age", width: 10 },
            { header: "Polling Station", key: "PollingStation", width: 28 },
            { header: "Serial Number", key: "SLNo", width: 12 },
            { header: "Address", key: "Address", width: 28 },
            { header: "Pincode", key: "Pincode", width: 10 },
            { header: "Voting Status", key: "VotingStatus", width: 10 }
        ];

        worksheet.spliceRows(1, 0, [])
        // Set title
        worksheet.getCell('A1').value = 'Voter Detail Report'

        // Optional merge and styles
        worksheet.mergeCells('A1:J1')
        worksheet.getCell('A1').alignment = { horizontal: 'center' }

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        worksheet.getRow(2).eachCell((cell) => {
            cell.font = { bold: true };
        });

        worksheet.addRows(AllData);

        worksheet.eachRow(function (row, rowNumber) {
            row.eachCell((cell, colNumber) => {
                if (rowNumber == 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff03449e' }
                    },
                        cell.font = { color: { argb: 'ffffff' }, bold: true }
                }
                //Set border of each cell
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };

                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            })
            //Commit the changed row to the stream
            row.commit();
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "VoterDetailReport.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
