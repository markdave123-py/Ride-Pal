// import { sequelizeConn } from "../../core/config/database";
// import { User } from "../../user/models/user.models";
// import {
//   DataTypes,
//   Model,
//   type CreationOptional,
//   type InferAttributes,
//   type InferCreationAttributes,
// } from "@sequelize/core";
// import { v4 as UUIDV4 } from "uuid";

// export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
//   declare id: CreationOptional<string>;
//   declare name: string;
// }

// Role.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       primaryKey: true,
//       defaultValue: UUIDV4,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//   },
//   {
//       indexes: [
//           {
//               unique: true,
//               fields: ["id"],
//               name: "role_id_unique_index"
//           },

//     ],
//     modelName: "roles",
//     tableName: "roles",
//     sequelize: sequelizeConn,
//     timestamps: true,
//     freezeTableName: true,
//   }
// );
