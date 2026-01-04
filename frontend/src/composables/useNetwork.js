/**
 * useNetwork - 网络状态 Composable
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useNetwork() {
  const online = ref(navigator.onLine)
  const offlineAt = ref(null)
  const downlink = ref(null)
  const downlinkMax = ref(null)
  const effectiveType = ref(null)
  const rtt = ref(null)
  const saveData = ref(false)
  const type = ref(null)

  const updateNetworkInfo = () => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (connection) {
      downlink.value = connection.downlink
      downlinkMax.value = connection.downlinkMax
      effectiveType.value = connection.effectiveType
      rtt.value = connection.rtt
      saveData.value = connection.saveData
      type.value = connection.type
    }
  }

  const handleOnline = () => {
    online.value = true
    offlineAt.value = null
    updateNetworkInfo()
  }

  const handleOffline = () => {
    online.value = false
    offlineAt.value = Date.now()
  }

  const handleConnectionChange = () => {
    updateNetworkInfo()
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    updateNetworkInfo()
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (connection) {
      connection.removeEventListener('change', handleConnectionChange)
    }
  })

  return {
    online,
    offlineAt,
    downlink,
    downlinkMax,
    effectiveType,
    rtt,
    saveData,
    type
  }
}
