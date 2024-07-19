import { Logger } from "winston";
import { buildDevLogger } from "./logger";

export const logger: Logger = buildDevLogger();