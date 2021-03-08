"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _formatters = require("../lib/formatters");







var _utils = require("../lib/utils");var _default =

{
  getBlock(hashOrNumber, txs = false) {
    let method = 'eth_getBlockByNumber';
    let hOn = (0, _utils.isHashOrNumber)(hashOrNumber);

    if (hOn.hash) method = 'eth_getBlockByHash';else
    hashOrNumber = hOn.number !== null ? hOn.number : hashOrNumber;

    let params = [hashOrNumber, txs];
    return { method, params, formatters: [_formatters.blockFormatter] };
  },

  getUncle(number, index) {
    const method = 'eth_getUncleByBlockNumberAndIndex';
    const hexNumber = (0, _utils.toHexStr)(number);
    const hexIndex = (0, _utils.toHexStr)(index);
    const params = [hexNumber, hexIndex];
    return { method, params, formatters: [_formatters.uncleFormatter] };
  },

  getTransactionByIndex(hashOrNumber, index) {
    let hOn = (0, _utils.isHashOrNumber)(hashOrNumber);
    let params = hOn.hash ? [hOn.hash] : [hOn.number];
    let method = hOn.hash ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
    index = (0, _utils.toHexStr)(index);
    params.push(index);
    return { method, params, formatters: [_formatters.txFormatter] };
  },

  getTransactionByHash(hash) {
    let params = [hash];
    let method = 'eth_getTransactionByHash';
    return { method, params, formatters: [_formatters.txFormatter] };
  },

  getTransactionReceipt(hash) {
    let method = 'eth_getTransactionReceipt';
    let params = [hash];
    return { method, params, formatters: [_formatters.txReceiptFormatter] };
  },

  getTransactionCount(address, block = 'latest') {
    block = parseBlockArg(block);
    return { method: 'eth_getTransactionCount', params: [address, block] };
  },

  getBalance(address, block = 'latest') {
    block = parseBlockArg(block);
    return { method: 'eth_getBalance', params: [address, block] };
  },

  getCode(address, block = 'latest') {
    block = parseBlockArg(block);
    return { method: 'eth_getCode', params: [address, block] };
  },

  syncing() {
    return { method: 'eth_syncing', formatters: [_formatters.syncFormatter] };
  },

  blockNumber() {
    return { method: 'eth_blockNumber', formatters: [_utils.toDecimal] };
  },

  sendRawTransaction(txData) {
    return { method: 'eth_sendRawTransaction', params: [txData] };
  },

  netHashrate() {
    return { method: 'eth_netHashrate', formatters: [_utils.toDecimal] };
  },

  call(callObj, block = 'latest') {
    block = parseBlockArg(block);
    return { method: 'eth_call', params: [callObj, block] };
  },

  chainId() {
    return { method: 'eth_chainId', formatters: [_utils.toDecimal] };
  } };exports.default = _default;



function parseBlockArg(block) {
  let hOn = (0, _utils.isHashOrNumber)(block);
  if (hOn.hash) block = hOn.hash;
  if (hOn.number) block = hOn.number;
  return block;
}