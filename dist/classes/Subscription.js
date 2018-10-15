'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Subscription = undefined;var _events = require('events');
var _types = require('../lib/types');

class Subscription extends _events.EventEmitter {
  constructor(id, type) {
    super();
    if (!id) throw new Error('Missing id');
    let isSubsType = Object.values(_types.SUBSCRIPTIONS).includes(type);
    if (!isSubsType) throw new Error(`Unknown subscription type ${type}`);
    this.id = id;
    this.type = type;
  }
  emit(err, data, cb) {
    if (cb) return cb.bind(this)(err, data);
    if (err) return super.emit('error', err);
    if (data !== undefined) return super.emit('data', data);
  }
  delete() {
    throw new Error(`Method delete is not implemented on: ${this.id}`);
  }}exports.Subscription = Subscription;