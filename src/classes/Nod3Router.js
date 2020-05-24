import { Nod3Hub } from './Nod3Hub'
import modules from '../modules'

/* const methods = Object.keys(modules).reduce((v, a) => {
  v[a] = Object.keys(modules[a])
  return v
}, {}) */

const getModule = name => {
  if (!modules[name]) throw new Error(`Unknown module: ${name}`)
  return modules[name]
}

export function Nod3Router (providers, options = {}) {
  let routes = {}

  const getRoutes = () => Object.assign({}, routes)

  const resolve = ({ module }) => {
    return routes[module]
  }

  const routeTo = module => {
    let key = resolve({ module })
    if (undefined !== key) {
      return key
    }
  }

  const { hub, nod3 } = Nod3Hub(providers, options, routeTo)

  const add = ({ module, to }) => {
    to = parseInt(to)
    if (isNaN(to) || !hub.getNode(to)) throw new Error(`Invalid key: ${to}`)
    if (getModule(module)) routes[module] = to
  }
  const remove = (item) => {
    delete routes[item]
  }

  const router = Object.freeze({ add, remove, resolve, getRoutes })
  return Object.freeze({ nod3, hub, router })
}