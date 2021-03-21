//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

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

        // studentID or workID
        string uId;
        // school or company
        string orgName;

        string position;
        string description;
        string startMonthYear;
        string endMonthYear;


        // extra school
        string degreeName;
        string fieldsOfStudy;

        bool isVerified;
		bool isActive;
    }

    event RecordCreated (
        uint indexed recordId
    );

    event RecordVerified (
        uint indexed recordId
    );

    constructor() {
        appName = "EECE571 ETHCV.COM";
    }

    // create a record
    function createRecord(string memory _uId, string memory _orgName, string memory _position,
        string memory _description, string memory _startMonthYear, string memory _endMonthYear,
        string memory _degreeName, string memory _fieldsOfStudy, address payable _verifier) public payable{
        require(bytes(_uId).length > 0, "User Id is required");
        require(bytes(_orgName).length > 0, "Org Name is required");
        require(bytes(_startMonthYear).length > 0, "Start Month Year is required");
        require(bytes(_endMonthYear).length > 0, "End Month Year is required");
        require(_verifier != 0x0 && msg.sender != _verifier, "Valid verifier address is required");
        // check payment
        require(msg.value >= recordAddPrice, "Payment should be good");

        totalNumber++;
        records[totalNumber] = Record(totalNumber, msg.sender, _verifier, _uId,
                            _orgName, _position, _description, _startMonthYear, _endMonthYear,
                            _degreeName, _fieldsOfStudy, false);

        emit RecordCreated(_uId);
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
        emit RecordVerified(_uid);
    }
	
    //change status, true means others can see the records, false means they can not
    function changeStatus(address payable _recordOwner, bool _isActive) public {
		require(_recordOwner != 0x0 && msg.sender == _recordOwner, "Only the owner can change the status");
		for(uint i = 0; i < totalNumber; i++){
			Record memory _record = records[i];
			if(_record.recordOwner == _recordOwner){
				//change the status
				_record.isActive = _isActive;
				records[i] = _record;
			}
		}
    }
    
    //when companies search candidates, they search people or their records?
	//the front end will get all the records and filter the information needed
    function searchCandidates() public{
    }


}
