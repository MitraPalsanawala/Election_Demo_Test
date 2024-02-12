const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const router = express.Router();


exports.GetData = [async (req, res) => {
    try {
        res.render('./Panel/DownloadAPK', { title: 'DownloadAPK' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.DownloadAPK = [async (req, res) => {
    try {
        
        const file = './public/SmartCollection/Sangham 0.1.apk';
        res.download(file); // Set disposition and send it.
        // console.log("Download Completed");
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];