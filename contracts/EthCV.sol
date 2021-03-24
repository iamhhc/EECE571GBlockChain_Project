//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
pragma abicoder v2;

contract EthCV {
    string public appName;
    uint public totalUserNumber = 0;
    uint public totalNumber = 0;
    uint public recordAddPrice = 1 ether;
    uint public recordVerifyAward = 0.8 ether;

    mapping(address => User) private users;
    mapping(uint => Record) public records;
    // users for searching
    mapping(address => UserForSearch) public usersWithoutPwd;

    struct User {
        address payable userAddress;
        uint userId;
        string fullName;
        string email;
        string password;
        string selfDescription;

        // whenever a record is verified, find the verifier and owner and change below numbers (changes in verify required!)
        uint verifiedByNum;    // count the time the user's experiences verified by others
        uint hasVerifiedNum;   // count the number of user verifying others

        bool isLookingForJobs; // change the status to true if actively looking for jobs
    }

    // search:
    // 1. search user
    // 2. if user's isLookingForJobs is false, do not display record
    // 3. else getPastEvents('RecordCreated', {filter: {recordOwner: xxxx}})
    struct UserForSearch {
        address payable userAddress;
        uint userId;
        string fullName;
        bool isLookingForJobs;
    }

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
        bool isActive; // we can keep this in case we need it?
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

    event StatusChanged (
        address payable indexed recordOwner
    );

    constructor() {
        appName = "EECE571 ETHCV.COM";
    }

    // Register an account (link a metamask account to an password)
    function Register(address payable _ethAccount, string memory _fullName, string memory _email, string memory _password, string memory _selfDescription, bool _isLookingForJobs) public{
        require(_ethAccount != address(0), "account can not be empty");
        require(users[_ethAccount].userId == 0, "account can not be existed");
        require(bytes(_fullName).length > 0, "name can not be empty");
        require(bytes(_email).length > 0, "email can not be empty");
        require(bytes(_password).length > 0, "password can not be empty");
        User memory _user;
        totalUserNumber++;
        _user.userId = totalUserNumber;
        _user.userAddress = _ethAccount;
        _user.fullName = _fullName;
        _user.email = _email;
        _user.password = _password;
        _user.selfDescription = _selfDescription;
        _user.verifiedByNum = 0;
        _user.hasVerifiedNum = 0;
        _user.isLookingForJobs = _isLookingForJobs;
        users[_ethAccount] = _user;

        UserForSearch memory _userForSearch;
        _userForSearch.fullName = _fullName;
        _userForSearch.userAddress = _ethAccount;
        _userForSearch.userId = totalUserNumber;
        _userForSearch.isLookingForJobs = _isLookingForJobs;
        usersWithoutPwd[_ethAccount] = _userForSearch;
    }

    /**
    * input address and password
    * if they match, return true, otherwise return false.
    * front end can get this bool and decide what page the user is going to enter
    */
    function Login(address payable _ethAccount, string memory _password) public returns (bool) {
        require(_ethAccount != address(0), "account can not be empty");
        require(bytes(_password).length > 0, "password can not be empty");
        return keccak256(abi.encodePacked(users[_ethAccount].password)) == keccak256(abi.encodePacked(_password)) ;
    
    }

    //change the self description
    function changeDescription(address payable _accountAddress, string memory _description) public{
        require(msg.sender == _accountAddress, "only the account owner can change the description");
        User memory _user = users[_accountAddress];
        _user.selfDescription = _description;
        users[_accountAddress] = _user;
    }

    //change the job seeking status
    function changeJobStatus(address payable _accountAddress) public{
        require(msg.sender == _accountAddress, "only the account owner can change the status");
        User memory _user = users[_accountAddress];
        UserForSearch memory _userForSearch = usersWithoutPwd[_accountAddress];
        _user.isLookingForJobs = !_user.isLookingForJobs;
        users[_accountAddress] = _user;
        _userForSearch.isLookingForJobs = !__userForSearch.isLookingForJobs;
        usersWithoutPwd[_accountAddress] = _userForSearch;
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
        if (!_isEducation) {
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
        // uint verifiedByNum;
        users[_record.recordOwner].verifiedByNum++;
        users[_record.verifier].hasVerifiedNum++;
        // uint hasVerifiedNum;
        emit RecordVerified(_recordId, _record.recordOwner, msg.sender);
    }

    //change a specific record status, true means others can see the record, false means they can not
    function changeStatus(uint _recordId) public {
        require(_recordId > 0 && _recordId <= totalNumber, "Record should exist");
        Record memory _record = records[_recordId];
        require(msg.sender == _record.recordOwner, "Only the owner can change the status");
        _record.isActive = !_record.isActive;
        records[_recordId] = _record;
        emit StatusChanged(msg.sender);
    }
}
