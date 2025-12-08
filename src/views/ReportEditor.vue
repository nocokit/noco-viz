<template>
  <div class="report-editor">
    <!-- 1. Top Ribbon -->
    <div class="top-bar">
      <div class="file-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        2024年第一季度财务报表.noco
        <span class="file-status">已保存</span>
      </div>
      <div style="font-size:12px; opacity:0.8">NocoViz Enterprise Reporter</div>
      <div class="close-editor" @click="$router.back()">✕</div>
    </div>

    <div class="ribbon-tabs">
      <div class="ribbon-tab active">开始 (Home)</div>
      <div class="ribbon-tab">插入 (Insert)</div>
      <div class="ribbon-tab">页面布局 (Layout)</div>
      <div class="ribbon-tab">公式 (Formulas)</div>
      <div class="ribbon-tab">数据 (Data)</div>
    </div>

    <div class="ribbon-toolbar">
      <div class="tool-group">
        <div class="tool-btn" title="Paste"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" fill="currentColor"/></svg></div>
        <div class="tool-btn" title="Cut"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z" fill="currentColor"/></svg></div>
      </div>
      <div class="tool-group">
        <select class="font-select"><option>Microsoft YaHei</option></select>
        <select class="size-select"><option>11</option></select>
        <div class="tool-btn active"><b>B</b></div>
        <div class="tool-btn"><i>I</i></div>
        <div class="tool-btn"><u>U</u></div>
        <div class="tool-btn" style="border-bottom:3px solid #c00000; color:#c00000">A</div>
        <div class="tool-btn" style="border-bottom:3px solid #ffc000"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" fill="currentColor"/></svg></div>
      </div>
      <div class="tool-group">
        <div class="tool-btn" title="Left"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" fill="currentColor"/></svg></div>
        <div class="tool-btn" title="Center"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" fill="currentColor"/></svg></div>
        <div class="tool-btn" title="Right"><svg class="tool-icon" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" fill="currentColor"/></svg></div>
        <div class="tool-btn" style="width:auto; padding:0 6px; font-size:11px;">
          <svg class="tool-icon" viewBox="0 0 24 24" style="margin-bottom:2px"><path d="M3 9h18v6H3V9zm0-2h18V3H3v4zm0 12h18v-4H3v4z" fill="currentColor"/></svg>
          合并后居中
        </div>
      </div>
      <div class="tool-group" style="border:none">
        <button class="tool-btn" style="width:auto; padding:0 10px; background:#f3f3f3; border:1px solid #ddd; font-size:12px;">
          <span style="color:var(--excel-green); font-weight:bold; margin-right:4px;">▶</span> 预览数据
        </button>
      </div>
    </div>

    <!-- Formula Bar -->
    <div class="formula-bar">
      <div class="name-box">{{ selectedCellRef }}</div>
      <div class="fx-btn">fx</div>
      <input type="text" class="formula-input" v-model="formulaValue">
    </div>

    <!-- 2. Workspace -->
    <div class="workspace">
      
      <!-- Left: Data Source Pane -->
      <div class="sidebar-left">
        <div class="sidebar-header">
          数据源 (DataSets)
          <span style="color:var(--excel-green); cursor:pointer">+</span>
        </div>
        <div class="sidebar-content">
          <div class="ds-tree">
            <div class="ds-node">
              <svg class="ds-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              销售主表 (ds1)
            </div>
            <div class="ds-children">
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'ds1.area')">
                地区 <span class="field-type">Text</span>
              </div>
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'ds1.salesperson')">
                销售员 <span class="field-type">Text</span>
              </div>
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'ds1.amount')">
                销售额 <span class="field-type">Num</span>
              </div>
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'ds1.date')">
                日期 <span class="field-type">Date</span>
              </div>
            </div>
          </div>
          
          <div class="ds-tree">
            <div class="ds-node">
              <svg class="ds-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              参数 (Params)
            </div>
            <div class="ds-children">
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'params.year')">查询年份</div>
              <div class="field-item" draggable="true" @dragstart="handleDragStart($event, 'params.deptId')">部门ID</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: The Grid -->
      <div class="spreadsheet-container">
        <table class="sheet-table">
          <thead>
            <tr>
              <th class="row-header"></th>
              <th class="col-header" style="width:80px">A</th>
              <th class="col-header" style="width:120px">B</th>
              <th class="col-header active" style="width:120px">C</th>
              <th class="col-header" style="width:120px">D</th>
              <th class="col-header" style="width:100px">E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="row-header">1</th>
              <td colspan="4" style="text-align:center; font-size:16px; font-weight:bold; height:40px;" @click="selectCell($event, 'A1', '2024年第一季度部门销售汇总表')">2024年第一季度部门销售汇总表</td>
              <td @click="selectCell($event, 'E1')"></td>
            </tr>
            <tr>
              <th class="row-header">2</th>
              <td style="background:#eef7f2; font-weight:bold; border:1px solid #aaa;" @click="selectCell($event, 'A2', '地区')">地区</td>
              <td style="background:#eef7f2; font-weight:bold; border:1px solid #aaa;" @click="selectCell($event, 'B2', '销售员')">销售员</td>
              <td style="background:#eef7f2; font-weight:bold; border:1px solid #aaa;" @click="selectCell($event, 'C2', '销售额 (元)')">销售额 (元)</td>
              <td style="background:#eef7f2; font-weight:bold; border:1px solid #aaa;" @click="selectCell($event, 'D2', '日期')">日期</td>
              <td @click="selectCell($event, 'E2')"></td>
            </tr>
            <!-- Detail Row -->
            <tr>
              <th class="row-header active">3</th>
              <td style="position:relative;" @click="selectCell($event, 'A3', 'ds1.area')" @drop="handleDrop($event)" @dragover.prevent>
                <div class="expand-icon expand-v"></div> <!-- 纵向扩展 -->
                <span class="data-tag">ds1.area</span>
              </td>
              <td style="position:relative;" @click="selectCell($event, 'B3', 'ds1.salesperson')" @drop="handleDrop($event)" @dragover.prevent>
                <span class="data-tag">ds1.salesperson</span>
              </td>
              <td class="selected" style="position:relative;" @click="selectCell($event, 'C3', 'ds1.amount')" @drop="handleDrop($event)" @dragover.prevent>
                <span class="data-tag">ds1.amount</span>
              </td>
              <td @click="selectCell($event, 'D3', 'ds1.date')" @drop="handleDrop($event)" @dragover.prevent><span class="data-tag">ds1.date</span></td>
              <td @click="selectCell($event, 'E3')" @drop="handleDrop($event)" @dragover.prevent></td>
            </tr>
            <tr>
              <th class="row-header">4</th>
              <td colspan="2" style="text-align:right; font-weight:bold; background:#f9f9f9;" @click="selectCell($event, 'A4', '小计：')">小计：</td>
              <td style="font-weight:bold; background:#f9f9f9;" @click="selectCell($event, 'C4', '=SUM(C3)')">=SUM(C3)</td>
              <td @click="selectCell($event, 'D4')"></td>
              <td @click="selectCell($event, 'E4')"></td>
            </tr>
            <!-- Empty Rows -->
            <tr v-for="i in 6" :key="i">
              <th class="row-header">{{ 4 + i }}</th>
              <td v-for="j in 5" :key="j" @click="selectCell($event, `${String.fromCharCode(64+j)}${4+i}`)" @drop="handleDrop($event)" @dragover.prevent></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right: Properties (Excel Task Pane) -->
      <div class="sidebar-right">
        <div class="sidebar-header">
          单元格格式
        </div>
        <div class="sidebar-content">
          
          <div class="prop-section">
            <div class="prop-title">扩展属性 (Expansion)</div>
            <div class="form-row">
              <span>扩展方向</span>
              <select class="form-select">
                <option>纵向扩展 (↓)</option>
                <option>横向扩展 (→)</option>
                <option>不扩展</option>
              </select>
            </div>
            <div class="form-row">
              <span>左父格</span>
              <select class="form-select">
                <option>默认 (B3)</option>
                <option>无</option>
                <option>自定义</option>
              </select>
            </div>
          </div>

          <div class="prop-section">
            <div class="prop-title">数据格式 (Number)</div>
            <div class="form-row">
              <span>分类</span>
              <select class="form-select">
                <option>常规</option>
                <option>货币</option>
                <option>百分比</option>
              </select>
            </div>
            <div class="form-row">
              <span>小数位数</span>
              <input type="number" class="form-input" value="2">
            </div>
            <div class="form-row">
              <span>千分位</span>
              <input type="checkbox" checked>
            </div>
          </div>

          <div class="prop-section">
            <div class="prop-title">条件格式 (Conditional)</div>
            <div style="font-size:12px; color:#666; margin-bottom:8px">
              当数值小于 0 时，显示红色。
            </div>
            <button class="tool-btn" style="width:100%; border:1px solid #ccc;">管理规则...</button>
          </div>

        </div>
      </div>

    </div>

    <!-- 4. Footer Status Bar -->
    <div class="footer">
      <div class="sheet-tabs">
        <div class="sheet-tab active">Sheet1</div>
        <div class="sheet-tab">Sheet2</div>
        <div class="add-sheet">+</div>
      </div>
      <div class="zoom-ctrl">
        <span>准备就绪</span>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span>-</span>
        <div class="zoom-slider"><div class="zoom-thumb"></div></div>
        <span>+</span>
        <span>100%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedCellRef = ref('C3')
