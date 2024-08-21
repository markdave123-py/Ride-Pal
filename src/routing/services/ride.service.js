import Route from "../models/routes.js";
import Ride from "../models/ride.js";
import { VehicleService } from "../../user/driver/services/vehicle.services.js";
import { UserService } from "../../user/driver/services/driver.services.js";
import { isBeforeStartTime } from "../../core/utils/compareTime.js";

export class RideService {

  static async getAllRoutes(source, destination) {
    const routes = await Route.findAll({
      // where: {
      //   status: "pending",
      // },
    });

    // const filteredRoutes = routes.filter(async (route) => {
    //   const busStops = route.busstops;
    //   const sourceIndex = busStops.indexOf(source);
    //   const destinationIndex = busStops.indexOf(destination);

    //   if (sourceIndex !== -1 && destinationIndex !== -1) {
    //     return (
    //       ((sourceIndex < destinationIndex ||
    //             (source == route.startPoint && destination == route.destination))
    //       && isBeforeStartTime((await this.getRideByRouteId(route.id))))
    //     );
    //   }
    //   return false;
    // });

    const currentTime = new Date();

    const Routes = await Promise.all(
      routes.map(async (route) => {
        const busStops = route.busstops;
        busStops.unshift(route.startPoint);
        busStops.push(route.destination);
        const sourceIndex = busStops.indexOf(source);
        const destinationIndex = busStops.indexOf(destination);
        if (sourceIndex !== -1 && destinationIndex !== -1) {
          if (
            sourceIndex < destinationIndex &&
            route.busstops.includes(source) &&
            route.busstops.includes(destination)
          ) {
            const ride = await this.getRideByRouteId(route.id);
            const rideStartTime = new Date(ride.startTime);
            // return route
            if (currentTime < rideStartTime && ride.status == "pending") {
              return route;
            }
          }
        }
        return null;
      })
    );

    const filteredRoutes = Routes.filter((route) => route !== null);

    const data = [];

    for (let i = 0; i < filteredRoutes.length; i++) {
      const route = {
        id: filteredRoutes[i].id,
        startPoint: filteredRoutes[i].startPoint,
        destination: filteredRoutes[i].destination,
        driver: await UserService.getDriverById(filteredRoutes[i].driverId),
        ride: await RideService.getRideById(filteredRoutes[i].rideId),
        publishedAt: filteredRoutes[i].publishedAt,
        busStops: filteredRoutes[i].busStops,
      };

      data.push(route);
    }

    return data;
  }

  static async getRouteById(id) {
    const route = await Route.findByPk(id);
    if (!route) return false;
    return route;
  }

  static async getRideById(id) {
    const ride = await Ride.findByPk(id);
    //   console.log(ride)

    if (!ride) return false;

    return {
      id: ride.id,
      startTime: ride.startTime,
      destination: ride.destination,
      vehicle: await VehicleService.getVehicleById(ride.vehicleId),
      seatAvailable: ride.seatAvailable,
      instruction: ride.instruction,
      status: ride.status,
    };
  }

  static async getRide(id) {
    const ride = await Ride.findByPk(id);

    if (!ride) return false;

    return ride;
  }

  static async getRideByRouteId(routeId) {
    const ride = await Ride.findOne({
      where: {
        routeId,
      },
    });

    return ride;
  }

  // static async joinRide(ride, passengerId) {
  //   if (ride.seatAvailable <= 0) {
  //     return false;
  //   }

  //   let passengers = ride.passengers;

  //   if (passengers.includes(passengerId)) {
  //     return false;
  //   }

  //   passengers.push(passengerId);
  //   console.log(passengers)

  //    try {
  //      await ride.update({ passengers, seatAvailable: ride.seatAvailable - 1 });
  //      return ride;
  //    } catch (error) {
  //      console.error("Error updating ride:", error);
  //      return false
  //    }
  // }

  static async joinRide(ride, passengerId) {
    if (ride.seatAvailable <= 0) {
      return false;
    }

    let passengers = ride.passengers || [];

    if (passengers.includes(passengerId)) {
      return false;
    }

    passengers.push(passengerId);
    console.log(passengers);

    // Manually mark the passengers field as changed
    ride.set("passengers", passengers);
    ride.set("seatAvailable", ride.seatAvailable - 1);
    ride.changed("passengers", true);
    ride.changed("seatAvailable", true);

    try {
      await ride.save(); // Try using save instead of update
      return ride;
    } catch (error) {
      console.error("Error updating ride:", error);
      return false;
    }
  }

  static async countRide() {
    const count = await Ride.count();
    return count;
  }

  static async LastRideEnded(driverId) {
    const ride = await Ride.findOne({
      where: {
        driverId,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!ride) return "none";

    return ride.endTime !== null;
  }

  static async driverOngoingRide(driverId) {
    const ride = Ride.findOne({
      where: {
        driverId: driverId, status: "ongoing"
      }
    })

    return ride
  }
}
