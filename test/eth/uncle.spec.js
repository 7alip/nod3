import { validateBlock } from './block.shared'
import { fakeNod3 } from '../fakes'
import { expect } from 'chai'

describe('# Uncle Block format', fakeNod3((nod3) => {
  it('should be a valid uncle block', async () => {
    const block = await nod3.eth.getUncle(2821782)
    if (block) {
      validateBlock(block)
    }
  })

  it('should not exist', async () => {
    const block = await nod3.eth.getUncle(2590713)
    expect(block).to.be.equal(null)
  })
}))
