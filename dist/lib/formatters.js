"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.addTraceIndex = exports.logFormatter = exports.txReceiptFormatter = exports.txFormatter = exports.syncFormatter = exports.uncleFormatter = exports.blockFormatter = exports.format = exports.formatKey = void 0;var _utils = require("./utils");

const formatKey = (obj, key, formatter) => {
  if (!obj) return obj;
  let value = obj[key];
  if (undefined !== value) {
    obj[key] = formatter(value);
  }
  return obj;
};exports.formatKey = formatKey;

const format = (obj, formats) => {
  for (let key in formats) {
    obj = formatKey(obj, key, formats[key]);
  }
  return obj;
};exports.format = format;

const addDefaultFields = fields => {
  let def = {
    transactionIndex: _utils.toDecimal,
    blockNumber: _utils.toDecimal,
    timestamp: _utils.toDecimal,
    gas: _utils.toDecimal,
    gasUsed: _utils.toDecimal };

  return Object.assign(def, fields);
};

const blockFormatter = block => {
  block = format(block, {
    number: _utils.toDecimal,
    timestamp: _utils.toDecimal,
    size: _utils.toDecimal,
    gasUsed: _utils.toDecimal,
    gasLimit: _utils.toDecimal });

  block.transactions = block.transactions.map(tx => txFormatter(tx));
  return block;
};exports.blockFormatter = blockFormatter;

const uncleFormatter = block => {
  if (block) {
    return blockFormatter(block);
  }

  return block;
};exports.uncleFormatter = uncleFormatter;

const syncFormatter = sync => {
  if (typeof sync === 'object') {
    return format(sync, {
      startingBlock: _utils.toDecimal,
      currentBlock: _utils.toDecimal,
      highestBlock: _utils.toDecimal });

  }
  return sync;
};exports.syncFormatter = syncFormatter;

const txFormatter = tx => {
  return format(tx, addDefaultFields({
    nonce: _utils.toDecimal }));

};exports.txFormatter = txFormatter;

const txReceiptFormatter = receipt => {
  if (receipt && receipt.logs) {
    receipt.logs = receipt.logs.map(log => logFormatter(log));
    return format(receipt, addDefaultFields({
      cumulativeGasUsed: _utils.toDecimal }));

  }
  return receipt;
};exports.txReceiptFormatter = txReceiptFormatter;

const logFormatter = log => {
  return format(log, addDefaultFields({
    logIndex: _utils.toDecimal }));

};exports.logFormatter = logFormatter;

const addTraceIndex = trace => {
  let transactionHash, i;
  for (let itx of trace) {
    if (transactionHash !== itx.transactionHash) {
      i = 1;
      transactionHash = itx.transactionHash;
    }
    itx._index = i;
    i++;
  }
  return trace;
};exports.addTraceIndex = addTraceIndex;