<?php
/*
* Base controller
* Loads the models and views
*/

class Controller
{
    //load model
    protected function loadModel($model)
    {
        //check does model file exist
        if( file_exists('../app/models/' . $model . '.php') )
        {
            //if exist include file
            include_once '../app/models/' . $model . '.php';

            //instantiate model
            return new $model();
        }
        else
        {
            //if don't exist return false
            return false;
        }
    }

    //load view
    protected function loadView($view,$data = [])
    {
        //check does view file exist
        if( file_exists('../app/views/' . $view . '.phtml') )
        {
            //if exist include file
            include_once '../app/views/' . $view . '.phtml';
        }
        else
        {
            //if don't exist return '404 not found'
            include_once "../app/views/errors/404.phtml";
        }
    }
}