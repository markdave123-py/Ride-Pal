import { sequelizeConn } from "../config/database";
import { logger } from "../loggers";
import "./associations";


export const initializeDbConnection = async () => {
  await sequelizeConn.authenticate();

  await sequelizeConn.sync({ alter: true });



  logger.info("Connection has been established successfully.");

  logger.info("All models were synchronized successfully.");
};
