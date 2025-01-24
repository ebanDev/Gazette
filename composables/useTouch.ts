import { useEventListener } from '@vueuse/core'

export const useTouch = () => {
  const startY = ref(0)
  const pullDistance = ref(0)
  const isPulling = ref(false)
  const THRESHOLD = 60

  return {
    vTouch: {
      mounted(el: HTMLElement, binding: any) {
        const onTouchStart = (e: TouchEvent) => {
          if (el.scrollTop === 0) {
            startY.value = e.touches[0].clientY
            isPulling.value = true
          }
        }

        const onTouchMove = (e: TouchEvent) => {
          if (!isPulling.value) return

          const currentY = e.touches[0].clientY
          pullDistance.value = Math.max(0, currentY - startY.value)

          if (pullDistance.value > 0) {
            e.preventDefault()
          }
        }

        const onTouchEnd = () => {
          if (pullDistance.value > THRESHOLD) {
            el.dispatchEvent(new CustomEvent('touchpull'))
          }
          isPulling.value = false
          pullDistance.value = 0
        }

        useEventListener(el, 'touchstart', onTouchStart, { passive: true })
        useEventListener(el, 'touchmove', onTouchMove, { passive: false })
        useEventListener(el, 'touchend', onTouchEnd)
      }
    }
  }
}