const formulaValue = ref('ds1.amount')

const selectCell = (event, cellRef, value = '') => {
  // Remove 'selected' class from all cells
  const allCells = document.querySelectorAll('.sheet-table td')
  allCells.forEach(cell => cell.classList.remove('selected'))
  
  // Add 'selected' class to clicked cell
  // Note: In a real app we'd use Vue state for class binding, but for this prototype we strictly follow the DOM approach or similar logic
  event.target.closest('td').classList.add('selected')
  
  selectedCellRef.value = cellRef
  formulaValue.value = value
}

const handleDragStart = (event, data) => {
  event.dataTransfer.setData('text', data)
}

const handleDrop = (event) => {
  const data = event.dataTransfer.getData('text')
  const cell = event.target.closest('td')
  if (cell) {
    cell.innerHTML = `<span class="data-tag">${data}</span>`
    cell.style.position = 'relative'
    // Simply re-selecting to update UI
    formulaValue.value = data
    
    // Add expand icon if not exists
    if(!cell.querySelector('.expand-icon')) {
       const arrow = document.createElement('div');
       arrow.className = 'expand-icon expand-v';
       cell.appendChild(arrow);
    }
  }
}
</script>

<style scoped>
/* =========================================
   1. 全局变量 (Excel Theme)
   ========================================= */
