import BaseError from './base';

export default class InvariantViolated extends BaseError {
  readonly name = 'InvariantViolated';
}
