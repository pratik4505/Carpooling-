import {useEffect, useState}from 'react'
import { getProfile } from '../../../../Server/controllers/userController'
export const UserProfile = ({ownerId}) => {
    const [loading,setLaoding]=useState(false);
    const [profileData,setProfileData]=useState(null);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await getProfile(ownerId);
            if (!res.error) {
              setProfileData(res.data);
            }
          } catch (error) {
            console.error("Error fetching requests:", error);
          }
        };
        fetchData();
      }, [ownerId]);

  return (
    <div>UserProfile</div>
  )
}
