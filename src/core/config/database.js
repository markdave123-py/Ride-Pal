import { Sequelize } from "sequelize";
import { config } from "./env.js";


const { host, name, password, user } = config.db;


export const sequelizeConn = new Sequelize(name, user, password, {
  host: host,
  dialect: "postgres",
  logging: false,
  omitNull: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
