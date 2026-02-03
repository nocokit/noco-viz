-- ============================================
-- Noco Space 数据库回滚脚本
-- 版本: v1.1.0
-- 日期: 2026-01-30
-- 说明: 回滚 migration.sql 中的所有变更
-- ============================================

-- 使用数据库
USE noco_viz_db;

-- ============================================
-- 1. 删除 templates 表索引
-- ============================================

ALTER TABLE templates DROP INDEX IF EXISTS idx_status_category;
ALTER TABLE templates DROP INDEX IF EXISTS idx_category_created;
ALTER TABLE templates DROP INDEX IF EXISTS idx_official_status;

-- 删除外键和字段（如果是新添加的）
-- 注意：如果 thumbnail_media_id 是原有字段，请不要执行以下语句
-- ALTER TABLE templates DROP FOREIGN KEY IF EXISTS fk_template_thumbnail_media;
-- ALTER TABLE templates DROP COLUMN IF EXISTS thumbnail_media_id;

-- ============================================
-- 2. 删除 audit_logs 表索引
-- ============================================

ALTER TABLE audit_logs DROP INDEX IF EXISTS idx_module_status_created;
ALTER TABLE audit_logs DROP INDEX IF EXISTS idx_action_type_created;
ALTER TABLE audit_logs DROP INDEX IF EXISTS idx_user_created;

-- ============================================
-- 3. 删除 media 表索引
-- ============================================

ALTER TABLE media DROP INDEX IF EXISTS idx_type_created;
ALTER TABLE media DROP INDEX IF EXISTS idx_category;
ALTER TABLE media DROP INDEX IF EXISTS idx_user;

-- ============================================
-- 4. 验证回滚
-- ============================================

-- 查看 templates 表索引（应该不包含已删除的索引）
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'templates'
GROUP BY TABLE_NAME, INDEX_NAME;

-- 查看 audit_logs 表索引
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'audit_logs'
GROUP BY TABLE_NAME, INDEX_NAME;

-- 查看 media 表索引
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME = 'media'
GROUP BY TABLE_NAME, INDEX_NAME;

-- ============================================
-- 回滚完成
-- ============================================

SELECT '数据库回滚完成！' AS message;
SELECT NOW() AS rollback_time;
