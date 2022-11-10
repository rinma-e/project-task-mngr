<?php

require_once 'config/config.php';
require_once 'core/errorHandler.php';
require_once 'core/functions.php';
require_once 'helpers/session_helper.php';
require_once '../vendor/ezyang/htmlpurifier/library/HTMLPurifier.auto.php';

// Autoload core libraries
spl_autoload_register(function ($className) {
    include_once 'core/' . $className . '.php';
});
