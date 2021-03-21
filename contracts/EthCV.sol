//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
pragma abicoder v2;

contract EthCV {
    string public appName;
    uint public totalNumber = 0;
    uint public recordAddPrice = 1 ether;
    uint public recordVerifyAward = 0.8 ether;

    mapping(uint => Record) public records;

    struct Record {
        uint recordId;
        address payable recordOwner;
        address payable verifier;
        Experience experience;
        Education education;

        string startMonthYear;
        string endMonthYear;

        bool isEducation;
        bool isVerified;
        bool isActive;
    }

    struct Experience {
        // workID
        string uId;
        // company
        string orgName;

        string position;
        string description;

    }

    struct Education {
        // studentID 
        string uId;
        // school
        string orgName;

        string degreeName;
        string fieldsOfStudy;

        string description;
    }

    event RecordCreated (
        uint indexed recordId,
        address payable indexed recordOwner
    );

    event RecordVerified (
        uint indexed recordId,
        address payable indexed recordOwner,
        address payable verifier
    );

    constructor() {
        appName = "EECE571 ETHCV.COM";
    }

    // create a record
    function createRecord(string memory _uId, string memory _orgName, string memory _position,
        string memory _description, string memory _startMonthYear, string memory _endMonthYear,
        string memory _degreeName, string memory _fieldsOfStudy, address payable _verifier, bool _isEducation) public payable{

        require(_verifier != address(0) && msg.sender != _verifier, "Valid verifier address is required");
        require(bytes(_startMonthYear).length > 0, "Start Month Year is required");
        require(bytes(_endMonthYear).length > 0, "End Month Year is required");
        // check payment
        require(msg.value >= recordAddPrice, "Payment should be good");
        Record memory _record;
        if(!_isEducation) {
            require(bytes(_uId).length > 0, "Worker Id is required");
            require(bytes(_orgName).length > 0, "Org Name is required");
            require(bytes(_position).length > 0, "Position is required");   
            _record.experience = Experience(_uId, _orgName, _position, _description);

        } else {
            require(bytes(_uId).length > 0, "Student Id is required");   
            require(bytes(_orgName).length > 0, "School Name is required");
            require(bytes(_degreeName).length > 0, "Degree Name is required");
            require(bytes(_fieldsOfStudy).length > 0, "Field of study is required");  
            _record.education = Education(_uId, _orgName, _degreeName, _fieldsOfStudy, _description);                      
        }

        totalNumber++;
        _record.recordId = totalNumber;
        _record.recordOwner = msg.sender;
        _record.verifier = _verifier;
        _record.isEducation = _isEducation;
        _record.isVerified = false;
        _record.isActive = true;
        records[totalNumber] = _record;
        emit RecordCreated(totalNumber, msg.sender);
    }
    

    // verify a record
    function verifyRecord(uint _recordId) public payable {
        Record memory _record = records[_recordId];
        address payable _verifier = _record.verifier;
        require(_record.recordId > 0 && _record.recordId <= totalNumber, "Record should exist");
        require(!_record.isVerified, "Record should not be verified");
        require(msg.sender == _verifier, "Record should not be verified by correct address");

        // verify it
        _record.isVerified = true;
        records[_recordId] = _record;
        _verifier.transfer(recordVerifyAward);
        emit RecordVerified(_recordId, _record.recordOwner, msg.sender);
    }

    //change status, true means others can see the records, false means they can not
    function changeStatus(address _recordOwner, bool _isActive) public {
        require(_recordOwner != address(0) && msg.sender == _recordOwner, "Only the owner can change the status");
        for(uint i = 0; i < totalNumber; i++){
            Record memory _record = records[i];
            if(_record.recordOwner == _recordOwner){
                //change the status
                _record.isActive = _isActive;
                records[i] = _record;
            }
        }
    }
}
