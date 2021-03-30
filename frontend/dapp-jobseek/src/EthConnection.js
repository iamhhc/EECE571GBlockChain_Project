import React, { createContext, useState, useContext } from 'react';

export const ethConnectionContext = createContext();

export const useEthConnection = () => {
  return useContext(ethConnectionContext);
}

export const useProvideEthConnection = () => {
  const [ethData, setEthData] = useState(null);

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
      ],
    }));

    setEthData(JSON.parse(localStorage.getItem('ethData')));

    return true;
  }

  return {
    ethData,
    refreshed,
    fakeData,
  };
}

