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

/**
 * Create an enhanced error and log it, marking it as logged.  If the error is already enhanced, it will not log again.
 * This avoids the forever logs on error.
 * @param error
 * @param log
 */
export function logAndEnhanceError(error: EnhancedError | Error | string, log: LoggerAdapter): EnhancedError {
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

