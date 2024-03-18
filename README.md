## Carpooling 

**Team Name:** Code Slayers                                                       
**Team Members name:**
 - [Vaibhav Kumar Maurya](https://github.com/Vaibhavdev309)  
 - [Kushagra Verma](https://github.com/kushagra572)  
 - [Uttam Raj Singh](https://github.com/Uttam426)
 - [Pratik Nandan](https://github.com/pratik4505)


## Features

- **User Authentication:** Authentication through Login Signup page
- **Email verifiction:** Email verification using OTP during signUp and changing password
- **DL Verification:** Driving Licence and DOB verification if user wants to Publish Rides
- **Publish Rides:** Driver can Register any of its rides specifying following things:
  origin and  destination point of his vehicle on map,
  the date and start time of his ride,
  number of available seats in his vehicle,
  cost per km he/she wants to charge and the type of his vehicle.
- **Route selection** -Driver can select the route he wants from the various routes shown on map.
- **Search Rides** -User can search and choose among various available rides according to their requirements by specifing following things :
   His/her pickup and destination point,
   traveling date,
   time range in which he/she will be availale at the pickUp point,
   Number of seats required
- **Ride request** -User would have to first send a request for the ride to its driver.
- **Request Notification** -Driver get notifications of ride requests made by users. Driver can accept and decline the request.
- **Cashless Payment** -After driver confirms the ride request, user must pay the required amount to book the seats in the ride.User can also choose to decline the payment.
- **Group Chat** -Every published ride has  a chat room.User can chat with driver and co-passengers to get more information about the journey.
- **Toxic message Identification** -No one can send any toxic message in the chat rooms.
- **Location Sharing** -Anyone can share his/her current location in chat.
- **Map visualization** -User can see the route and points of any the rides on map.
- **Booked Rides** -User can see the  upcoming booked rides with detailed information of each ride(can see pickUp and dropOff point on map).
- **Cancel booked ride** -User can cancel any of the booked rides and the amount will be refunded after deduction of some charge.
- **Rating System** - After ride, passengers and driver can rate each other and may also give feedback
- **Published Rides** -Driver can see all of his/her upcoming rides with passenges deatils for each ride.
- **PickUp points** -Driver can see pickUp points of all the passengers on the route.
- **Code verification** -Driver will have to verify all the 6-digits codes given by passengers to confirm the ride. Failing this driver will not get the payment.
- **Cancel published Rides** -Driver can cancel any of its published rides, in that case all the booked rides will be refunded.
- **Ride history** -user and driver can see the detailed history of their previous rides.
- **Transaction history** -user and driver can see all their transactions in detail.
- **Profiles** -anyone can open anyones profile to see the ratings of  their past rides.
- **ContactUs** -user can address any issue to admin by maining through contactUs form.


## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## External Libraries/APIs
- **Google maps API:** Place API,Geocoding API,MAPS JavaScript API,Direction API, Geolocation API
- **Sending mails**: Nodemailer
- **Licence Verification API**
- **Socket.IO**
- **stripe**
- **Perspective API**
- **Styling:** Bootstrap, Tailwind CSS


## Images


## Installation

1. Clone the repository:
   `git clone https://github.com/pratik4505/Carpooling-.git`

2. Install dependencies for both frontend and backend:

```
   cd server
   npm install

   cd client
   npm install
```

3. PUT required API KEYS in .env file  (see .env.example)

4. Run the application:
```
//Run frontend (in the frontend directory)
npm run dev

//Run backend (in the backend directory)
npm start
```

6. Access the application at `http://localhost:5173/`



## Deployed Link
Access the deployed site here: 