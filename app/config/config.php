<?php
// set your website title
define('APP_NAME', 'PRO-TASK');

// connection settings
define('DB_DRIVER', 'mysql');
define('DB_HOST', 'localhost');
define('DB_USER', 'marin');
define('DB_PASSWORD', '1');
define('DB_NAME', 'project-task-mngr_db');
define('DB_CHARSET', 'utf8mb4');

// set time zone
date_default_timezone_set('Europe/Belgrade');

// set app mode (important for error reporting).
// if set to true then in development mode, if set to false in production mode
define('DEVELOPMENT', true);

// protocol type http or https
define('PROTOCOL', 'http');

// root and asset paths
$path = str_replace("\\", "/", PROTOCOL . "://" . $_SERVER['SERVER_NAME'] . dirname(dirname(__DIR__))  . "/");
$path = str_replace($_SERVER['DOCUMENT_ROOT'], "", $path);

//APP root
define('APP_ROOT', dirname(dirname(__FILE__)));

//URL root
define('URL_ROOT', $path);

// upload root folder
define('UPLOAD_ROOT', str_replace("\\", "/", dirname(dirname(__DIR__))) . "/public/");

// assets folder
define('ASSETS', $path . "public/assets/");
