<template>
  <div class="number-flip-component" :style="cssVars">
    <div class="nf-label">{{ label }}</div>
    <div class="nf-digits">
      <span
        v-for="(char, i) in digitChars"
        :key="i"
        :class="['nf-char', isDigit(char) ? 'nf-digit' : 'nf-sep']"
      >{{ char }}</span>
    </div>
    <div class="nf-unit">{{ unit }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { generateCSSVars } from '../utils/fontSizeAdapter'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const numberValue = computed(() => props.data?.value ?? props.config.value ?? 12345)
const label = computed(() => props.data?.label || props.config.label || '实时数据')
const unit = computed(() => props.data?.unit || props.config.unit || '')

const formattedNumber = computed(() => numberValue.value.toLocaleString())
const digitChars = computed(() => formattedNumber.value.split(''))
const isDigit = (c) => /\d/.test(c)

const cssVars = computed(() => generateCSSVars(props.config?.fontSize || 14))
</script>

<style scoped>
.number-flip-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: rgba(0, 15, 30, 0.6);
  border: 1px solid rgba(0, 242, 242, 0.15);
  border-top: 2px solid rgba(0, 242, 242, 0.5);
  position: relative;
  overflow: hidden;
}

.number-flip-component::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(0, 242, 242, 0.04) 0%, transparent 100%);
  pointer-events: none;
}

.nf-label {
  font-size: var(--label-font-size, 12px);
  color: rgba(0, 242, 242, 0.6);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.nf-digits {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nf-char {
  font-family: 'Courier New', 'DIN Alternate', monospace;
  font-weight: 700;
  line-height: 1;
}

.nf-digit {
  font-size: var(--value-font-size, 36px);
  color: #00f2f2;
  text-shadow: 0 0 16px rgba(0, 242, 242, 0.7), 0 0 4px rgba(0, 242, 242, 0.9);
  background: rgba(0, 242, 242, 0.06);
  border: 1px solid rgba(0, 242, 242, 0.2);
  border-radius: 3px;
  padding: 2px 5px;
  min-width: calc(var(--value-font-size, 36px) * 0.78);
  text-align: center;
}

.nf-sep {
  font-size: calc(var(--value-font-size, 36px) * 0.78);
  color: rgba(0, 242, 242, 0.4);
  padding: 0 1px;
}

.nf-unit {
  font-size: var(--unit-font-size, 11px);
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  min-height: 14px;
}
</style>
