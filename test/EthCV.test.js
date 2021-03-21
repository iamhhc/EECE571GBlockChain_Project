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
});
