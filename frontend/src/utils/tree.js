/**
 * 树形数据处理工具
 * 提供树形数据的常用操作
 */

/**
 * 数组转树形结构
 * @param {Array} list - 扁平数组
 * @param {Object} options - 配置选项
 * @returns {Array} 树形结构数组
 */
export function arrayToTree(list, options = {}) {
  const {
    idKey = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
    rootValue = null
  } = options

  const map = new Map()
  const tree = []

  // 创建映射
  list.forEach(item => {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  })

  // 构建树形结构
  list.forEach(item => {
    const node = map.get(item[idKey])
    const parentId = item[parentKey]

    if (parentId === rootValue || parentId === undefined || parentId === null) {
      // 根节点
      tree.push(node)
    } else {
      // 子节点
      const parent = map.get(parentId)
      if (parent) {
        parent[childrenKey].push(node)
      }
    }
  })

  return tree
}

/**
 * 树形结构转数组
 * @param {Array} tree - 树形结构数组
 * @param {Object} options - 配置选项
 * @returns {Array} 扁平数组
 */
export function treeToArray(tree, options = {}) {
  const {
    childrenKey = 'children',
    removeChildren = true
  } = options

  const result = []

  function traverse(nodes, parent = null) {
    nodes.forEach(node => {
      const item = { ...node }

      if (removeChildren) {
        delete item[childrenKey]
      }

      result.push(item)

      if (node[childrenKey] && node[childrenKey].length > 0) {
        traverse(node[childrenKey], node)
      }
    })
  }

  traverse(tree)
  return result
}

/**
 * 查找树节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 查找条件
 * @param {Object} options - 配置选项
 * @returns {Object|null} 找到的节点
 */
export function findNode(tree, predicate, options = {}) {
  const { childrenKey = 'children' } = options

  for (const node of tree) {
    if (predicate(node)) {
      return node
    }

    if (node[childrenKey] && node[childrenKey].length > 0) {
      const found = findNode(node[childrenKey], predicate, options)
      if (found) {
        return found
      }
    }
  }

  return null
}

/**
 * 查找所有匹配的节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 查找条件
 * @param {Object} options - 配置选项
 * @returns {Array} 找到的节点数组
 */
export function findNodes(tree, predicate, options = {}) {
  const { childrenKey = 'children' } = options
  const result = []

  function traverse(nodes) {
    nodes.forEach(node => {
      if (predicate(node)) {
        result.push(node)
      }

      if (node[childrenKey] && node[childrenKey].length > 0) {
        traverse(node[childrenKey])
      }
    })
  }

  traverse(tree)
  return result
}

/**
 * 查找节点路径
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 查找条件
 * @param {Object} options - 配置选项
 * @returns {Array|null} 节点路径数组
 */
export function findPath(tree, predicate, options = {}) {
  const { childrenKey = 'children' } = options

  function traverse(nodes, path = []) {
    for (const node of nodes) {
      const currentPath = [...path, node]

      if (predicate(node)) {
        return currentPath
      }

      if (node[childrenKey] && node[childrenKey].length > 0) {
        const found = traverse(node[childrenKey], currentPath)
        if (found) {
          return found
        }
      }
    }

    return null
  }

  return traverse(tree)
}

/**
 * 遍历树
 * @param {Array} tree - 树形结构数组
 * @param {Function} callback - 回调函数
 * @param {Object} options - 配置选项
 */
export function traverseTree(tree, callback, options = {}) {
  const { childrenKey = 'children' } = options

  function traverse(nodes, parent = null, level = 0) {
    nodes.forEach((node, index) => {
      callback(node, parent, level, index)

      if (node[childrenKey] && node[childrenKey].length > 0) {
        traverse(node[childrenKey], node, level + 1)
      }
    })
  }

  traverse(tree)
}

/**
 * 过滤树节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 过滤条件
 * @param {Object} options - 配置选项
 * @returns {Array} 过滤后的树
 */
export function filterTree(tree, predicate, options = {}) {
  const { childrenKey = 'children' } = options

  function filter(nodes) {
    return nodes.reduce((acc, node) => {
      const newNode = { ...node }

      if (newNode[childrenKey] && newNode[childrenKey].length > 0) {
        newNode[childrenKey] = filter(newNode[childrenKey])
      }

      // 如果节点匹配或有匹配的子节点，则保留
      if (predicate(node) || (newNode[childrenKey] && newNode[childrenKey].length > 0)) {
        acc.push(newNode)
      }

      return acc
    }, [])
  }

  return filter(tree)
}

/**
 * 映射树节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} mapper - 映射函数
 * @param {Object} options - 配置选项
 * @returns {Array} 映射后的树
 */
export function mapTree(tree, mapper, options = {}) {
  const { childrenKey = 'children' } = options

  function map(nodes) {
    return nodes.map(node => {
      const newNode = mapper(node)

      if (node[childrenKey] && node[childrenKey].length > 0) {
        newNode[childrenKey] = map(node[childrenKey])
      }

      return newNode
    })
  }

  return map(tree)
}

/**
 * 获取树的最大深度
 * @param {Array} tree - 树形结构数组
 * @param {Object} options - 配置选项
 * @returns {number} 最大深度
 */
export function getTreeDepth(tree, options = {}) {
  const { childrenKey = 'children' } = options

  function getDepth(nodes, level = 1) {
    if (!nodes || nodes.length === 0) {
      return level - 1
    }

    let maxDepth = level

    nodes.forEach(node => {
      if (node[childrenKey] && node[childrenKey].length > 0) {
        const depth = getDepth(node[childrenKey], level + 1)
        maxDepth = Math.max(maxDepth, depth)
      }
    })

    return maxDepth
  }

  return getDepth(tree)
}

/**
 * 获取节点的所有父节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} predicate - 查找条件
 * @param {Object} options - 配置选项
 * @returns {Array} 父节点数组
 */
export function getParents(tree, predicate, options = {}) {
  const path = findPath(tree, predicate, options)
  return path ? path.slice(0, -1) : []
}

/**
 * 获取节点的所有子节点
 * @param {Object} node - 节点
 * @param {Object} options - 配置选项
 * @returns {Array} 子节点数组
 */
export function getChildren(node, options = {}) {
  const { childrenKey = 'children', deep = false } = options

  if (!node[childrenKey] || node[childrenKey].length === 0) {
    return []
  }

  if (!deep) {
    return node[childrenKey]
  }

  // 深度获取所有子节点
  const result = []

  function traverse(nodes) {
    nodes.forEach(n => {
      result.push(n)
      if (n[childrenKey] && n[childrenKey].length > 0) {
        traverse(n[childrenKey])
      }
    })
  }

  traverse(node[childrenKey])
  return result
}

/**
 * 排序树节点
 * @param {Array} tree - 树形结构数组
 * @param {Function} compareFn - 比较函数
 * @param {Object} options - 配置选项
 * @returns {Array} 排序后的树
 */
export function sortTree(tree, compareFn, options = {}) {
  const { childrenKey = 'children' } = options

  function sort(nodes) {
    const sorted = [...nodes].sort(compareFn)

    return sorted.map(node => {
      const newNode = { ...node }

      if (newNode[childrenKey] && newNode[childrenKey].length > 0) {
        newNode[childrenKey] = sort(newNode[childrenKey])
      }

      return newNode
    })
  }

  return sort(tree)
}

/**
 * 默认导出
 */
export default {
  arrayToTree,
  treeToArray,
  findNode,
  findNodes,
  findPath,
  traverseTree,
  filterTree,
  mapTree,
  getTreeDepth,
  getParents,
  getChildren,
  sortTree
}
