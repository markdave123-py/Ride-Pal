import Route from "../models/routes.js";
import Ride from "../models/ride.js";
import { VehicleService } from "../../user/driver/services/vehicle.services.js";
import { UserService } from "../../user/driver/services/driver.services.js";
import { isBeforeStartTime } from "../../core/utils/compareTime.js";

export class RideService {
  static async getAllRoutes(source, destination) {
    const routes = await Route.findAll();

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
    const stops = [];

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
            if (currentTime < rideStartTime) {
              return route;
            }
            // return route;
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

  static async joinRide(ride, passengerId) {
    if (ride.seatAvailable <= 0) {
      return false;
    }

    ride.passengers.push(passengerId);
    ride.seatAvailable -= 1;

    await ride.save();

    return ride;
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
}
