-- 优化数据库索引
-- 执行时间: 2026-01-30

-- 1. 审计日志表索引优化
ALTER TABLE `audit_logs`
  ADD INDEX `idx_created_at` (`created_at` DESC),
  ADD INDEX `idx_user_action` (`user_id`, `action`),
  ADD INDEX `idx_module_action` (`module`, `action`);

-- 2. 数据源表索引优化
ALTER TABLE `datasources`
  ADD INDEX `idx_status_type` (`status`, `type`),
  ADD INDEX `idx_last_test` (`last_test_at` DESC);

-- 3. 项目表索引优化
ALTER TABLE `projects`
  ADD INDEX `idx_status_created` (`status`, `created_at` DESC),
  ADD INDEX `idx_type_status` (`type`, `status`);

-- 4. 数据集表索引优化
ALTER TABLE `datasets`
  ADD INDEX `idx_status_created` (`status`, `created_at` DESC),
  ADD INDEX `idx_type_status` (`type`, `status`);

-- 5. 用户表索引优化
ALTER TABLE `users`
  ADD INDEX `idx_active_created` (`is_active`, `created_at` DESC);

-- 6. 媒体表索引优化
ALTER TABLE `media`
  ADD INDEX `idx_type_created` (`type`, `created_at` DESC),
  ADD INDEX `idx_user_type` (`user_id`, `type`),
  ADD INDEX `idx_category` (`category`);

-- 7. 模板表索引优化
ALTER TABLE `templates`
  ADD INDEX `idx_status_created` (`status`, `created_at` DESC),
  ADD INDEX `idx_category_status` (`category`, `status`),
  ADD INDEX `idx_official` (`is_official`, `status`);

-- 8. 轮播表索引优化
ALTER TABLE `playlists`
  ADD INDEX `idx_status_created` (`status`, `created_at` DESC);

-- 查看索引使用情况
SELECT
  TABLE_NAME,
  INDEX_NAME,
  SEQ_IN_INDEX,
  COLUMN_NAME,
  CARDINALITY
FROM
  information_schema.STATISTICS
WHERE
  TABLE_SCHEMA = 'noco_viz_db'
  AND TABLE_NAME IN ('audit_logs', 'datasources', 'projects', 'datasets', 'users', 'media', 'templates', 'playlists')
ORDER BY
  TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
