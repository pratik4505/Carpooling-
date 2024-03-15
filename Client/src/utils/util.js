export const modifyRide=(
    rides,
    rideId,
    passengerId,
    newCodeVerified,
    newRideCancelled
  ) =>{
    // Modify the rides array
    for (let i = 0; i < rides.length; i++) {
      if (rides[i]._id === rideId) {
        const passengers = rides[i].passengers;
        for (let j = 0; j < passengers.length; j++) {
          if (passengers[j]._id === passengerId) {
            passengers[j].codeVerified = newCodeVerified;
            passengers[j].rideCancelled = newRideCancelled;
            return; // Stop searching once passenger is modified
          }
        }
      }
    }
  }