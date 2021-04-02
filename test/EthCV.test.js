const EthCV = artifacts.require("EthCV");
const truffleAssert = require('truffle-assertions');
require('chai')
    .use(require('chai-as-promised'))
    .should();

contract(EthCV, ([deployer, user, verifier]) => {
    let ethcv;
    before(async () => {
        ethcv = await EthCV.deployed()
    })
    describe('Deployment', async () => {
        it('The deployment should be done successfully', async () => {
            const address = await ethcv.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('The deployed smart contract has the correct name', async () => {
            const name = await ethcv.appName();
            assert.equal(name, 'EECE571 ETHCV.COM')
        })
    })

    describe('Register', async () => {
        let result, totalUserNumber
        before(async () => {
            result = await ethcv.Register(user, 'tester', 'test@ubc.ca', 'pwd111', 'I am a tester', true)
            totalUserNumber = await ethcv.totalUserNumber()
        })
        it("User registration should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'LoginSuccess', (ev) => {
                return ev.user.userAddress.toString() === user.toString()
                    && ev.user.password === 'pwd111';
            });
        })
        it("List all current users", async () => {
            const allUsers = await ethcv.getAllUsers()
            assert.equal(totalUserNumber.toString(), allUsers.length.toString())
            console.log(allUsers)
        })
    })

    describe('Login', async () => {
        let result
        before(async () => {
            result = await ethcv.Login(user, 'pwd111')
        })
        it("User login should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'LoginSuccess', (ev) => {
                return ev.user.userAddress.toString() === user.toString()
                    && ev.user.password === 'pwd111';
            });
        })
        it("User login returns true if all correct", async () => {
            const returnValue = await ethcv.Login.call(user, 'pwd111')
            assert.equal(true, returnValue)
        })
        it("User login returns false if not correct", async () => {
            const returnValue = await ethcv.Login.call(user, 'pwd')
            assert.equal(false, returnValue)
        })
    })

    describe('Create a new record of education', async () => {
        let result, totalNumber, preBalance, preSMBalance
        before(async () => {
            // verifier should be selected from exsiting accounts
            preBalance = await web3.eth.getBalance(user)
            preSMBalance = await web3.eth.getBalance(ethcv.address)
            result = await ethcv.createRecord(
                '66550476', 'UBC', '', '', '2020-01-01', '2021-01-01', 'Master', 'ECE', verifier, true,
                { from: user, value: web3.utils.toWei('1', 'Ether') });
            totalNumber = await ethcv.totalNumber()
        })
        it("Creating education record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordCreated', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === user.toString()
                    && ev.record.verifier.toString() === verifier.toString()
                    && ev.record.isEducation
                    && ev.record.education.orgName === 'UBC';
            });
        })
        it("User should have the correct balance", async () => {
            const curBalance = await web3.eth.getBalance(user)
            const difference = new web3.utils.BN(preBalance) - new web3.utils.BN(curBalance).add(new web3.utils.BN(result.receipt.gasUsed))
            assert.equal(difference.toString(), web3.utils.toWei('1'))
        })
        it("Smart Contract should have the correct balance", async () => {
            const curSMBalance = await web3.eth.getBalance(ethcv.address)
            assert.equal((curSMBalance - preSMBalance).toString(), web3.utils.toWei('1'))
        })
    })

    describe('Create a new record of work experience', async () => {
        let result, totalNumber
        before(async () => {
            // verifier should be selected from exsiting accounts
            result = await ethcv.createRecord(
                'ali996', 'Alibaba', 'SDE', 'I worked so hard here', '2018-01-01', '2020-01-01', '', '', verifier, false,
                { from: user, value: web3.utils.toWei('1', 'Ether') });
            totalNumber = await ethcv.totalNumber()
        })
        it("Creating work experience record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordCreated', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === user.toString();
            });
        })
    })

    describe('verify a record of education', async () => {
        let result, totalNumber, preVerifierBalance, preSMBalance
        before(async () => {
            // the verifier should register first
            await ethcv.Register(verifier, 'UBC', 'verifier@ubc.ca', 'pwd222', 'I am a verifier from ubc', false)
            // first create a new record and then verify it.
            await ethcv.createRecord(
                '111111112', 'UBC', '', '', '2020-01-01', '2021-01-01', 'Master', 'ECE', verifier, true,
                { from: user, value: web3.utils.toWei('1', 'Ether') });
            totalNumber = await ethcv.totalNumber()
            preVerifierBalance = await web3.eth.getBalance(verifier)
            preSMBalance = await web3.eth.getBalance(ethcv.address)
            result = await ethcv.verifyRecord(totalNumber, true, { from: verifier });
        })
        it("Verifying work experience record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordVerified', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === user.toString()
                    && ev.record.status.toString() === '1'
                    && ev.record.verifier.toString() === verifier.toString();
            });
        })
        it("Verifier should have the correct balance", async () => {
            const curVerifierBalance = await web3.eth.getBalance(verifier)
            const difference = new web3.utils.BN(curVerifierBalance).add(new web3.utils.BN(result.receipt.gasUsed)) - new web3.utils.BN(preVerifierBalance)
            assert.equal(difference.toString(), web3.utils.toWei('0.8'))
        })
        it("Smart Contract should have the correct balance", async () => {
            const curSMBalance = await web3.eth.getBalance(ethcv.address)
            assert.equal((preSMBalance - curSMBalance).toString(), web3.utils.toWei('0.8'))
        })
        it("A verified record can not be verified again", async () => {
            await truffleAssert.fails(ethcv.verifyRecord(totalNumber, true, {
                from: verifier,
            }), truffleAssert.ErrorType.REVERT);
        })
        it("can not verify a record that does not exist", async () => {
            await truffleAssert.fails(ethcv.verifyRecord(totalNumber + 1, true, {
                from: verifier,
            }), truffleAssert.ErrorType.REVERT);
        })
    })
	
	describe('disapprove a record', async () => {
        let result, totalNumber, preVerifierBalance, preSMBalance
        before(async () => {
            // first create a new record and then disapprove it.
            await ethcv.createRecord(
                '111111112', 'UBC', '', '', '2020-01-01', '2021-01-01', 'Master', 'ECE', verifier, true,
                { from: user, value: web3.utils.toWei('1', 'Ether') });
            totalNumber = await ethcv.totalNumber()
            preVerifierBalance = await web3.eth.getBalance(verifier)
            preSMBalance = await web3.eth.getBalance(ethcv.address)
            result = await ethcv.verifyRecord(totalNumber, false, { from: verifier });
        })
        it("Disapproving record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordVerified', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === user.toString()
                    && ev.record.status.toString() === '2'
                    && ev.record.verifier.toString() === verifier.toString();
            });
        })
        it("Verifier should have the correct balance", async () => {
            const curVerifierBalance = await web3.eth.getBalance(verifier)
            const difference = new web3.utils.BN(curVerifierBalance).add(new web3.utils.BN(result.receipt.gasUsed)) - new web3.utils.BN(preVerifierBalance)
            assert.equal(difference.toString(), web3.utils.toWei('0.8'))
        })
        it("Smart Contract should have the correct balance", async () => {
            const curSMBalance = await web3.eth.getBalance(ethcv.address)
            assert.equal((preSMBalance - curSMBalance).toString(), web3.utils.toWei('0.8'))
        })
        it("A disapproved record can not be disapproved again", async () => {
            await truffleAssert.fails(ethcv.verifyRecord(totalNumber, false, {
                from: verifier,
            }), truffleAssert.ErrorType.REVERT);
        })
        it("can not disapprove a record that does not exist", async () => {
            await truffleAssert.fails(ethcv.verifyRecord(totalNumber + 1, false, {
                from: verifier,
            }), truffleAssert.ErrorType.REVERT);
        })
    })

    describe('change the status of records', async () => {
        let result, totalNumber
        before(async () => {
            //change the status of owner's records
            totalNumber = await ethcv.totalNumber();
            result = await ethcv.changeStatus(totalNumber, { from: user });
        })
        it("Changing the records should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'StatusChanged', (ev) => {
                return ev.recordOwner.toString() === user.toString();
            });
        })
        it("only the owner can change the records", async () => {
            await truffleAssert.fails(ethcv.changeStatus(user, { from: verifier }), truffleAssert.ErrorType.REVERT);
        });
    })
	
	describe('change job status', async () => {
        let result
        before(async () => {
            result = await ethcv.changeJobStatus(user, { from: user });
        })
        it("Changing the job status should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'JobStatusChanged', (ev) => {
                return ev.recordOwner.toString() === user.toString();
            });
        })
        it("only the owner can change the status", async () => {
            await truffleAssert.fails(ethcv.changeJobStatus(user, { from: verifier }), truffleAssert.ErrorType.REVERT);
        });
    })
	
	describe('change description', async () => {
        let result
        before(async () => {
            result = await ethcv.changeDescription(user, 'new self description', { from: user });
        })
        it("Changing the description should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'DescriptionChanged', (ev) => {
                return ev.recordOwner.toString() === user.toString();
            });
        })
        it("only the owner can change the description", async () => {
            await truffleAssert.fails(ethcv.changeDescription(user, 'new self description1', { from: verifier }), 
				truffleAssert.ErrorType.REVERT);
        });
    })


});
