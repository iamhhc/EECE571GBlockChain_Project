//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
pragma abicoder v2;

contract EthCV {
    string public appName;
    uint256 public totalUserNumber = 0;
    uint256 public totalNumber = 0;
    uint256 public recordAddPrice = 1 ether;
    uint256 public recordVerifyAward = 0.8 ether;

    uint256 public UNVERIFIED_CODE = 0;
    uint256 public APPROVE_CODE = 1;
    uint256 public DISAPPROVE_CODE = 2;

    mapping(address => User) private users;
    mapping(uint256 => Record) public records;

    UserForSearch[] public usersForSearch;

    struct User {
        address payable userAddress;
        uint256 userId;
        string fullName;
        string email;
        string password;
        string selfDescription;
        // whenever a record is verified, find the verifier and owner and change below numbers (changes in verify required!)
        uint256 verifiedByNum; // count the time the user's experiences verified by others
        uint256 hasVerifiedNum; // count the number of user verifying others
        bool isLookingForJobs; // change the status to true if actively looking for jobs
    }

    struct UserForSearch {
        uint256 userId;
        address payable userAddress;
        string fullName;
        string email;
        string selfDescription;
        uint256 verifiedByNum; // count the time the user's experiences verified by others
        uint256 hasVerifiedNum;
        bool isLookingForJobs;
    }

    struct Record {
        uint256 recordId;
        address payable recordOwner;
        address payable verifier;
        Experience experience;
        Education education;
        string startMonthYear;
        string endMonthYear;
        bool isEducation;
        // 0: not verified 1: verified 2: disapprove
        uint256 status;
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

    event RecordCreated(
        uint256 indexed recordId,
        address payable indexed recordOwner,
        Record record
    );

    event RecordVerified(
        uint256 indexed recordId,
        address payable indexed recordOwner,
        Record record
    );

    event StatusChanged(address payable indexed recordOwner);

    event LoginSuccess(User user);

    event LoginFail(string message);

    constructor() {
        appName = "EECE571 ETHCV.COM";
    }

    // Register an account (link a metamask account to an password)
    function Register(
        address payable _ethAccount,
        string memory _fullName,
        string memory _email,
        string memory _password,
        string memory _selfDescription,
        bool _isLookingForJobs
    ) public returns (bool) {
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
        _user.isLookingForJobs = _isLookingForJobs;
        users[_ethAccount] = _user;

        UserForSearch memory _userForSearch;
        _userForSearch.fullName = _fullName;
        _userForSearch.userAddress = _ethAccount;
        _userForSearch.userId = totalUserNumber;
        _userForSearch.isLookingForJobs = _isLookingForJobs;
        _userForSearch.email = _email;
        _userForSearch.selfDescription = _selfDescription;
        usersForSearch.push(_userForSearch);
        emit LoginSuccess(_user);
        return true;
    }

    /**
     * input address and password
     * if they match, return true, otherwise return false.
     * front end can get this bool and decide what page the user is going to enter
     */
    function Login(address payable _ethAccount, string memory _password)
        public returns (bool)
    {
        require(_ethAccount != address(0), "account can not be empty");
        if (
            keccak256(abi.encodePacked(users[_ethAccount].password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            emit LoginSuccess(users[_ethAccount]);
            return true;
        }
        emit LoginFail("Wrong password!");
        return false;
    }

    //change the self description
    function changeDescription(
        address payable _accountAddress,
        string memory _description
    ) public {
        require(
            msg.sender == _accountAddress,
            "only the account owner can change the description"
        );
        User memory _user = users[_accountAddress];
        _user.selfDescription = _description;
        users[_accountAddress] = _user;
    }

    //change the job seeking status
    function changeJobStatus(address payable _accountAddress) public {
        require(
            msg.sender == _accountAddress,
            "only the account owner can change the status"
        );
        User memory _user = users[_accountAddress];
        _user.isLookingForJobs = !_user.isLookingForJobs;
        users[_accountAddress] = _user;

        usersForSearch[_user.userId - 1].isLookingForJobs = _user
            .isLookingForJobs;
    }

    // create a record
    function createRecord(
        string memory _uId,
        string memory _orgName,
        string memory _position,
        string memory _description,
        string memory _startMonthYear,
        string memory _endMonthYear,
        string memory _degreeName,
        string memory _fieldsOfStudy,
        address payable _verifier,
        bool _isEducation
    ) public payable {
        require(
            _verifier != address(0) && msg.sender != _verifier,
            "Valid verifier address is required"
        );
        require(
            bytes(_startMonthYear).length > 0,
            "Start Month Year is required"
        );
        require(bytes(_endMonthYear).length > 0, "End Month Year is required");
        // check payment
        require(msg.value >= recordAddPrice, "Payment should be good");
        require(bytes(_uId).length > 0, "Id is required");
        require(bytes(_orgName).length > 0, "Org Name is required");
        Record memory _record;
        if (!_isEducation) {
            require(bytes(_position).length > 0, "Position is required");
            _record.experience = Experience(
                _uId,
                _orgName,
                _position,
                _description
            );
        } else {
            require(bytes(_degreeName).length > 0, "Degree Name is required");
            _record.education = Education(
                _uId,
                _orgName,
                _degreeName,
                _fieldsOfStudy,
                _description
            );
        }

        totalNumber++;
        _record.recordId = totalNumber;
        _record.recordOwner = msg.sender;
        _record.verifier = _verifier;
        _record.isEducation = _isEducation;
        _record.status = UNVERIFIED_CODE;
	_record.startMonthYear = _startMonthYear;
	_record.endMonthYear = _endMonthYear;
        _record.isActive = true;
        records[totalNumber] = _record;
        emit RecordCreated(totalNumber, msg.sender, _record);
    }

    // verify a record, true: approve, false: disapprove
    function verifyRecord(uint256 _recordId, bool _isApproved) public payable {
        require(
            _recordId > 0 && _recordId <= totalNumber,
            "Record should exist"
        );
        Record memory _record = records[_recordId];
        address payable _verifier = _record.verifier;
        require(
            msg.sender == _verifier,
            "Record should be verified by correct address"
        );
        require(
            _record.status == UNVERIFIED_CODE,
            "Record should not be verified or disapproved"
        );

        // verify it
        _record.status = _isApproved ? APPROVE_CODE : DISAPPROVE_CODE;
        records[_recordId] = _record;
        _verifier.transfer(recordVerifyAward);
        // uint verifiedByNum; uint hasVerifiedNum;
        users[_record.recordOwner].verifiedByNum++;
        users[_record.verifier].hasVerifiedNum++;
        usersForSearch[users[_record.recordOwner].userId - 1].verifiedByNum++;
        usersForSearch[users[_record.verifier].userId - 1].hasVerifiedNum++;
        emit RecordVerified(_recordId, _record.recordOwner, _record);
    }

    //change a specific record status, true means others can see the record, false means they can not
    function changeStatus(uint256 _recordId) public {
        require(
            _recordId > 0 && _recordId <= totalNumber,
            "Record should exist"
        );
        Record memory _record = records[_recordId];
        require(
            msg.sender == _record.recordOwner,
            "Only the owner can change the status"
        );
        _record.isActive = !_record.isActive;
        records[_recordId] = _record;
        emit StatusChanged(msg.sender);
    }

    function getAllUsers() public view returns (UserForSearch[] memory) {
        return usersForSearch;
    }
}
