import { toDecimal } from './utils'

export const formatKey = (obj, key, formatter) => {
  if (!obj) return obj
  let value = obj[key]
  if (undefined !== value) {
    obj[key] = formatter(value)
  }
  return obj
}

export const format = (obj, formats) => {
  for (let key in formats) {
    obj = formatKey(obj, key, formats[key])
  }
  return obj
}

const addDefaultFields = (fields) => {
  let def = {
    transactionIndex: toDecimal,
    blockNumber: toDecimal,
    timestamp: toDecimal,
    gas: toDecimal,
    gasUsed: toDecimal
  }
  return Object.assign(def, fields)
}

export const blockFormatter = block => {
  block = format(block, {
    number: toDecimal,
    timestamp: toDecimal,
    size: toDecimal,
    gasUsed: toDecimal,
    gasLimit: toDecimal
  })
  block.transactions = block.transactions.map(tx => txFormatter(tx))
  return block
}

export const uncleFormatter = block => {
  if (block) {
    return blockFormatter(block)
  }

  return block
}

export const syncFormatter = sync => {
  if (typeof sync === 'object') {
    return format(sync, {
      startingBlock: toDecimal,
      currentBlock: toDecimal,
      highestBlock: toDecimal
    })
  }
  return sync
}

export const txFormatter = tx => {
  return format(tx, addDefaultFields({
    nonce: toDecimal
  }))
}

export const txReceiptFormatter = receipt => {
  if (receipt && receipt.logs) {
    receipt.logs = receipt.logs.map(log => logFormatter(log))
    return format(receipt, addDefaultFields({
      cumulativeGasUsed: toDecimal
    }))
  }
  return receipt
}

export const logFormatter = log => {
  return format(log, addDefaultFields({
    logIndex: toDecimal
  }))
}

export const addTraceIndex = trace => {
  let transactionHash, i
  for (let itx of trace) {
    if (transactionHash !== itx.transactionHash) {
      i = 1
      transactionHash = itx.transactionHash
    }
    itx._index = i
    i++
  }
  return trace
}
