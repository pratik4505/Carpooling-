// MainNotification.jsx
import React, { useContext, useEffect, useState } from 'react';
import Notification from './Notification'; // Import the Notification subcomponent
import './mainNotification.scss'; // Import the CSS file for styling
import CommonLoading from '../loader/CommonLoading';
import GlobalContext from '../../context/GlobalContext';
import {API} from "../../utils/api"
const perPage=40;

export default function MainNotification() {
  const gloContext=useContext(GlobalContext);
  const [loadMore,setLoadMore]=useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotify = async () => {
    try {
      const skip=gloContext.notifications.length;
      const response = await API.get(`/notification/getNotifications?limit=${perPage}&skip=${skip}`);
      const data =  response.data;

      if(data.length>0){
        setLoadMore(true);
        gloContext.setNotifications((prevNotifications) => [...prevNotifications, ...data]);
      }
      else{
        setLoadMore(false);
      }

     
     
    } catch (error) {
      console.error('Error loading notifications:', error);
    }

    setLoading(false);
  };

  useEffect(()=>{
    loadNotify();
  },[])
    
  if (loading) {
    return <CommonLoading />;
  }
 
  return (
    <div className="main-notification-container">
     
      {gloContext.notifications.map((notification) => (
        <Notification key={notification._id} data={notification} />
      ))}
      {loadMore&&<button onClick={loadNotify} className='loadMore'>Load More</button>}
    </div>
  );
}
