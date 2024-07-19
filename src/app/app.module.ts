import { createServer } from "http";
import { app } from "./app.services";
import { config } from "../core/config/env";

export const startApp = async () => {
  const server = createServer(app);

  server.listen(config.port, () => console.log("server running"));
};
