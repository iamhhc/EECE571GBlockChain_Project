const EthCV = artifacts.require("EthCV");
const truffleAssert = require('truffle-assertions');
require('chai')
    .use(require('chai-as-promised'))
    .should();

contract(EthCV,([deployer, owner, verifier])=>{
    let ethcv;
    before(async () =>{
        ethcv = await EthCV.deployed()
    })
    describe('Deployment', async()=>{
        it('The deployment should be done successfully',async() =>{
            const address = await ethcv.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })

        it('The deployed smart contract has the correct name', async()=>{
            const name = await ethcv.appName();
            assert.equal(name, 'EECE571 ETHCV.COM')
        })
    })

    describe('Create a new record of education', async() => {
        let result, totalNumber
        before(async() => {
            // verifier should be selected from exsiting accounts
            result = await ethcv.createRecord(
                '66550476', 'UBC', '', '', '2020-01-01', '2021-01-01', 'Master', 'ECE', verifier, true, 
                {from: owner, value: web3.utils.toWei('1','Ether')});
            totalNumber = await ethcv.totalNumber()
        })
        it ("Creating education record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordCreated', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === owner.toString();
            });
        })
    })

    describe('Create a new record of work experience', async() => {
        let result, totalNumber
        before(async() => {
            // verifier should be selected from exsiting accounts
            result = await ethcv.createRecord(
                'ali996', 'Alibaba', 'SDE', 'I worked so hard here', '2018-01-01', '2020-01-01', '', '', verifier, false, 
                {from: owner, value: web3.utils.toWei('1','Ether')});
            totalNumber = await ethcv.totalNumber()
        })
        it ("Creating work experience record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordCreated', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === owner.toString();
            });
        })
    })
	
	describe('verify a record of work experience', async() => {
        let result, totalNumber
        before(async() => {
            // first create a new record and then verify it.
            await ethcv.createRecord(
                'testID', 'UBC', '', '', '2020-01-01', '2021-01-01', 'Master', 'ECE', verifier, true, 
                {from: owner, value: web3.utils.toWei('1','Ether')});
            totalNumber = await ethcv.totalNumber()
            result = await ethcv.verifyRecord(totalNumber,{from: verifier, value: web3.utils.toWei('0.8','Ether')});
        })
        it ("Verifying work experience record should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'RecordVerified', (ev) => {
                return ev.recordId.toString() === totalNumber.toString()
                    && ev.recordOwner.toString() === owner.toString()
					&& ev.verifier.toString() === verifier.toString();
            });
        })
		it ("A verified record can not be verified again", async () => {
			await truffleAssert.fails(ethcv.verifyRecord(totalNumber,{from: verifier, value: web3.utils.toWei('0.8','Ether')}), truffleAssert.ErrorType.REVERT);
        })
		it ("can not verify a record that does not exist", async () => {
			await truffleAssert.fails(ethcv.verifyRecord(totalNumber+1,{from: verifier, value: web3.utils.toWei('0.8','Ether')}), truffleAssert.ErrorType.REVERT);
        })
    })
	
	describe('change the status of records', async() => {
        let result, totalNumber
        before(async() => {
            //change the status of owner's records
			result = await ethcv.changeStatus(owner, false, {from: owner});
        })
        it ("Changing the records should be successful if all correct", async () => {
            truffleAssert.eventEmitted(result, 'StatusChanged', (ev) => {
                return ev.recordOwner.toString() === owner.toString();
            });
        })
        it ("only the owner can change the records", async () => {
			await truffleAssert.fails(ethcv.changeStatus(owner, false, {from: verifier}), truffleAssert.ErrorType.REVERT);
            });
        })
    })
});
