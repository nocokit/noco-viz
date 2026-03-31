-- 创建数据源表
CREATE TABLE IF NOT EXISTS `datasources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT '数据源名称',
  `type` enum('mysql','postgresql','mongodb','redis','restapi','graphql') NOT NULL COMMENT '数据源类型',
  `description` text COMMENT '描述',
  `config` json NOT NULL COMMENT '连接配置',
  `status` enum('active','inactive','error') DEFAULT 'inactive' COMMENT '状态',
  `last_test_at` timestamp NULL COMMENT '最后测试时间',
  `last_test_result` text COMMENT '最后测试结果',
  `created_by_id` int NOT NULL COMMENT '创建人ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by_id` (`created_by_id`),
  CONSTRAINT `fk_datasources_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据源连接表';
