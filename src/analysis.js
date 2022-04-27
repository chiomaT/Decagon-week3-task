const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  //get all trips
  // let driversIds = Object.keys(drivers);
  let driversIds = [];
  let drivers = [];
  

  const allTrips = await getTrips();
  console.log(allTrips)

  for (let i = 0; i < allTrips.length; i++) {
    driversIds.push(allTrips[i].driverID);
  }

  driversIds = [...new Set(driversIds)];
  
for (const driverId of driversIds) {
    let currentDriver = getDriver(driverId);
    drivers.push(currentDriver);

  }

let driverData = await Promise.allSettled(drivers);

 let driverIdObj = {};

  for (let i = 0; i < driverData.length; i++) {
    try {
      driverIdObj[driversIds[i]] = driverData[i];
    } catch {}
  }

const driverIds = Object.keys(driverIdObj);
//expected outputs
  let numberOfDriversWithMoreThanOneVehicle = 0;
  let highestTripsByDriver = 0;
  let driverWithTheMostTrips;
  let mostTripDriverID;
  let highestEarning = 0;
  let numberOfTripsByHighestEarningDriver = 0;
  let highestEarningDriver;

 for (const driverId of driversIds) {
    let currentDriver = driverIdObj[driverId];

    let tripsByDriver = allTrips.filter(
      (trip) => trip.driverID === driverId
    ).length;
    let earnings = parseFloat(
      allTrips
        .filter((trip) => trip.driverID === driverId)
        .map((trip) =>
          parseFloat(`${trip.billedAmount || ""}`.replace(",", ""))
        )
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    );
    if (earnings >= highestEarning) {
      highestEarning = earnings;
      highestEarningDriver = currentDriver;
      numberOfTripsByHighestEarningDriver = tripsByDriver;
    }

    if (tripsByDriver > highestTripsByDriver) {
      highestTripsByDriver = tripsByDriver;
      driverWithTheMostTrips = currentDriver;
      mostTripDriverID = driverId;
    }

    try {
      if (currentDriver.value.vehicleID.length > 1)
        numberOfDriversWithMoreThanOneVehicle++;
    } catch(e) {

    }
  }

let cashTrips = allTrips.filter(trip => trip.isCash === true);
  let nonCashTrips = allTrips.filter(trip => trip.isCash === false);
  const cashBilledTotal = cashTrips.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
  const nonCashBilledTotal = parseFloat(nonCashTrips.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0).toFixed(2));
   report = {
    "noOfCashTrips": cashTrips.length,
    "noOfNonCashTrips": nonCashTrips.length,
    "billedTotal": cashBilledTotal + nonCashBilledTotal,
    "cashBilledTotal": cashBilledTotal,
    "nonCashBilledTotal": nonCashBilledTotal,
    "noOfDriversWithMoreThanOneVehicle": numberOfDriversWithMoreThanOneVehicle,
    "mostTripsByDriver": {
      "name": driverWithTheMostTrips.value.name,
      "email": driverWithTheMostTrips.value.email,
      "phone": driverWithTheMostTrips.value.phone,
      "noOfTrips": highestTripsByDriver,
      "totalAmountEarned": allTrips.filter(trip => trip.driverID === mostTripDriverID).map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
    },
    "highestEarningDriver": {
      "name": highestEarningDriver.value.name,
      "email": highestEarningDriver.value.email,
      "phone": highestEarningDriver.value.phone,
      "noOfTrips": numberOfTripsByHighestEarningDriver,
      "totalAmountEarned": highestEarning
    }
  }
  return report ;
}

module.exports = analysis;
analysis();
