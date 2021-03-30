import { createContext, useState, useContext } from 'react';

export const ethConnectionContext = createContext();

export const useEthConnection = () => {
  return useContext(ethConnectionContext);
};

export const VerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Disapproved: 2,
};

export const useProvideEthConnection = () => {
  const [ethData, setEthData] = useState(null);

  // TODO: fetch data from the backend
  const updateEthData = () => {

  }

  const getUserByAddress = (address) => {
    let {totalUserNumber, users} = ethData; 
    for (let i = 0; i < totalUserNumber; i ++) {
      if (users[i].userAddress === address) {
        return users[i];
      }
    }

    return null;
  }

  const getVerifiedExperiencesByAddress = (address) => {
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status == VerifyStatus.Verified && records[i].recordOwner == address) {
        experiences.push(records[i]);
      }
    }

    return experiences;
  }

  const getUnverifiedExperiencesByAddress = (address) => {
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status == VerifyStatus.Unverified && records[i].recordOwner == address) {
        experiences.push(records[i]);
      }
    }

    return experiences;
  }

  const getVerifiyingInvitationsByAddress = (address) => {
    let {totalRecordNumber, records} = ethData;

    let experiences = [];
    for (let i = 0; i < totalRecordNumber; i ++) {
      if (records[i].status == VerifyStatus.Unverified && records[i].verifier == address) {
        experiences.push(records[i]);
      }
    }

    return experiences;
  }



  // call this function when page refreshed to load the data in local storage
  const refreshed = async () => {
    setEthData(JSON.parse(localStorage.getItem('ethData')));
  }

  const fakeData = () => {
    localStorage.setItem('ethData', JSON.stringify({
      totalUserNumber: 2,
      totalRecordNumber: 2,
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
          recordId: 3,
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
    }));

    setEthData(JSON.parse(localStorage.getItem('ethData')));

    return true;
  }

  return {
    ethData,
    updateEthData,
    refreshed,
    fakeData,
    getUserByAddress,
    getVerifiedExperiencesByAddress,
    getUnverifiedExperiencesByAddress,
    getVerifiyingInvitationsByAddress,
  };
}