.report-editor {
  --excel-green: #107c41;  /* Excel 品牌绿 */
  --excel-bg: #f3f3f3;     /* 界面底色 */
  --border-color: #d4d4d4; /* 边框色 */
  --grid-line: #e1e1e1;    /* 网格线 */
  
  --cell-select: #107c41;  /* 选中框颜色 */
  --header-bg: #f8f9fa;    /* 行列头背景 */
  --header-text: #666;
  
  --text-main: #333;
  --text-muted: #666;
  
  --ribbon-height: 100px;
  --formula-height: 28px;
  --footer-height: 32px;
  --sidebar-width: 260px;

  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  background-color: var(--excel-bg);
  color: var(--text-main);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute; /* Full screen overlay */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100; /* Above layout */
}

* { box-sizing: border-box; outline: none; user-select: none; }

/* 滚动条 */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 0; border: 2px solid #fff; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
::-webkit-scrollbar-track { background: #fff; }

/* =========================================
   2. 顶部 Ribbon 菜单 (Excel 风格)
   ========================================= */
.top-bar {
  background: var(--excel-green); height: 36px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; color: #fff;
}
.file-title { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.file-status { opacity: 0.8; font-size: 12px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px;}
.close-editor { cursor: pointer; padding: 4px 8px; font-size: 14px; }
.close-editor:hover { background: rgba(255,255,255,0.2); border-radius: 4px; }

.ribbon-tabs {
  background: var(--excel-green); padding-left: 10px; display: flex; gap: 0;
}
.ribbon-tab {
  padding: 6px 18px; color: #fff; font-size: 13px; cursor: pointer; border-radius: 4px 4px 0 0; margin-top: 4px; opacity: 0.9;
}
.ribbon-tab:hover { background: rgba(255,255,255,0.1); }
.ribbon-tab.active { background: #fff; color: var(--excel-green); font-weight: 600; opacity: 1; }

.ribbon-toolbar {
  height: 50px; background: #fff; border-bottom: 1px solid var(--border-color); display: flex; padding: 4px 10px; gap: 12px;
}
.tool-group {
  display: flex; gap: 4px; padding-right: 12px; border-right: 1px solid #eee; align-items: center;
}
.tool-btn {
  padding: 4px; border-radius: 3px; cursor: pointer; color: #444; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 28px;
}
.tool-btn:hover { background: #f0f0f0; }
.tool-btn.active { background: #e1e1e1; }
.tool-icon { width: 16px; height: 16px; fill: currentColor; }

.font-select { border: 1px solid #d4d4d4; padding: 2px; font-size: 11px; width: 100px; height: 22px; background: #fff; color: #333; }
.size-select { border: 1px solid #d4d4d4; padding: 2px; font-size: 11px; width: 40px; height: 22px; margin-left: 4px; background: #fff; color: #333; }

/* Formula Bar */
.formula-bar {
  height: var(--formula-height); background: #fff; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; padding: 2px;
}
.name-box {
  width: 80px; height: 100%; border-right: 1px solid var(--border-color); display: flex; align-items: center; padding-left: 10px; font-size: 12px; color: #333;
}
.fx-btn { width: 30px; height: 100%; display: flex; align-items: center; justify-content: center; color: #999; font-style: italic; font-family: serif; font-weight: bold; border-right: 1px solid var(--border-color); cursor: pointer; }
.fx-btn:hover { color: var(--excel-green); }
.formula-input {
  flex: 1; border: none; height: 100%; padding: 0 10px; font-size: 13px; font-family: monospace; outline: none; background: #fff; color: #333;
}

/* =========================================
   3. 主工作区布局
   ========================================= */
.workspace { flex: 1; display: flex; overflow: hidden; background: #fff; }

/* 3.1 左侧数据集 (模拟 Excel 侧边任务窗格) */
.sidebar-left {
  width: var(--sidebar-width); border-right: 1px solid var(--border-color); background: #fdfdfd; display: flex; flex-direction: column;
}
.sidebar-header {
  padding: 10px; font-size: 13px; font-weight: 600; border-bottom: 1px solid var(--border-color); background: #f8f9fa; color: #444; display: flex; justify-content: space-between;
}
.sidebar-content { flex: 1; overflow-y: auto; padding: 10px; }

.ds-tree { margin-bottom: 15px; }
.ds-node {
  display: flex; align-items: center; padding: 6px; cursor: pointer; font-size: 12px; color: #333; border-radius: 2px;
}
.ds-node:hover { background: #f0f0f0; }
.ds-icon { margin-right: 6px; color: #666; width: 14px; height: 14px; }
.ds-children { padding-left: 20px; }

.field-item {
  display: flex; align-items: center; padding: 4px; cursor: grab; font-size: 12px; color: #333;
}
.field-item:hover { background: #e6f3eb; color: var(--excel-green); }
.field-type { font-size: 10px; color: #999; margin-left: auto; font-family: monospace; }

/* 3.2 电子表格区域 (The Grid) */
.spreadsheet-container {
  flex: 1; overflow: auto; position: relative; background: #fff;
}

.sheet-table {
  border-collapse: collapse; table-layout: fixed;
}

/* Headers */
.sheet-table th {
  background: var(--header-bg); border: 1px solid var(--border-color); height: 24px;
  font-weight: normal; color: var(--header-text); font-size: 12px; text-align: center;
  position: relative;
}
.row-header { width: 40px; min-width: 40px; }
.col-header { min-width: 80px; }

/* 选中行列头高亮 */
.sheet-table th.active { background: #d3f0e0; color: var(--excel-green); border-bottom-color: var(--excel-green); }

/* Cells */
.sheet-table td {
  border: 1px solid var(--grid-line); height: 24px; padding: 0 4px; font-size: 12px;
  white-space: nowrap; overflow: hidden; color: #000; cursor: cell;
}

/* 选中单元格效果 */
.sheet-table td.selected {
  outline: 2px solid var(--cell-select); z-index: 10;
}
.sheet-table td.selected::after {
  content: ''; position: absolute; bottom: -5px; right: -5px; width: 6px; height: 6px;
  background: var(--cell-select); border: 1px solid #fff; cursor: crosshair;
}

/* 数据绑定胶囊样式 */
:deep(.data-tag) {
  display: inline-block; background: #e6f4ea; color: #137333; padding: 0 4px; border-radius: 2px;
  font-family: monospace; font-size: 11px;
}

/* 扩展方向指示器 */
:deep(.expand-icon) {
  position: absolute; width: 0; height: 0; border-style: solid;
}
:deep(.expand-v) { /* 纵向扩展 */
  left: 2px; top: 8px; border-width: 4px 0 4px 4px; border-color: transparent transparent transparent #d93025;
}
:deep(.expand-h) { /* 横向扩展 */
  top: 2px; left: 8px; border-width: 4px 4px 0 4px; border-color: #1a73e8 transparent transparent transparent;
}

/* 3.3 右侧属性 (Excel Task Pane 风格) */
.sidebar-right {
  width: 280px; border-left: 1px solid var(--border-color); background: #fdfdfd; display: flex; flex-direction: column;
}
.prop-section { padding: 15px; border-bottom: 1px solid #eee; }
.prop-title { font-size: 12px; font-weight: 700; color: #444; margin-bottom: 10px; }

.form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #333; }
.form-input { border: 1px solid #ccc; width: 120px; padding: 3px; font-size: 12px; background: #fff; color: #333; }
.form-select { border: 1px solid #ccc; width: 120px; padding: 2px; font-size: 12px; background: #fff; color: #333; }

/* =========================================
   4. 底部状态栏
   ========================================= */
.footer {
  height: var(--footer-height); background: var(--excel-green); display: flex; justify-content: space-between; align-items: center; padding-right: 16px;
}
.sheet-tabs { display: flex; align-items: flex-end; height: 100%; padding-left: 10px; gap: 2px; }
.sheet-tab {
  padding: 0 20px; height: 26px; background: rgba(0,0,0,0.1); color: rgba(255,255,255,0.8);
  font-size: 12px; display: flex; align-items: center; cursor: pointer;
  border-radius: 4px 4px 0 0;
}
.sheet-tab.active { background: #fff; color: var(--excel-green); font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.add-sheet { color: #fff; padding: 0 10px; cursor: pointer; font-size: 16px; font-weight: bold; }

.zoom-ctrl { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 12px; }
.zoom-slider { width: 100px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; position: relative; }
.zoom-thumb { width: 10px; height: 10px; background: #fff; border-radius: 50%; position: absolute; left: 60%; top: -3px; cursor: pointer; }
</style>
