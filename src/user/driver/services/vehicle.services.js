import Vehicle from "../../model/vehicle.js";


export class VehicleService {

    static async createVehicle(vehicleData) {
        return await Vehicle.create(vehicleData);
    }

    static async getVehicleById(vehicleId) {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) return null
        return {
            plateNumber: vehicle.plateNumber,
            seatNumber: vehicle.seatNumber,
            color: vehicle.color,
            model: vehicle.model,
            ownerId: vehicle.ownerId
        }
    }

}