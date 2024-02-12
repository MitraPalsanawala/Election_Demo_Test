var express = require('express');
var router = express.Router();

const BoothMaster = require('../APIController/BoothMaster')
const Booth = require('../APIController/Booth')
const Page = require('../APIController/Page')
const Designation = require('../APIController/Designation')
const User = require('../APIController/User')
const Voter = require('../APIController/Voter')
const Survey = require('../APIController/Survey')
const PhoneBook = require('../APIController/PhoneBook')
const ShareDetail = require('../APIController/ShareDetail')
const AddressBook = require('../APIController/AddressBook')
const StarKaryaKarta = require('../APIController/StarKaryakarta');
const VotingCount = require('../APIController/VotingCount');
const Ward = require('../APIController/Ward');
const DropDown = require('../APIController/Dropdown');
const Cast = require('../APIController/Cast');


// router.post('/BoothMaster/setBooth', BoothMaster.setBooth)
// router.get('/BoothMaster/getBooth', BoothMaster.getBooth)

router.post('/User/setUserLogin', User.setUserLogin)
router.post('/User/setUserLogout', User.setUserLogout)
router.post('/User/setUserLoginOTPVerification', User.setUserLoginOTPVerification)
router.post('/User/setResendLoginOTP', User.setResendLoginOTP)
router.post('/User/setUser', User.setUser)
router.post('/User/getUser', User.getUser)
router.post('/User/setUserAddress', User.setUserAddress)
router.post('/User/getBoothSangathanUserData', User.getBoothSangathanUserData)
router.post('/User/getPageSangathanUserData', User.getPageSangathanUserData)
router.post('/User/setUserActiveStatus', User.setUserActiveStatus)

router.post('/Booth/getBoothData2', Booth.getBoothData)
router.post('/Booth/getBoothData', Booth.getBoothData2)

router.post('/Page/getPageData', Page.getPageData)

router.get('/Designation/getDesignation', Designation.getDesignation)

router.post('/Voter/getVoterData', Voter.getVoterData)
router.post('/Voter/getSearchVoterData', Voter.getSearchVoterData)

router.post('/Voter/getUniqueVoterAddresss', Voter.getUniqueVoterAddresss)
router.post('/Voter/NewgetUniqueVoterAddresss', Voter.getUniqueVoterAddresss)

router.post('/Voter/getUniqueVoterSurnameAddressWise', Voter.getUniqueVoterSurnameAddressWise)

router.post('/Voter/getUniquePollingStation', Voter.getUniquePollingStation)
router.post('/Voter/NewgetUniquePollingStation', Voter.getUniquePollingStation)


router.get('/Voter/getUniqueVoterSurname', Voter.getUniqueVoterSurname)
router.post('/Voter/getBoothVoterData', Voter.getBoothVoterData)
router.post('/Voter/getPageVoterData', Voter.getPageVoterData)
router.post('/Voter/getVoterFamilyData', Voter.getVoterFamilyData)
router.post('/Voter/getVoterCountData', Voter.getVoterCountData)

//New Method : setVoterMobileNoCast => Banti Parmar (22-08-2023)
router.post('/Voter/setVoterMobileNoCast', Voter.setVoterMobileNoCast)

router.post('/Survey/setSurvey', Survey.setSurvey)
router.post('/Survey/getSurvey', Survey.getSurvey)
router.post('/Survey/removeSurvey', Survey.removeSurvey)
router.get('/Survey/getKedarSurvey', Survey.getKedarSurvey)
router.post('/Survey/getOverAllBoothPramukhSurveyCount', Survey.getOverAllBoothPramukhSurveyCount)
router.post('/Survey/getBoothPramukhWiseSurveyData', Survey.getBoothPramukhWiseSurveyData)
router.post('/Survey/getBoothPramukhWiseSurveyVoterData', Survey.getBoothPramukhWiseSurveyVoterData)
router.post('/Survey/getOverAllPagePramukhSurveyCount', Survey.getOverAllPagePramukhSurveyCount)
router.post('/Survey/getPagePramukhWiseSurveyData', Survey.getPagePramukhWiseSurveyData)
router.post('/Survey/getPagePramukhWiseSurveyVoterData', Survey.getPagePramukhWiseSurveyVoterData)
router.post('/Survey/getBoothPramukhWiseNoSurveyData', Survey.getBoothPramukhWiseNoSurveyData)
router.post('/Survey/getYojnaData', Survey.getYojnaData)
router.post('/Survey/getPagePramukhWiseNoSurveyData', Survey.getPagePramukhWiseNoSurveyData)

router.post('/PhoneBook/setPhoneBookOld', PhoneBook.setPhoneBookOld)
router.post('/PhoneBook/setPhoneBook', PhoneBook.setPhoneBook)
router.post('/PhoneBook/getPhoneBook', PhoneBook.getPhoneBook)
router.post('/PhoneBook/getKaryakartaPhoneBook', PhoneBook.getKaryakartaPhoneBook)
router.post('/PhoneBook/getKaryakartaPhoneBookVoterDetail', PhoneBook.getKaryakartaPhoneBookVoterDetail)

router.post('/ShareDetail/setShareDetail', ShareDetail.setShareDetail)
router.post('/ShareDetail/getShareDetail', ShareDetail.getShareDetail)

router.post('/AddressBook/setAddressBook', AddressBook.setAddressBook)
router.post('/AddressBook/getAddressBook', AddressBook.getAddressBook)
router.post('/AddressBook/getKaryakartaAddressBook', AddressBook.getKaryakartaAddressBook)
router.post('/AddressBook/getKaryakartaAddressBookVoterDetail', AddressBook.getKaryakartaAddressBookVoterDetail)


router.post('/StarKaryaKarta/getStarKaryaKarta', StarKaryaKarta.getStarKaryaKarta)
router.post('/User/deleteUser', User.deleteUser)

router.post('/VotingCount/getVoterSLNO', VotingCount.getVoterSLNO)
router.post('/VotingCount/setVoting', VotingCount.setVoting)
// router.post('/VotingCount/setVotingTest', VotingCount.setVotingTest)
router.post('/VotingCount/getTotalVoting', VotingCount.getTotalVoting)

router.post('/User/OfficerLogin', User.OfficerLogin)

router.post('/Ward/setWard', Ward.setWard)
router.post('/Booth/getBoothPramukhData', Booth.getBoothPramukhData)
router.post('/Page/getPagePramukhData', Page.getPagePramukhData)

router.post('/VotingCount/getBoothTotalVoting', VotingCount.getBoothTotalVoting)

router.post('/Ward/getWard', Ward.getWard)
router.post('/Ward/getWardPramukhData', Ward.getWardPramukhData)


router.post('/Voter/getVotingStatusWiseVoterData', Voter.getVotingStatusWiseVoterData)

router.post('/Booth/getElectionBoothData', Booth.getElectionBoothData)

router.post('/VotingCount/setVoting2', VotingCount.setVoting2)

//-------------------dropdown---------------------//
router.get('/DropDown/getPollingStationDropDown', DropDown.getPollingStationDropDown)
router.get('/DropDown/getBoothNameDropDown', DropDown.getBoothNameDropDown)
router.get('/DropDown/getAddressDropDown', DropDown.getAddressDropDown)

//-------------------Cast---------------------//
router.post('/Cast/getCast', Cast.getCast)


router.post('/Voter/getBoothVoterDataPanel', Voter.getBoothVoterDataPanel)
router.post('/Voter/getSearchVoterDataPanel', Voter.getSearchVoterDataPanel)

module.exports = router;