/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
import {LoggerAdapter} from '@franzzemen/logger-adapter';


export class EnhancedError extends Error {
  isOriginalError = true;


  constructor(error?: unknown, msg: string = '', public isLogged: boolean = false) {
    super(msg.length > 0 ? msg : error instanceof Error? error?.message : 'Unknown Error');
    if(error) {
      this.cause = error;
      this.isOriginalError = false;
    } else {
      this.isOriginalError = true;
    }
  }
}

/**
 * Create an enhanced error and log it, marking it as logged.  If the error is already enhanced, it will not log again.
 * This avoids the forever logs on error.
 *
 * If error is an EnhancedError it will be thrown.  It will be logged as is if not logged.  If message is provided, it will be logged as a warning first.
 * If error is a string, it is used to construct a new EnhancedError, which is logged.  If message is provided, it will be logged as a warning
 * If error is neither a string nor an EnhancedError, a new EnhancedError is constructed using error as cause and the message.
 * If error is not provided, the message will be  used to create a new EnhancedError
 *
 * @param log The logger to use, required.
 * @param error An EnhancedError, Error, unknown or string, or undefined required
 * @param message A string, optional
 */
export function logAndEnhanceError(log: LoggerAdapter, error?: string | Error | unknown, message?: string): EnhancedError {
  if(error !== undefined) {
    if(error instanceof EnhancedError) {
      const enhanceError = error as EnhancedError;
      if(message) {
        log.warn(message);
      }
      if(enhanceError.isLogged === false) {
        log.error(enhanceError);
        enhanceError.isLogged = true;
      }
      return enhanceError;
    } else if (typeof error === 'string') {
      const enhancedError = new EnhancedError(undefined, error);
      if(message) {
        log.warn(message);
      }
      log.error(enhancedError);
      enhancedError.isLogged = true;
      return enhancedError;
    } else {
      const enhancedError = new EnhancedError(error, message);
      log.error(enhancedError);
      enhancedError.isLogged = true;
      return enhancedError;
    }
  } else if(message) {
    const enhancedError = new EnhancedError(undefined, message);
    log.error(enhancedError);
    enhancedError.isLogged = true;
    return enhancedError
  } else {
    const enhancedError = new EnhancedError(undefined, 'Control Feature: unknown');
    log.error(enhancedError);
    enhancedError.isLogged = true;
    return enhancedError;
  }
}

