-- 安全添加索引（如果不存在）
-- 执行时间: 2026-01-30

-- 检查并添加审计日志索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'audit_logs' AND index_name = 'idx_user_action');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `audit_logs` ADD INDEX `idx_user_action` (`user_id`, `action`)', 'SELECT "Index idx_user_action already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'audit_logs' AND index_name = 'idx_module_action');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `audit_logs` ADD INDEX `idx_module_action` (`module`, `action`)', 'SELECT "Index idx_module_action already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加数据源索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'datasources' AND index_name = 'idx_status_type');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `datasources` ADD INDEX `idx_status_type` (`status`, `type`)', 'SELECT "Index idx_status_type already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'datasources' AND index_name = 'idx_last_test');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `datasources` ADD INDEX `idx_last_test` (`last_test_at` DESC)', 'SELECT "Index idx_last_test already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加项目索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'projects' AND index_name = 'idx_status_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `projects` ADD INDEX `idx_status_created` (`status`, `created_at` DESC)', 'SELECT "Index idx_status_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'projects' AND index_name = 'idx_type_status');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `projects` ADD INDEX `idx_type_status` (`type`, `status`)', 'SELECT "Index idx_type_status already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加数据集索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'datasets' AND index_name = 'idx_status_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `datasets` ADD INDEX `idx_status_created` (`status`, `created_at` DESC)', 'SELECT "Index idx_status_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'datasets' AND index_name = 'idx_type_status');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `datasets` ADD INDEX `idx_type_status` (`type`, `status`)', 'SELECT "Index idx_type_status already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加用户索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'users' AND index_name = 'idx_active_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `users` ADD INDEX `idx_active_created` (`is_active`, `created_at` DESC)', 'SELECT "Index idx_active_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加媒体索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'media' AND index_name = 'idx_type_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `media` ADD INDEX `idx_type_created` (`type`, `created_at` DESC)', 'SELECT "Index idx_type_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'media' AND index_name = 'idx_user_type');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `media` ADD INDEX `idx_user_type` (`user_id`, `type`)', 'SELECT "Index idx_user_type already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加模板索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'templates' AND index_name = 'idx_status_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `templates` ADD INDEX `idx_status_created` (`status`, `created_at` DESC)', 'SELECT "Index idx_status_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'templates' AND index_name = 'idx_category_status');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `templates` ADD INDEX `idx_category_status` (`category`, `status`)', 'SELECT "Index idx_category_status already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'templates' AND index_name = 'idx_official');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `templates` ADD INDEX `idx_official` (`is_official`, `status`)', 'SELECT "Index idx_official already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- 检查并添加轮播索引
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'noco_viz_db' AND table_name = 'playlists' AND index_name = 'idx_status_created');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `playlists` ADD INDEX `idx_status_created` (`status`, `created_at` DESC)', 'SELECT "Index idx_status_created already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

SELECT 'Index optimization completed!' AS status;
