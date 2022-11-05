# Read Me
This small package provides Enhanced Errors capability

An Enhanced Error derives from Error.  Functions are provided to avoid optimize code to log and throw, or log and 
return in the case of Promise body usage errors, leveraging the LoggerAdapter that can log to any JS logger.  Its 
syntactical suger.

# Install

    npmi i @franzzemen/enhanced-error

# Module Loader

Leverages ES Module Loading.  To load from CommonJS, use dynamic import, importing types through import type syntax. 
See standard documentation on module loaders in Node.js etc.

# Usage

1. Log an error and rethrow, passing only the string for the error. It will 

    
    logErroandThrow('This is an error');

2. Log an error and rethrow, passing the Error


    logErrorAndThrow(new Error('This is an Error'));

3. Log an error and rethrow, passing the LoggerAdapter


    const log = new LoggerAdapter({...}, 'some-module', 'some-source', 'some-method');
    logErrorAndThrow('This is an Error', log);

4. Log an Error and rethrow, passing the ExecutiveContext (building the log from it)


    const log = new LoggerAdapter({...}, 'some-module', 'some-source', 'some-method');
    logErrorAndThrow('This is an Error', log);

if(typeof err === 'string') {
