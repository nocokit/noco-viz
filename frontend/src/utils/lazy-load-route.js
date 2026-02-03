/**
 * 路由懒加载优化工具
 * 提供统一的路由懒加载方法，支持加载状态和错误处理
 */

import { defineAsyncComponent, h } from 'vue'
import RouteLoading from '@/components/common/RouteLoading.vue'

/**
 * 创建懒加载组件
 * @param {Function} loader - 组件加载函数
 * @param {Object} options - 配置选项
 * @returns {Component}
 */
export function lazyLoadComponent(loader, options = {}) {
  const {
    delay = 200,
    timeout = 30000,
    loadingComponent = RouteLoading,
    errorComponent = null,
    onError = null
  } = options

  return defineAsyncComponent({
    loader,
    loadingComponent,
    errorComponent,
    delay,
    timeout,
    onError: (error, retry, fail, attempts) => {
      if (onError) {
        onError(error, retry, fail, attempts)
      } else {
        console.error('组件加载失败:', error)
        if (attempts <= 3) {
          retry()
        } else {
          fail()
        }
      }
    }
  })
}

/**
 * 创建路由懒加载配置
 * @param {Function} importFn - 动态导入函数
 * @returns {Object}
 */
export function lazyLoadRoute(importFn) {
  return {
    component: lazyLoadComponent(importFn),
    meta: {
      keepAlive: false
    }
  }
}

/**
 * 批量创建路由懒加载配置
 * @param {Object} routes - 路由配置对象
 * @returns {Array}
 */
export function lazyLoadRoutes(routes) {
  return Object.entries(routes).map(([path, config]) => ({
    path,
    ...config,
    component: lazyLoadComponent(config.component)
  }))
}

/**
 * 预加载组件
 * @param {Function} loader - 组件加载函数
 */
export function preloadComponent(loader) {
  return loader()
}

/**
 * 预加载多个组件
 * @param {Array<Function>} loaders - 组件加载函数数组
 */
export function preloadComponents(loaders) {
  return Promise.all(loaders.map(loader => loader()))
}

export default {
  lazyLoadComponent,
  lazyLoadRoute,
  lazyLoadRoutes,
  preloadComponent,
  preloadComponents
}
