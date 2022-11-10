-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.33 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for project-task-mngr_db
CREATE DATABASE IF NOT EXISTS `project-task-mngr_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `project-task-mngr_db`;

-- Dumping structure for table project-task-mngr_db.reminders
CREATE TABLE IF NOT EXISTS `reminders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) NOT NULL DEFAULT '0',
  `start` datetime NOT NULL,
  `repeat_interval` varchar(50) DEFAULT NULL,
  `repeat_until` varchar(50) DEFAULT NULL,
  `send_email` text,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`task_id`),
  KEY `start` (`start`),
  CONSTRAINT `FK3_task_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.reminders: ~0 rows (approximately)
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` (`id`, `task_id`, `start`, `repeat_interval`, `repeat_until`, `send_email`, `created`) VALUES
	(1, 1, '2021-10-25 08:00:00', NULL, NULL, NULL, '2021-10-26 16:37:34');
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.rrule
CREATE TABLE IF NOT EXISTS `rrule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) NOT NULL DEFAULT '0',
  `rrule_task` varchar(255) DEFAULT '0',
  `rrule_reminder` varchar(255) DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK7_task_id` (`task_id`),
  CONSTRAINT `FK7_task_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.rrule: ~0 rows (approximately)
/*!40000 ALTER TABLE `rrule` DISABLE KEYS */;
/*!40000 ALTER TABLE `rrule` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.rrule_exceptions
CREATE TABLE IF NOT EXISTS `rrule_exceptions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rrule_id` bigint(20) NOT NULL DEFAULT '0',
  `rrule_exc_task` varchar(255) NOT NULL DEFAULT '0',
  `rrule_exc_reminder` varchar(255) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK8_rrule_id` (`rrule_id`),
  CONSTRAINT `FK8_rrule_id` FOREIGN KEY (`rrule_id`) REFERENCES `rrule` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.rrule_exceptions: ~0 rows (approximately)
/*!40000 ALTER TABLE `rrule_exceptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `rrule_exceptions` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.spaces
CREATE TABLE IF NOT EXISTS `spaces` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `parent_id` int(10) NOT NULL DEFAULT '0',
  `menu_order` int(10) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE NAME` (`name`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.spaces: ~19 rows (approximately)
/*!40000 ALTER TABLE `spaces` DISABLE KEYS */;
INSERT INTO `spaces` (`id`, `name`, `parent_id`, `menu_order`, `icon`, `created`, `updated`) VALUES
	(1, 'Audits', 0, 1, 'fab fa-adn', '2021-06-30 14:26:08', '2021-06-30 14:26:36'),
	(2, 'LPA', 1, 1, '', '2021-06-30 14:27:12', '2021-06-30 14:27:14'),
	(3, 'PQA', 1, 3, '', '2021-06-30 14:27:35', '2021-06-30 14:27:35'),
	(4, 'Internal audit', 1, 4, '', '2021-06-30 14:28:02', '2021-06-30 14:28:03'),
	(5, 'PA', 1, 2, '', '2021-06-30 14:28:38', '2021-06-30 14:28:39'),
	(6, 'Calibration', 0, 2, 'fas fa-ruler-vertical', '2021-06-30 14:29:39', '2021-06-30 14:29:40'),
	(7, 'Requalification', 0, 3, 'bx bx-label', '2021-06-30 14:30:04', '2021-06-30 14:30:05'),
	(8, 'Training', 0, 4, 'fas fa-users-cog', '2021-06-30 14:30:37', '2021-06-30 14:30:38'),
	(9, 'Simulations', 0, 5, 'fab fa-stripe-s', '2021-06-30 14:30:56', '2021-06-30 14:30:56'),
	(10, 'Logistic', 4, 1, '', '2021-10-20 15:18:26', '2021-10-20 15:18:27'),
	(11, 'Quality', 4, 2, '', '2021-10-20 15:18:46', '2021-10-20 15:18:47'),
	(12, 'Production', 4, 3, '', '2021-11-23 14:24:06', '2021-11-23 14:24:06'),
	(13, 'Management', 4, 4, '', '2021-11-23 14:34:59', '2021-11-23 14:34:59'),
	(14, 'Maitenance', 4, 5, '', '2021-11-23 14:37:16', '2021-11-23 14:37:16'),
	(15, 'Arrival control', 11, 1, '', '2021-11-23 14:37:59', '2021-11-23 14:37:59'),
	(16, 'Certification', 0, 6, 'far fa-address-card', '2021-12-03 09:09:32', '2021-12-03 09:09:32'),
	(17, 'IT', 4, 6, '', '2021-12-03 09:10:02', '2021-12-03 09:10:02'),
	(18, 'Engeniring', 4, 7, '', '2021-12-03 13:25:28', '2021-12-03 13:25:28'),
	(19, 'CEMAS', 16, 1, '', '2021-12-03 14:47:47', '2021-12-03 14:47:47');
