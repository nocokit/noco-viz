<!--
  装饰组件测试页面
  用于快速预览所有装饰组件效果
-->
<template>
  <div class="decoration-test">
    <header class="test-header">
      <h1>🎨 装饰组件测试预览</h1>
      <p>科技风格装饰组件展示</p>
    </header>

    <main class="test-content">
      <!-- 边框组件 -->
      <section class="test-section">
        <h2>边框组件 (Borders)</h2>
        <div class="component-grid">
          <!-- Border 01 -->
          <div class="component-card">
            <h3>Border 01 - 四角切角</h3>
            <div class="component-preview">
              <Border01 :config="{ width: 350, height: 200, color: '#00f2f2' }">
                <div class="demo-content">
                  <p>四角切角边框</p>
                  <p class="small">带动画光点效果</p>
                </div>
              </Border01>
            </div>
          </div>

          <!-- Border 02 -->
          <div class="component-card">
            <h3>Border 02 - 双层边框</h3>
            <div class="component-preview">
              <Border02 :config="{ width: 350, height: 200, color: '#0099cc' }">
                <div class="demo-content">
                  <p>双层边框</p>
                  <p class="small">中间装饰点</p>
                </div>
              </Border02>
            </div>
          </div>

          <!-- Border 03 -->
          <div class="component-card">
            <h3>Border 03 - 断线边框</h3>
            <div class="component-preview">
              <Border03 :config="{ width: 350, height: 200, color: '#ffaa00' }">
                <div class="demo-content">
                  <p>断线边框</p>
                  <p class="small">四角强调</p>
                </div>
              </Border03>
            </div>
          </div>

          <!-- Border 04 -->
          <div class="component-card">
            <h3>Border 04 - 流光边框</h3>
            <div class="component-preview">
              <Border04 :config="{ width: 350, height: 200, color: '#66ffff' }">
                <div class="demo-content">
                  <p>流光边框</p>
                  <p class="small">动态渐变效果</p>
                </div>
              </Border04>
            </div>
          </div>
        </div>
      </section>

      <!-- 装饰元素 -->
      <section class="test-section">
        <h2>装饰元素 (Decorations)</h2>
        <div class="component-grid">
          <!-- Decoration 01 -->
          <div class="component-card">
            <h3>Decoration 01 - 中心扩散</h3>
            <div class="component-preview centered">
              <Decoration01 :config="{ width: 250, height: 80, color: '#00f2f2' }" />
            </div>
          </div>

          <!-- Decoration 02 -->
          <div class="component-card">
            <h3>Decoration 02 - 对角装饰块</h3>
            <div class="component-preview centered">
              <Decoration02 :config="{ width: 180, height: 180, color: '#ffaa00' }" />
            </div>
          </div>

          <!-- Decoration 03 -->
          <div class="component-card">
            <h3>Decoration 03 - 箭头分隔线</h3>
            <div class="component-preview centered">
              <Decoration03 :config="{ width: 350, height: 100, color: '#0099cc' }" />
            </div>
          </div>
        </div>
      </section>

      <!-- 容器背景 -->
      <section class="test-section">
        <h2>容器背景 (BgBox)</h2>
        <div class="component-grid full-width">
          <div class="component-card large">
            <h3>BgBox - 网格科技背景</h3>
            <div class="component-preview">
              <BgBox :config="{
                width: 800,
                height: 400,
                bgColor: '#001529',
                borderColor: '#00f2f2',
                gridColor: '#0099cc',
                gridSize: 20
              }">
                <div class="demo-content">
                  <h2 style="color: #00f2f2; margin-bottom: 16px;">数据展示容器</h2>
                  <p>网格背景 + 粒子动画 + 扫描线效果</p>
                  <p class="small" style="margin-top: 12px;">适合放置图表和数据内容</p>
                </div>
              </BgBox>
            </div>
          </div>
        </div>
      </section>

      <!-- 组合使用示例 -->
      <section class="test-section">
        <h2>组合使用示例</h2>
        <div class="component-grid full-width">
          <div class="component-card large">
            <h3>Border + BgBox 组合</h3>
            <div class="component-preview">
              <Border04 :config="{ width: 800, height: 450, color: '#00f2f2' }">
                <BgBox :config="{
                  width: 760,
                  height: 410,
                  bgColor: '#001529',
                  borderColor: '#0099cc',
                  gridSize: 15
                }">
                  <div style="text-align: center; padding: 40px;">
                    <Decoration01 :config="{ width: 200, height: 60, color: '#00f2f2' }" />
                    <h2 style="color: #00f2f2; margin: 20px 0;">科技风格数据大屏</h2>
                    <p style="color: #8899aa;">边框 + 背景 + 装饰的完美组合</p>
                    <div style="margin-top: 30px;">
                      <Decoration03 :config="{ width: 400, height: 80, color: '#0099cc' }" />
                    </div>
                  </div>
                </BgBox>
              </Border04>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import {
  Border01,
  Border02,
  Border03,
  Border04,
  Decoration01,
  Decoration02,
  Decoration03,
  BgBox
} from '@/components/charts/decoration'
</script>

<style scoped>
.decoration-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1929 0%, #001529 100%);
  padding: 40px 20px;
}

.test-header {
  text-align: center;
  margin-bottom: 60px;
  color: #fff;
}

.test-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #00f2f2 0%, #0099cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.test-header p {
  font-size: 16px;
  color: #8899aa;
}

.test-content {
  max-width: 1400px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 80px;
}

.test-section h2 {
  font-size: 28px;
  color: #00f2f2;
  margin-bottom: 30px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 242, 242, 0.2);
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 30px;
}

.component-grid.full-width {
  grid-template-columns: 1fr;
}

.component-card {
  background: rgba(10, 25, 41, 0.5);
  border: 1px solid rgba(0, 242, 242, 0.2);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
}

.component-card:hover {
  border-color: rgba(0, 242, 242, 0.5);
  box-shadow: 0 4px 20px rgba(0, 242, 242, 0.15);
}

.component-card.large {
  padding: 32px;
}

.component-card h3 {
  color: #bcd0e3;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
}

.component-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px;
}

.component-preview.centered {
  padding: 40px;
}

.demo-content {
  text-align: center;
  color: #bcd0e3;
  padding: 20px;
}

.demo-content p {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.demo-content .small {
  font-size: 13px;
  color: #8899aa;
  font-weight: 400;
}
</style>
