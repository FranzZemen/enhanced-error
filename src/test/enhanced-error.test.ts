/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
import * as chai from 'chai';
import 'mocha';
import { EnhancedError } from '@franzzemen/enhanced-error';

let should = chai.should();
let expect = chai.expect;

const unreachableCode = false;
// TODO: Renable tests with exeuction context
/*
describe('enhanced-error', () => {
  describe('enhanced-error.test.ts', () => {
    describe('enhanced error tests', () => {
      it('Should create and log an error', () => {
        try {
          const enhanced = new EnhancedError('An error');
          enhanced.isLogged.should.be.false;
          enhanced.isOriginalError = true;
          logErrorAndThrow(enhanced);
        } catch (err) {
          (err instanceof EnhancedError).should.be.true;
          (err as EnhancedError).isLogged.should.be.true;
        }
      });
      it('Should wrap and log an error', () => {
        try {
          throw new Error('Some Error');
        } catch (err) {
          try {
            logErrorAndThrow(err as Error);
          } catch (enhanced) {
            (enhanced instanceof EnhancedError).should.be.true;
            (enhanced as EnhancedError).isLogged.should.be.true;
            try {
              logErrorAndThrow((enhanced as EnhancedError));
            } catch (enhanced2) {
              (enhanced2 instanceof EnhancedError).should.be.true;
              (enhanced2 as EnhancedError).isLogged.should.be.true;
            }
          }
        }
      });
      it('Should get super.message', () => {
        const err = new EnhancedError('Hello World');
        err.message.should.equal('Hello World');
      });
      it('Should get contained error message', () => {
        const err = new EnhancedError(new Error('Goodbye'));
        err.message.should.equal('Goodbye');
      });
      it('Should return an error with string initialzation', () => {
        const err = logErrorAndReturn('Hello World');
        err.message.should.equal('Hello World');
      });
      it('Should handle non-Error errors', () => {
        try {
          throw true;
        } catch (err) {
           //logErrorAndReturn((err as EnhancedError), {});
        }
      });
    });
  });
});
*/
