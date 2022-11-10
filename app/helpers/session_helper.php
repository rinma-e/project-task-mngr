<?php

// start session
session_start();

// flash messages helper
function flashMsg($name='',$message=['title'=>'','body'=>''],$class='alert-success bg-success')
{
    if(!empty($name))
    {
        if(!empty($message['title']))
        {
            if(isset($_SESSION[$name]))
            {
                unset($_SESSION[$name]);
            }

            $_SESSION[$name] = $message;
            $_SESSION[$name.'_class'] = $class;
        }
        elseif(empty($message['title']) && isset($_SESSION[$name]))
        {
            $class = isset($_SESSION[$name.'_class']) ? $_SESSION[$name.'_class'] : '';
            //echo '<div class="' . $class . '" id="flesh-msg">' . $_SESSION[$name] . '</div>';
            echo '<div id="flesh-msg" class="alert ' . $class . ' rounded-0 fade show my-3 position-fixed top-0 start-0 end-0">
                    <h6 class="mb-0 text-white">' . $_SESSION[$name]['title'] . '</h6>
                    <div class="text-white">' . $_SESSION[$name]['body'] . '</div>
                </div>';
            unset($_SESSION[$name]);
            unset($_SESSION[$name.'_class']);
        }
    }
}