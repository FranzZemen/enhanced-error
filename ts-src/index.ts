/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
// Re-export Logger Adapter
export * from '@franzzemen/logger-adapter';

import {match, P} from 'ts-pattern';
import {isLogExecutionContext, LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';



export class EnhancedError extends Error {
  isOriginalError = true;

  constructor(protected err: string | Error, public isLogged = false) {
    super(typeof err === 'string' ? err : err.message);
    this.isOriginalError = typeof err === 'object';
  }

  toString(): string {
    if (this.err) {
      return this.err.toString();
    } else {
      return super.toString();
    }
  }

  toLocaleString(): string {
    if (this.err) {
      return this.err.toLocaleString();
    } else {
      return super.toLocaleString();
    }
  }

  valueOf(): Object {
    if (this.err) {
      return this.err.valueOf();
    } else {
      return super.valueOf();
    }
  }

  hasOwnProperty(v: PropertyKey): boolean {
    if (this.err) {
      return this.err.hasOwnProperty(v);
    } else {
      return super.hasOwnProperty(v);
    }
  }

  isPrototypeOf(v: Object): boolean {
    if (this.err) {
      return this.err.isPrototypeOf(v);
    } else {
      return super.isPrototypeOf(v);
    }
  }

  propertyIsEnumerable(v: PropertyKey): boolean {
    if (this.err) {
      return this.err.propertyIsEnumerable(v);
    } else {
      return super.propertyIsEnumerable(v);
    }
  }
}

type LoggerSpec = { err: EnhancedError, log: LoggerAdapter };
type Input =
  | { log: LoggerAdapter, err: EnhancedError }
  | { log: LoggerAdapter, err: Error }
  | { log: LoggerAdapter, err: string }
  | { log: LogExecutionContext, err: EnhancedError }
  | { log: LogExecutionContext, err: Error }
  | { log: LogExecutionContext, err: string }
  | { err: EnhancedError }
  | { err: Error }
  | { err: string };


const module = '@franzzemen/enhanced-error';
const source = 'index';
const method = 'getLoggerSpec';

const getLoggerSpec = (err, log) =>
  match<Input, LoggerSpec>({log, err})
    .with({log: P.instanceOf(LoggerAdapter), err: P.instanceOf(EnhancedError)}, ({log, err}) => {
      return {log, err};
    })
    .with({log: P.instanceOf(LoggerAdapter), err: P.instanceOf(Error)}, ({log, err}) => {
      return {log, err: new EnhancedError(err)};
    })
    .with({log: P.instanceOf(LoggerAdapter), err: P.string}, ({log, err}) => {
      return {log, err: new EnhancedError(err)};
    })
    .with({log: P.when(log => isLogExecutionContext(log)), err: P.instanceOf(EnhancedError)}, ({log, err}) => {
      const logA = new LoggerAdapter(log as LogExecutionContext, module, source, method);
      return {log: logA, err};
    })
    .with({log: P.when(log => isLogExecutionContext(log)), err: P.instanceOf(Error)}, ({log, err}) => {
      const logA = new LoggerAdapter(log as LogExecutionContext, module, source, method)
      return {log: logA, err: new EnhancedError(err)};
    })
    .with({log: P.when(log => isLogExecutionContext(log)), err: P.string}, ({log, err}) => {
      const logA = new LoggerAdapter(log as LogExecutionContext, module, source, method);
      return {log: logA, err: new EnhancedError(err)};
    })
    .with({log: P.nullish, err: P.instanceOf(EnhancedError)}, ({err}) => {
      const log = new LoggerAdapter({}, module, source, method);
      return {log, err};
    })
    .with({log: P.nullish, err: P.instanceOf(Error)}, ({err}) => {
      const log = new LoggerAdapter({}, module, source, method);
      return {log, err: new EnhancedError(err)};
    })
    .with({err: P.string}, ({err}) => {
      const log = new LoggerAdapter({}, module, source, method);
      return {log, err: new EnhancedError(err)};
    })
    .with(undefined, () => {
      throw new Error('An error or error string must be passed');
    })
    .otherwise(() => {
      throw new Error('Unreachable code');
    });



function logError(error: EnhancedError | Error | string, logConfig?: LoggerAdapter | LogExecutionContext) {
  let {err, log} = getLoggerSpec(error, logConfig);
  if (!err.isLogged) {
    err.isLogged = true;
    log.error(err);
  }
  return err;
}

export function logErrorAndThrow(error: EnhancedError | Error | string, logConfig?: LoggerAdapter | LogExecutionContext) {
  throw logError(error, logConfig);
}

/**
 * Useful for handling Promise errors ( throw logErrorAndReturn(err, log, ec);
 * @param error
 * @param logConfig
 */
export function logErrorAndReturn(error: EnhancedError | Error | string, logConfig?: LoggerAdapter | LogExecutionContext) {
  return logError(error, logConfig);
}

