import { sequelizeConn } from "../config/database.js";
import { logger } from "../loggers/logger.js";
import User from "../../user/model/user.js";
import Admin from "../../user/model/admin.js";
import Auth from "../../auth/model/auth.model.js";
import Vehicle from "../../user/model/vehicle.js";
import { defaultAdmin } from "../../user/admin/controller/defaultAdmin.js";

export const initializeDbConnection = async () => {
  await sequelizeConn.authenticate();

  await sequelizeConn.sync({ alter: true });

  await defaultAdmin();

  logger.info("Connection has been established successfully.");

  logger.info("All models were synchronized successfully.");
};
