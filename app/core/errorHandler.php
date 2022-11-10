<?php

error_reporting(E_ALL);

if (DEVELOPMENT) {
    ini_set('display_errors', '1');
} else {
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
}

function myExceptionHandler($e)
{
    http_response_code(500);
    if (filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOLEAN)) {
        echo "<pre>" . $e . "</pre>";
    } else {
        error_log(date('[d/m/Y H:i:s]', time()) . "->" . $e . "\r\n", 3, "../app/logs/" . date('d.m.Y', time()) . "-errors.log");
        echo "<h1>500 Internal Server Error</h1>
              An internal server error has been occurred.<br>
              Please try again later.";
    }
}

set_exception_handler('myExceptionHandler');

set_error_handler(function ($level, $message, $file = '', $line = 0) {
    throw new ErrorException($message, 0, $level, $file, $line);
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null) {
        $e = new ErrorException(
            $error['message'],
            0,
            $error['type'],
            $error['file'],
            $error['line']
        );
        myExceptionHandler($e);
    }
});