/*!40000 ALTER TABLE `spaces` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `space_id` int(10) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  `all_day` int(1) NOT NULL DEFAULT '0',
  `priority` int(1) NOT NULL DEFAULT '0',
  `track_working_h` int(1) NOT NULL DEFAULT '0',
  `recurring` int(1) NOT NULL DEFAULT '0',
  `reminder` int(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timezone` varchar(32) DEFAULT NULL,
  `parent_task_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `space_id` (`space_id`),
  KEY `title` (`title`),
  KEY `start_date` (`start_date`),
  KEY `end_date` (`end_date`),
  KEY `finished` (`finished`),
  KEY `user_id` (`owner_id`),
  KEY `started` (`started`),
  CONSTRAINT `FK1_space_id` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`),
  CONSTRAINT `FK2_user_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.tasks: ~6 rows (approximately)
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`id`, `space_id`, `owner_id`, `title`, `description`, `start_date`, `end_date`, `started`, `finished`, `all_day`, `priority`, `track_working_h`, `recurring`, `reminder`, `created`, `timezone`, `parent_task_id`) VALUES
	(1, 2, 1, 'Headliner', NULL, '2022-01-14 06:00:00', '2022-01-15 22:00:00', '2022-01-14 08:00:00', '2022-01-15 14:15:59', 0, 0, 0, 0, 0, '2021-10-26 16:28:37', 'Europe/Belgrade', NULL),
	(2, 2, 1, 'Under cushion', '<b style=color:#FF0000;>asd</b>', '2022-01-11 11:30:00', '2022-01-11 12:00:00', NULL, NULL, 0, 0, 0, 0, 0, '2022-01-11 12:10:37', 'Europe/Belgrade', NULL),
	(3, 2, 1, 'Test', NULL, '2022-05-25 16:25:00', '2022-06-30 16:25:00', '2022-06-01 09:30:00', NULL, 0, 0, 0, 0, 0, '2022-06-22 16:26:32', 'Europe/Belgrade', NULL),
	(4, 5, 1, 'Back panels', 'Yearly process audit', '2022-10-19 09:00:00', '2022-10-19 16:00:00', NULL, NULL, 0, 3, 0, 0, 0, '2022-10-19 07:52:49', 'Atlantic/Stanley', NULL),
	(5, 3, 1, 'Headliners TV', 'Annual product audit for headliners TV', '2022-10-24 00:00:00', NULL, NULL, NULL, 1, 2, 0, 0, 0, '2022-10-19 10:03:08', 'Europe/Belgrade', NULL),
	(6, 5, 1, 'Headliners', NULL, '2022-10-26 14:30:00', '2022-10-28 16:00:00', NULL, NULL, 0, 2, 0, 0, 0, '2022-10-26 14:31:09', 'Europe/Belgrade', NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.task_instance_exceptions
CREATE TABLE IF NOT EXISTS `task_instance_exceptions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) NOT NULL DEFAULT '0',
  `is_rescheduled` int(1) NOT NULL DEFAULT '0',
  `is_canceled` int(1) NOT NULL DEFAULT '0',
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  `reminder` int(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timezone` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `space_id` (`task_id`),
  KEY `start_date` (`start_date`),
  KEY `end_date` (`end_date`),
  KEY `finished` (`finished`),
  CONSTRAINT `FK4_task_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- Dumping data for table project-task-mngr_db.task_instance_exceptions: ~0 rows (approximately)
/*!40000 ALTER TABLE `task_instance_exceptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_instance_exceptions` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(255) NOT NULL DEFAULT '0',
  `roll_id` int(5) NOT NULL DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `name` (`name`),
  KEY `surname` (`lastname`),
  KEY `roll` (`roll_id`),
  KEY `added` (`created`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.users: ~1 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `roll_id`, `avatar`, `created`) VALUES
	(1, 'Test', 'Testing', 'test@t', '$2y$10$aB2c8H5vMCuG3q/IKJS0Nu/AuqYjl8mebNjVrFgkeU.IZFu24JoAu', 0, NULL, '2021-10-18 09:47:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table project-task-mngr_db.working_hours
CREATE TABLE IF NOT EXISTS `working_hours` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) NOT NULL DEFAULT '0',
  `worker_id` bigint(20) NOT NULL DEFAULT '0',
  `working_time` time NOT NULL DEFAULT '00:00:00',
  `logged` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `FK5_task_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  CONSTRAINT `FK6_worker_id` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table project-task-mngr_db.working_hours: ~0 rows (approximately)
/*!40000 ALTER TABLE `working_hours` DISABLE KEYS */;
/*!40000 ALTER TABLE `working_hours` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
