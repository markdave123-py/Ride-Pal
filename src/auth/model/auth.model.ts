import { sequelizeConn } from "../../core/config/database.ts";
import { User } from "../../user/models/user.models.ts";

import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "@sequelize/core";
import { v4 as UUIDV4 } from "uuid";

export class Auth extends Model<
  InferAttributes<Auth>,
  InferCreationAttributes<Auth>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare refreshToken: CreationOptional<string>;
  declare refreshTokenExp: CreationOptional<Date>;
  declare userId: ForeignKey<User["id"]>;

  public readonly user?: User;
}
Auth.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    refreshToken: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },

    refreshTokenExp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: User,
        key: "id",
      },
    },
  },

  {
    scopes: {
      withRefreshToken: {
        attributes: {
          include: ["refreshToken", "refreshTokenExp"],
        },
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "auth_email_unique_index",
      },
      {
        unique: true,
        fields: ["id"],
      },
    ],
    modelName: "auth",
    tableName: "auth",
    sequelize: sequelizeConn,
    timestamps: true,
    freezeTableName: true,
  }
);

Auth.belongsTo(User, { foreignKey: "userId" });
