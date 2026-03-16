-- ============================================
-- NocoViz 数据库迁移脚本
-- 版本: v1.1.0
-- 日期: 2026-01-30
-- 说明: 性能优化和索引添加
-- ============================================

-- 使用数据库
USE noco_viz_db;

-- ============================================
-- 1. templates 表优化
-- ============================================

-- 检查并添加索引
-- 注意：如果索引已存在，会报错但不影响其他操作

-- 状态和分类复合索引（优化按状态和分类筛选）
ALTER TABLE templates
  ADD INDEX idx_status_category (status, category);

-- 分类和创建时间复合索引（优化按分类排序）
ALTER TABLE templates
  ADD INDEX idx_category_created (category, created_at);

-- 官方模板和状态复合索引（优化官方模板查询）
ALTER TABLE templates
  ADD INDEX idx_official_status (is_official, status);

-- 检查 thumbnail_media_id 字段是否存在
-- 如果不存在则添加（用于关联媒体表）
SET @col_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'noco_viz_db'
    AND TABLE_NAME = 'templates'
    AND COLUMN_NAME = 'thumbnail_media_id'
);

-- 如果字段不存在，添加字段和外键
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE templates
    ADD COLUMN thumbnail_media_id INT NULL AFTER thumbnail,
    ADD CONSTRAINT fk_template_thumbnail_media
      FOREIGN KEY (thumbnail_media_id) REFERENCES media(id) ON DELETE SET NULL',
  'SELECT "thumbnail_media_id already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 2. audit_logs 表优化
-- ============================================

-- 模块、状态和创建时间复合索引（优化审计日志查询）
ALTER TABLE audit_logs
  ADD INDEX idx_module_status_created (module, status, created_at);

-- 操作类型和创建时间复合索引（优化按操作类型查询）
ALTER TABLE audit_logs
  ADD INDEX idx_action_type_created (action_type, created_at);

-- 用户和创建时间复合索引（优化按用户查询）
ALTER TABLE audit_logs
  ADD INDEX idx_user_created (user_id, created_at);

-- ============================================
-- 3. media 表优化
-- ============================================

-- 类型和创建时间复合索引（优化按类型查询）
ALTER TABLE media
  ADD INDEX idx_type_created (type, created_at);

-- 分类索引（优化按分类查询）
ALTER TABLE media
  ADD INDEX idx_category (category);

-- 用户索引（优化按用户查询）
ALTER TABLE media
  ADD INDEX idx_user (user_id);

-- ============================================
-- 4. 验证索引创建
-- ============================================

-- 查看 templates 表索引
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'templates'
  AND INDEX_NAME IN ('idx_status_category', 'idx_category_created', 'idx_official_status')
GROUP BY TABLE_NAME, INDEX_NAME;

-- 查看 audit_logs 表索引
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'audit_logs'
  AND INDEX_NAME IN ('idx_module_status_created', 'idx_action_type_created', 'idx_user_created')
GROUP BY TABLE_NAME, INDEX_NAME;

-- 查看 media 表索引
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'media'
  AND INDEX_NAME IN ('idx_type_created', 'idx_category', 'idx_user')
GROUP BY TABLE_NAME, INDEX_NAME;

-- ============================================
-- 5. 性能分析建议
-- ============================================

-- 分析表以更新统计信息
ANALYZE TABLE templates;
ANALYZE TABLE audit_logs;
ANALYZE TABLE media;

-- 优化表（可选，在低峰期执行）
-- OPTIMIZE TABLE templates;
-- OPTIMIZE TABLE audit_logs;
-- OPTIMIZE TABLE media;

-- ============================================
-- 迁移完成
-- ============================================

SELECT '数据库迁移完成！' AS message;
SELECT NOW() AS migration_time;
