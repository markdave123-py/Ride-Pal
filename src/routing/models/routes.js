import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database";

class Route extends Model {}

Route.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startPoint: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    destination: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Drivers", // Name of the related model
        key: "id", // Key in the related model
      },
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    busstops: {
      type: DataTypes.ARRAY(DataTypes.GEOMETRY("POINT")),
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Route",
    tableName: "routes",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Route;
