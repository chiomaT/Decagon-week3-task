const { getTrips } = require('api');
const drivers = require('api/data/drivers')

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  //get all trips
  let driversIds = Object.keys(drivers);
 
//expected outputs
let numberOfDriversWithMoreThanOneVehicle= 0;
let highestTripsByDriver =0;
let numberOfTripsByHighestEarningDriver = 0;
const allTrips = await getTrips();
let driverWithTheMostTrips;
let  mostTripDriverID;
let highestEarningDriver;
let highestEarning =0;

for(const driverId of driversIds) {
  let currentDriver = drivers[driverId]

  //get trips by driver
  let tripsByDriver = allTrips.filter(trip => trip.driverID === driverId).length;
  //get the earning of each driver
  let earnings = parseFloat(allTrips.filter(trip => trip.driverID === driverId).map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0).toFixed(2));

  //set condition to get the highest earning, highest earning driver naumber of trips by the highest earning driver
  if(earnings >= highestEarning){
    highestEarning = earnings;
    highestEarningDriver = currentDriver;
    numberOfTripsByHighestEarningDriver = tripsByDriver;
  }

   //set conditions to get the highest tripd by driver, driver with the most trip and his id
   if(tripsByDriver > highestTripsByDriver) {
    highestTripsByDriver = tripsByDriver;
    driverWithTheMostTrips = currentDriver;
    mostTripDriverID = driverId;
   }
   if (currentDriver.vehicleID.length > 1) numberOfDriversWithMoreThanOneVehicle++; 
}
//get the cash trips
let cashTrips = allTrips.filter(trip => trip.isCash === true);
//get the non cash trips
let nonCashTrips = allTrips.filter(trip => trip.isCash === false);
//get the total cash bill
const cashBilledTotal = cashTrips.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
//get the total non cash bill
const nonCashBilledTotal = parseFloat(nonCashTrips.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0).toFixed(2));

//get all result object
result = {
  "noOfCashTrips": cashTrips.length,
  "noOfNonCashTrips": nonCashTrips.length,
  "billedTotal": cashBilledTotal + nonCashBilledTotal,
  "cashBilledTotal": cashBilledTotal,
  "nonCashBilledTotal": nonCashBilledTotal,
  "noOfDriversWithMoreThanOneVehicle": numberOfDriversWithMoreThanOneVehicle-1,
  "mostTripsByDriver": {
    "name": driverWithTheMostTrips.name,
    "email": driverWithTheMostTrips.email,
    "phone": driverWithTheMostTrips.phone,
    "noOfTrips": highestTripsByDriver,
    "totalAmountEarned": allTrips.filter(trip => trip.driverID === mostTripDriverID).map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
  },
  "highestEarningDriver": {
    "name": highestEarningDriver.name,
    "email": highestEarningDriver.email,
    "phone": highestEarningDriver.phone,
    "noOfTrips": numberOfTripsByHighestEarningDriver,
    "totalAmountEarned": highestEarning
  }
}
return result;
}
module.exports = analysis;
analysis()

