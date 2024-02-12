var baseURL = process.env.BASE;
var request = require('request');

//#startregion Dashboard Total Count view
exports.getDashboardTotalCount = function (params, callback) {
    var options = {
        'method': 'POST',
        'url': `${baseURL}VotingCount/getTotalVoting`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var VotingData = jsonData.data;
                callback(null, VotingData);
            } else {
                callback(null, jsonData);
            }
        }
    });
}
//#endregion vehicle Total Count view

//#startregion Dashboard Booth Total Count view
exports.getDashboardBoothTotalCount = function (params, callback) {
    var options = {
        'method': 'POST',
        'url': `${baseURL}VotingCount/getBoothTotalVoting`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var VotingBoothData = jsonData.data;
                callback(null, VotingBoothData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion vehicle Booth Total Count view

//#startregion  Booth wise Voter Detail view
exports.getBoothwiseVoterDeatil = function (params, callback) {
    var sendParam = {}
    if (params) {
        if (params.BoothID) {
            sendParam["BoothID"] = params.BoothID
        }
        if (params.PaginationID) {
            sendParam["PaginationID"] = params.PaginationID
        }
        if (params.PageLength) {
            sendParam["PageLength"] = params.PageLength
        }
    }
    var options = {
        'method': 'POST',
        'url': `${baseURL}Voter/getBoothVoterDataPanel`,
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                // var VoterData = jsonData.data;
                callback(null, jsonData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion  Booth Total Count Detail view

//#startregion  Master Search Booth wise 
exports.getMasterSearch = function (params, callback) {
    var sendParam = {}
    if (params) {
        if (params.BoothID) {
            sendParam["BoothID"] = params.BoothID
        }
        if (params.Address) {
            sendParam["Address"] = params.Address
        }
        if (params.PollingStation) {
            sendParam["PollingStation"] = params.PollingStation
        }
        if (params.Surname) {
            sendParam["Surname"] = params.Surname
        }
        if (params.FromAge) {
            sendParam["FromAge"] = params.FromAge
        }
        if (params.ToAge) {
            sendParam["ToAge"] = params.ToAge
        }
        if (params.FirstNameEnglish) {
            sendParam["FirstNameEnglish"] = params.FirstNameEnglish
        }
        if (params.MiddleNameEnglish) {
            sendParam["MiddleNameEnglish"] = params.MiddleNameEnglish
        }
        if (params.LastNameEnglish) {
            sendParam["LastNameEnglish"] = params.LastNameEnglish
        }
        if (params.MobileNo) {
            sendParam["MobileNo"] = params.MobileNo
        }
        if (params.PaginationID) {
            sendParam["PaginationID"] = params.PaginationID
        }
        if (params.PageLength) {
            sendParam["PageLength"] = params.PageLength
        }
    }
    // console.log("====API Params=====", params)
    var options = {
        'method': 'POST',
        'url': `${baseURL}Voter/getSearchVoterDataPanel`,
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            // var jsonData = JSON.parse(body);
            // if (jsonData.status == 1) {
            //     var VoterData = jsonData.data;
            //     callback(null, VoterData);
            // } else {
            //     callback(null, jsonData)
            // }

            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                callback(null, jsonData);
            } else {
                callback(null, null)
            }
        }
    });
}
//#endregion  Master Search Booth wise

//#startregion Boothname DropDown
exports.getBoothDropDown = function (params, callback) {
    var options = {
        'method': 'GET',
        'url': `${baseURL}DropDown/getBoothNameDropDown`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var VotingBoothData = jsonData.data;
                callback(null, VotingBoothData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion Boothname DropDown

//#startregion Address DropDown
exports.getAddressDropDown = function (params, callback) {
    var options = {
        'method': 'GET',
        'url': `${baseURL}DropDown/getAddressDropDown`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var AddressData = jsonData.data;
                callback(null, AddressData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion Address DropDown

//#startregion PollingStation DropDown
exports.getPollingStationDropDown = function (params, callback) {
    var options = {
        'method': 'GET',
        'url': `${baseURL}DropDown/getPollingStationDropDown`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var PollingStationData = jsonData.data;
                callback(null, PollingStationData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion PollingStation DropDown

//#startregion Surname DropDown
exports.getSurnameDropDown = function (params, callback) {
    var options = {
        'method': 'GET',
        'url': `${baseURL}Voter/getUniqueVoterSurname`,
        'headers': {
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            if (jsonData.status == 1) {
                var SurnameData = jsonData.data;
                callback(null, SurnameData);
            } else {
                callback(null, jsonData)
            }
        }
    });
}
//#endregion Surname DropDown

