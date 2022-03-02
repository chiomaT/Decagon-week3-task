const { getTrips, getDriver, getVehicle } = require('api');
const drivers = require('api/data/drivers');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
\ * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  driversIds = Object.keys(drivers);
  let report = [];
  const allTrips = await getTrips();
  let trips = [...allTrips];
 for(const driver of driversIds){
   let tripsByDriver = trips.filter(trip => trip.driverID === driver);
   let cashTripsByDriver = allTrips.filter(trip => trip.isCash === true && trip.driverID === driver);
   let noneCashTripsByDriver = allTrips.filter(trip => trip.isCash === false && trip.driverID === driver);
  let driverInfo = await getDriver(driver)
  let noOfVehicles = driverInfo.vehicleID.map(vehicle => getVehicle(vehicle));
  let resolvedNoOfVehicles = (await Promise.all(noOfVehicles)).map(vehicle => ({
    "plate": vehicle.plate,
    "manufacturer": vehicle.manufacturer
  }));
  report.push({
    "fullName": driverInfo.name,
    "id": driver,
    "phone": driverInfo.phone,
    "noOfTrips": tripsByDriver.length,
    "noOfVehicles": noOfVehicles.length,
    "vehicles": resolvedNoOfVehicles,
    "noOfCashTrips": cashTripsByDriver.length,
    "noOfNonCashTrips": noneCashTripsByDriver.length,
    "totalAmountEarned": cashTripsByDriver.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
    +
    noneCashTripsByDriver.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0)
    ,
    "totalCashAmount": cashTripsByDriver.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0),
    "totalNonCashAmount": noneCashTripsByDriver.map(trip=> parseFloat(`${trip.billedAmount || ''}`.replace(',',''))).reduce((a,b) => a+b,0),
    "trips": tripsByDriver.map(trip=>(
      {
            "user": trip.user.name,
            "created": trip.created,
            "pickup": trip.pickup.address,
            "destination": trip.destination.address,
            "billed": trip.billedAmount,
            "isCash": trip.isCash
      }
    ))
  })
}
//  report
//  console.log(report);
 return report;

}
driverReport()

module.exports = driverReport;