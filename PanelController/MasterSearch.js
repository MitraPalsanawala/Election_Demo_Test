const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const VotingAPIManger = require('../helpers/apiManager');
var dotenv = require('dotenv');
dotenv.config()
const router = express.Router();
const excel = require("exceljs");

exports.GetMasterSearch = [async (req, res) => {
    try {
        const getBoothName = await new Promise((resolve, reject) => {
            VotingAPIManger.getBoothDropDown(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        const getAddress = await new Promise((resolve, reject) => {
            VotingAPIManger.getAddressDropDown(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        const getPollingStation = await new Promise((resolve, reject) => {
            VotingAPIManger.getPollingStationDropDown(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        const getSurname = await new Promise((resolve, reject) => {
            VotingAPIManger.getSurnameDropDown(null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        res.render('./Panel/MasterSearch', { title: 'MasterSearch', BoothData: getBoothName, AddressData: getAddress, PollingStationData: getPollingStation, SurnameData: getSurname });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetMasterSearch = [async (req, res) => {
    try {
        // console.log("body start=====>", req.body);
        var BoothID = req.body.BoothID ? req.body.BoothID : '';
        var Address = req.body.Address ? req.body.Address : '';
        var PollingStation = req.body.PollingStation ? req.body.PollingStation : '';
        var Surname = req.body.Surname ? req.body.Surname : '';
        var FromAge = req.body.FromAge ? req.body.FromAge : '';
        var ToAge = req.body.ToAge ? req.body.ToAge : '';
        var bodylastElement = req.body.lastElement ? req.body.lastElement : '';
        var bodyPageLength = req.body.PageLength ? req.body.PageLength : '';
        var FirstNameEnglish = req.body.FirstNameEnglish ? req.body.FirstNameEnglish : '';
        var MiddleNameEnglish = req.body.MiddleNameEnglish ? req.body.MiddleNameEnglish : '';
        var LastNameEnglish = req.body.LastNameEnglish ? req.body.LastNameEnglish : '';
        var MobileNo = req.body.MobileNo ? req.body.MobileNo : '';
        // var MobileNo = req.body.MobileNo ? req.body.MobileNo : '';
        var params = {
            "BoothID": BoothID,
            "Address": Address,
            "PollingStation": PollingStation,
            "Surname": Surname,
            "FromAge": FromAge,
            "ToAge": ToAge,
            "PaginationID": bodylastElement,
            "PageLength": bodyPageLength,
            "FirstNameEnglish": FirstNameEnglish,
            "MiddleNameEnglish": MiddleNameEnglish,
            "LastNameEnglish": LastNameEnglish,
            "MobileNo": MobileNo
        }
        // console.log("=====params====", params)
        const getsearchData = await new Promise((resolve, reject) => {
            VotingAPIManger.getMasterSearch(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        if (getsearchData != null) {
            if (getsearchData.data.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success", BindMasterData: getsearchData });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", BindMasterData: null });
            }
        } else {
            return res.status(200).json({ status: 0, Message: "No Data Found.", BindMasterData: null });
        }
    } catch (error) {
        console.log("=====", error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.MasterSearchExcel = [async (req, res) => {
    try {
        console.log("body Data==========12121212=========>");
        console.log("body Data===================>", req.body);
        var BoothID = req.body.BoothID ? req.body.BoothID : '';
        var Address = req.body.Address ? req.body.Address : '';
        var PollingStation = req.body.PollingStation ? req.body.PollingStation : '';
        var Surname = req.body.Surname ? req.body.Surname : '';
        var FromAge = req.body.FromAge ? req.body.FromAge : '';
        var ToAge = req.body.ToAge ? req.body.ToAge : '';
        var bodylastElement = -1;
        // var bodyPageLength = req.body.PageLength ? req.body.PageLength : '';
        var FirstNameEnglish = req.body.FirstNameEnglish ? req.body.FirstNameEnglish : '';
        var MiddleNameEnglish = req.body.MiddleNameEnglish ? req.body.MiddleNameEnglish : '';
        var LastNameEnglish = req.body.LastNameEnglish ? req.body.LastNameEnglish : '';
        var MobileNo = req.body.MobileNo ? req.body.MobileNo : '';
        // var MobileNo = req.body.MobileNo ? req.body.MobileNo : '';
        var params = {
            "BoothID": BoothID,
            "Address": Address,
            "PollingStation": PollingStation,
            "Surname": Surname,
            "FromAge": FromAge,
            "ToAge": ToAge,
            "PaginationID": bodylastElement,
            // "PageLength": bodyPageLength,
            "FirstNameEnglish": FirstNameEnglish,
            "MiddleNameEnglish": MiddleNameEnglish,
            "LastNameEnglish": LastNameEnglish,
            "MobileNo": MobileNo
        }
        console.log("=====boothdata===", params)
        const getsearchData = await new Promise((resolve, reject) => {
            VotingAPIManger.getMasterSearch(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        var count = 1;
        var AllData = [];

        if (getsearchData.length > 0) {
            for (const VDetail of getsearchData) {
                AllData.push({
                    'Sr.No.': count++,
                });
            }
        }

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("VoterDetail");

        worksheet.columns = [
            { header: "Sr. No.", key: "Sr.No.", width: 10 },
            // { header: "Vehicle No", key: "VehicleNo", width: 30 },
            // { header: "Check Post Name", key: "CheckPostName", width: 20 },
            // { header: "Type", key: "Type", width: 10 },
            // { header: "Vehicle Name", key: "VehicleName", width: 30 },
            // { header: "Vehicle Model No", key: "VehicleModelNo", width: 25 },
            // { header: "Vehicle Chasis No", key: "VehicleChasisNo", width: 18 },
            // { header: "Vehicle Engine No", key: "VehicleEngineNo", width: 30 },
            // { header: "Vehicle RC Book", key: "VehicleRCBook", width: 30 },
            // { header: "Vehicle Crime Title", key: "VehicleCrimeTitle", width: 30 },
            // { header: "Vehicle Crime Description", key: "VehicleCrimeDescription", width: 40 },
            // { header: "Date | Time", key: "ScanTime", width: 40 }
        ];

        worksheet.spliceRows(1, 0, [])

        // Set title
        worksheet.getCell('A1').value = 'Voter Detail'

        worksheet.mergeCells('A1:L1')
        worksheet.getCell('A1').alignment = { horizontal: 'center' }

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        worksheet.getRow(2).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });
        worksheet.addRows(AllData);

        worksheet.eachRow(function (row, rowNumber) {
            row.eachCell((cell, colNumber) => {
                if (rowNumber == 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '8b74a2db' }
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
            "attachment; filename=" + "VoterDetail.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
