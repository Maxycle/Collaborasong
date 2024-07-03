import { createApp, h } from 'vue'
import Tooltip from '@/components/Tooltip.vue'

const TooltipDirective = {
  mounted(el, binding) {
    const app = createApp({
      render() {
        return h(Tooltip, {
          text: binding.value,
          position: binding.arg || 'top'
        })
      }
    })
    const instance = app.mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

		const show = (event) => {
			console.log('show ZE ToolTip', app)

      instance.showTooltip(event)
    }
    const hide = () => {
      instance.hideTooltip()
    }

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)

    el._tooltip = {
      instance,
      show,
      hide
    }
  },
  unmounted(el) {
    const { instance, show, hide } = el._tooltip
    el.removeEventListener('mouseenter', show)
    el.removeEventListener('mouseleave', hide)
    document.body.removeChild(instance.$el)
  }
}

export default TooltipDirective

