# Read Me
This small package provides Enhanced Errors capability

An Enhanced Error derives from Error.  Functions are provided to avoid optimize code to log and throw, or log and 
return in the case of Promise body usage errors, leveraging the LoggerAdapter that can log to any JS logger.  Its 
syntactical suger.

Both commonjs (require) and ECMAScript (import) loaders are supported

# Install

    npmi i @franzzemen/enhanced-error

```` javascript
const EnhancedError = require('@franzzemen/enhanced-error').EnhancedError;
````

```` typescript
import{EnhancedError} from '@franzzemen/enhanced-error';
````

# Usage

1. Log an error and rethrow, passing only the string for the error. It will 

```` typescript
logErroandThrow('This is an error');
````

2. Log an error and rethrow, passing the Error

```` typescript
logErrorAndThrow(new Error('This is an Error'));
````
3. Log an error and rethrow, passing the LoggerAdapter

```` typescript
    const log = new LoggerAdapter({...}, 'some-module', 'some-source', 'some-method');
    logErrorAndThrow('This is an Error', log);
````

4. Log an Error and rethrow, passing the ExecutiveContext (building the log from it)

```` typescript
    const log = new LoggerAdapter({...}, 'some-module', 'some-source', 'some-method');
    logErrorAndThrow('This is an Error', log);
````
