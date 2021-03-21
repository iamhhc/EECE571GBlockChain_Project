const EthCV = artifacts.require("EthCV");
const truffleAssert = require('truffle-assertions');
require('chai')
.use(require('chai-as-promised'))
.should();

contract(EthCV,([deployer, seller, buyer])=>{
    let ethCV;
    before(async () =>{
        ethCV = await EthCV.deployed()
    })
    describe('Deployment', async()=>{
        it('The deployment should be done successfully',async() =>{
            const address = await ethCV.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined) 
        })

        it('The deployed smart contract has the correct name', async()=>{
            const name = await ethCV.appName();
            assert.equal(name, 'EECE571 ETHCV.COM')
        })
    })
	describe('Functions', async()=>{
        it('The job experience is created successfully', async()=>{
            
        })
    })
});
