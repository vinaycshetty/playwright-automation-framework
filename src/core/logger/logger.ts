/**
 * Minimal leveled logger.
 *
 * Tags every line with the test title (when used inside a test) so that
 * parallel runs remain readable. Keep dependency-free; can be swapped for
 * pino/winston later without changing the call sites.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}

export interface Logger {
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  child(tag: string): Logger;
}

function format(level: LogLevel, tag: string, message: string): string {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] [${tag}] ${message}`;
}

export function createLogger(tag = "app"): Logger {
  return {
    debug(message, ...meta) {
      if (shouldLog("debug"))
        console.debug(format("debug", tag, message), ...meta);
    },
    info(message, ...meta) {
      if (shouldLog("info")) console.log(format("info", tag, message), ...meta);
    },
    warn(message, ...meta) {
      if (shouldLog("warn"))
        console.warn(format("warn", tag, message), ...meta);
    },
    error(message, ...meta) {
      if (shouldLog("error"))
        console.error(format("error", tag, message), ...meta);
    },
    child(childTag) {
      return createLogger(`${tag}:${childTag}`);
    },
  };
}
