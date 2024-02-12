var express = require('express');
var router = express.Router();


const DownloadAPK = require('../PanelController/DownloadAPK');
const Dashboard = require('../PanelController/Dashboard');
const MasterSearch = require('../PanelController/MasterSearch');

router.get("/DownloadAPK", DownloadAPK.GetData);
router.post("/DownloadAPK", DownloadAPK.DownloadAPK);
router.get("/Dashboard", Dashboard.GetDashboard);

router.get("/VoterDetail/:BoothID", Dashboard.GetVoterDetail);
// router.post("/VoterDetail/:BoothID", Dashboard.SetVoterDetail);
router.post("/SetVoterDetail", Dashboard.SetVoterDetail);
router.post("/VoterDetailExcel", Dashboard.VoterDetailExcel);

router.get("/MasterSearch", MasterSearch.GetMasterSearch);
router.post("/SetMasterSearch", MasterSearch.SetMasterSearch);
router.post("/MasterSearchExcel", MasterSearch.MasterSearchExcel);
// router.post("/SetMasterSearch", MasterSearch.SetMasterSearch);

module.exports = router;