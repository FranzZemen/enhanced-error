/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
// Re-export Logger Adapter
export * from '@franzzemen/logger-adapter';

import {match, P} from 'ts-pattern';
import {isLogExecutionContext, LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';


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
      const logA = new LoggerAdapter(log as LogExecutionContext);
      return {log: logA, err};
    })
    .with({log: P.when(log => isLogExecutionContext(log)), err: P.instanceOf(Error)}, ({log, err}) => {
      const logA = new LoggerAdapter(log as LogExecutionContext);
      return {log: logA, err: new EnhancedError(err)};
    })
    .with({log: P.when(log => isLogExecutionContext(log)), err: P.string}, ({log, err}) => {
      const logA = new LoggerAdapter(log as LogExecutionContext);
      return {log: logA, err: new EnhancedError(err)};
    })
    .with({log: P.nullish, err: P.instanceOf(EnhancedError)}, ({err}) => {
      const log = new LoggerAdapter();
      return {log, err};
    })
    .with({log: P.nullish, err: P.instanceOf(Error)}, ({err}) => {
      const log = new LoggerAdapter();
      return {log, err: new EnhancedError(err)};
    })
    .with({err: P.string}, ({err}) => {
      const log = new LoggerAdapter();
      return {log, err: new EnhancedError(err)};
    })
    .with(undefined, () => {
      throw new Error('An error or error string must be passed');
    })
    .otherwise(() => {
      throw new Error('Unreachable code');
    });


export function logErrorAndThrow(error: EnhancedError | Error | string, logConfig?: LoggerAdapter | LogExecutionContext) {
  let {err, log} = getLoggerSpec(error, logConfig);
  if (!err.isLogged) {
    err.isLogged = true;
    log.error(err);
  }
  throw err;


  /*
  if (typeof err === 'string') {
    const error = new EnhancedError(err);
    error.isLogged = true;
    if (log) {
      log.error(error);
    } else {
      const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
      log.info('No logger provided, using executive context');
      log.error(error);
    }
    throw error;
  } else {
    if (err instanceof EnhancedError) {
      if (err.isLogged) {
        throw err;
      } else {
        err.isLogged = true;
        if (log) {
          log.error(err);
        } else {
          const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
          log.info('No logger provided, using executive context');
          log.error(err);
        }
        throw err;
      }
    } else {
      if (log) {
        log.error(err);
      } else {
        const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
        log.info('No logger provided, using executive context');
        log.error(err);
      }
      throw new EnhancedError('Wrapped', err, true);
    }
  }

   */
}

/**
 * Useful for handling Promise errors ( throw logErrorAndReturn(err, log, ec);
 * @param err
 * @param log
 * @param ec
 */
export function logErrorAndReturn(err: Error | string, log?: LoggerAdapter, ec?: LogExecutionContext) {
  if (typeof err === 'string') {
    const error = new EnhancedError(err);
    error.isLogged = true;
    if (log) {
      log.error(error);
    } else {
      const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
      log.warn('No logger provided, using default');
      log.error(error);
    }
    return error;
  }
  if (err instanceof EnhancedError) {
    if (err.isLogged) {
      return err;
    } else {
      err.isLogged = true;
      if (log) {
        log.error(err);
      } else {
        const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
        log.warn('No logger provided, using default');
        log.error(err);
      }
      return err;
    }
  } else {
    if (log) {
      log.error(err);
    } else {
      const log = new LoggerAdapter(ec, 're-common', 'enhanced-error', 'logErrorAndThrow');
      log.warn('No logger provided, using default');
      log.error(err);
    }
    return new EnhancedError( err, true);
  }
}

export class EnhancedError extends Error {
  isOriginalError = true;

  constructor(protected err: string | Error, public isLogged = false) {
    super(typeof err === 'string' ? err : err.message);
    this.isOriginalError = typeof err === 'object';
  }


  /*
  constructor(message?: string, protected err: Error = undefined, public isLogged = false) {
    super(err ? err.message : message);
    if (err) {
      this.isOriginalError = false;
    }
  }
*/

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
