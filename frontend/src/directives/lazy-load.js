/**
 * 图片懒加载指令
 * 使用 IntersectionObserver API 实现高性能懒加载
 */

const lazyLoadObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src

        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)

          img.onload = () => {
            img.classList.add('loaded')
          }

          img.onerror = () => {
            img.classList.add('error')
            img.src = '/placeholder-error.png'
          }
        }
      }
    })
  },
  {
    rootMargin: '50px',
    threshold: 0.01
  }
)

export default {
  mounted(el, binding) {
    if (binding.value) {
      el.dataset.src = binding.value
      el.src = '/placeholder.png'
      el.classList.add('lazy-image')
      lazyLoadObserver.observe(el)
    }
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.dataset.src = binding.value
      lazyLoadObserver.observe(el)
    }
  },

  unmounted(el) {
    lazyLoadObserver.unobserve(el)
  }
}
