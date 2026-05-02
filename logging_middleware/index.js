// Logging Middleware — Public entry point
// Re-exports the Log function for easy integration.

export { Log } from "./logger.js";

// Verification test call
import { Log as TestLog } from "./logger.js";
TestLog("frontend", "info", "api", "test log from middleware");
