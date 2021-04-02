import { createContext, useState, useContext } from 'react';
import Web3 from 'web3';
import EthCV from './abis/EthCV';

export const ethConnectionContext = createContext();

export const useEthConnection = () => {
  return useContext(ethConnectionContext);
};

export const VerifyStatus = {
  Unverified: '0',
  Verified: '1',
  Disapproved: '2',
};

export const useProvideEthConnection = () => {
  const [ethData, setEthData] = useState(null);
  const [activeEthAccount, setActiveEthAccount] = useState(null);
  const [ethCV, setEthCV] = useState(null);


  const updateEthData = async () => {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider use Metamask!');
      return;
    }

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        setActiveEthAccount(null);
      } else {
        setActiveEthAccount(accounts[0]);
      }
    })

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setActiveEthAccount(accounts[0]);
    
    const networkId = await web3.eth.net.getId();
    const networkData = EthCV.networks[networkId];
    console.log(EthCV);
    console.log(networkId, networkData);

    if (networkData) {
      const deployedEthCV = new web3.eth.Contract(EthCV.abi, networkData.address);
      setEthCV(deployedEthCV);
      
      const {methods} = deployedEthCV; 
      const totalUserNumber = await methods.totalUserNumber().call();
      const totalRecordNumber = await methods.totalNumber().call();
      const users = await methods.getAllUsers().call();
      const records = [];
      for (let i = 0; i < totalRecordNumber; i ++) {
        const record = await methods.records(i).call();
        records.push(record);
      }

      console.log(totalUserNumber, totalRecordNumber, users, records);
      setEthData({totalUserNumber, totalRecordNumber, users, records});
    } else {
      console.log('failed to connect to blockchain');
      return;
    }
  }

  const getUserByAddress = (address) => {
    if (ethData == null) {
      return null;
    }

    let {totalUserNumber, users} = ethData; 
    for (let i = 0; i < totalUserNumber; i ++) {
      if (users[i].userAddress.toUpperCase() === address.toUpperCase()) {
        return users[i];
      }
    }

    return null;
  }

  const getVerifiedExperiencesByAddress = (address) => {
    if (ethData == null) {
      return [];
    }
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status === VerifyStatus.Verified && records[i].recordOwner.toUpperCase() === address.toUpperCase()) {
        experiences.push(records[i]);
      }
    }

    return experiences; 
  }

  const getUnverifiedExperiencesByAddress = (address) => {
    if (ethData == null) {
      return [];
    }
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status === VerifyStatus.Unverified && records[i].recordOwner.toUpperCase() === address.toUpperCase()) {
        experiences.push(records[i]);
      }
    }

    return experiences;
  }

  const getVerifiyingInvitationsByAddress = (address) => {
    if (ethData == null) {
      return [];
    }
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status === VerifyStatus.Unverified && records[i].verifier.toUpperCase() === address.toUpperCase()) {
        experiences.push(records[i]);
      }
    }

    return experiences;
  }

  const getAllUsers = () => {
    if (ethData == null) {
      return [];
    }
    let { users } = ethData;
    return users;
  }

  const fakeData = () => {
    // localStorage.setItem('ethData', JSON.stringify({
    setEthData({
      totalUserNumber: 2,
      totalRecordNumber: 6,
      users: [
        {
          userAddress: 'testApplicant',
          userId: 1,
          fullName: 'Applicant Name',
          email: 'applicant@mail.com',
          selfDescription: 'this is a fake applicant account for UI testing',
          verifiedByNum: 4,
          hasVerifiedNum: 0,
          isLookingForJobs: true,
        },
        {
          userAddress: 'testCompany',
          userId: 2,
          fullName: 'Company Name',
          email: 'company@mail.com',
          selfDescription: 'this is a fake company account for UI testing',
          verifiedByNum: 1,
          hasVerifiedNum: 5,
          isLookingForJobs: false,
        },
      ],
      records: [
        {
          recordId: 1,
          recordOwner: 'testApplicant',
          verifier: 'testCompany',
          experience: {
            uId: 2333,
            orgName: 'Company Experience',
            position: 'Company Position',
            description: 'this is a fake company experience',
          },
          education: null,
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: false,
          status: 1,
          isActive: true,
        },
        {
          recordId: 2,
          recordOwner: 'testApplicant',
          verifier: 'testCompany',
          experience: {
            uId: 2333,
            orgName: 'Company Experience',
            position: 'Company Position',
            description: 'this is a fake company experience',
          },
          education: null,
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: false,
          status: 1,
          isActive: true,
        },
        {
          recordId: 3,
          recordOwner: 'testApplicant',
          verifier: 'testCompany',
          experience: {
            uId: 2333,
            orgName: 'Company Experience',
            position: 'Company Position',
            description: 'this is a fake company experience',
          },
          education: null,
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: false,
          status: 1,
          isActive: true,
        },
        {
          recordId: 4,
          recordOwner: 'testApplicant',
          verifier: 'testCompany',
          experience: null,
          education: {
            uId: 6666,
            orgName: 'Education Experience',
            degreeName: 'Education Degree',
            fieldOfStudy: 'Education Field of Study',
            description: 'this is a fake education experience',
          },
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: true,
          status: 0,
          isActive: true,
        },
        {
          recordId: 5,
          recordOwner: 'testApplicant',
          verifier: 'testCompany',
          experience: null,
          education: {
            uId: 6666,
            orgName: 'Education Experience',
            degreeName: 'Education Degree',
            fieldOfStudy: 'Education Field of Study',
            description: 'this is a fake education experience',
          },
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: true,
          status: 0,
          isActive: true,
        },
        {
          recordId: 6,
          recordOwner: 'testCompany',
          verifier: 'testApplicant',
          experience: {
            uId: 2333,
            orgName: 'Company Experience',
            position: 'Company Position',
            description: 'this is a fake company experience',
          },
          education: null,
          startMonthYear: '05/2018',
          endMonthYear: '09/2019',
          isEducation: false,
          status: 0,
          isActive: true,
        },
      ],
    // }));
    });

    // setEthData(JSON.parse(localStorage.getItem('ethData')));

    return true;
  }

  const clearData = () => {
    setEthData(null);
    // localStorage.setItem('ethData', null);
  }

  return {
    ethData,
    ethCV,
    activeEthAccount, 
    clearData,
    updateEthData,
    fakeData,
    getUserByAddress,
    getVerifiedExperiencesByAddress,
    getUnverifiedExperiencesByAddress,
    getVerifiyingInvitationsByAddress,
    getAllUsers,
  };
}

