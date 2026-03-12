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

