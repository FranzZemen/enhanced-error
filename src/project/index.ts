/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
import {LoggerAdapter} from '@franzzemen/logger-adapter';


export class EnhancedError extends Error {
  isOriginalError = true;

  constructor(protected err: string | Error, public isLogged = false) {
    super(typeof err === 'string' ? err : err.message);
    this.isOriginalError = typeof err === 'object';
  }

  override toString(): string {
    if (this.err) {
      return this.err.toString();
    } else {
      return super.toString();
    }
  }

  override toLocaleString(): string {
    if (this.err) {
      return this.err.toLocaleString();
    } else {
      return super.toLocaleString();
    }
  }

  override valueOf(): Object {
    if (this.err) {
      return this.err.valueOf();
    } else {
      return super.valueOf();
    }
  }

  override hasOwnProperty(v: PropertyKey): boolean {
    if (this.err) {
      return this.err.hasOwnProperty(v);
    } else {
      return super.hasOwnProperty(v);
    }
  }

  override isPrototypeOf(v: Object): boolean {
    if (this.err) {
      return this.err.isPrototypeOf(v);
    } else {
      return super.isPrototypeOf(v);
    }
  }

  override propertyIsEnumerable(v: PropertyKey): boolean {
    if (this.err) {
      return this.err.propertyIsEnumerable(v);
    } else {
      return super.propertyIsEnumerable(v);
    }
  }
}

function logError(error: EnhancedError | Error | string, log: LoggerAdapter): EnhancedError {
  let err = error as EnhancedError;
  if (!(error instanceof EnhancedError)) {
    err = new EnhancedError(error);
  }
  if (!err.isLogged) {
    err.isLogged = true;
    log.error(err);
  }
  return err;
}

export function logErrorAndThrow(error: EnhancedError | Error | string, log: LoggerAdapter) {
  throw logError(error, log);
}

/**
 * Useful for handling Promise errors ( throw logErrorAndReturn(err, log, ec);
 * @param error
 * @param logConfig
 */
export function logErrorAndReturn(error: EnhancedError | Error | string, log: LoggerAdapter) {
  return logError(error, log);
}

