<?php
/*
    *  App Core class
    *  Creates URL & loads core controller
    *  URL FORMAT - controller/method/parameters
*/

class Core
{
    protected $currentController = 'SpacesController';
    protected $currentMethod = 'index';
    protected $params = [];

    public function __construct()
    {
        //get url
        $url = $this->getURL();

        //if url exist, check is first value valid controller
        if(!empty($url))
        {
            //check if controller class exists
            if(file_exists('../app/controllers/' . ucfirst($url['0']) . 'Controller.php'))
            {
                //if exist set as current controller
                $this->currentController = ucfirst($url['0']) . 'Controller';
                
                //remove 0 index from array
                unset($url['0']);
            }
        }
            
        //include file and set as current controller
        require_once '../app/controllers/' . $this->currentController . '.php';
        
        //instantiate controller class
        $this->currentController = new $this->currentController;
        
        //check is there second element in $url array
        if(!empty($url))
        {
            $method = isset($url['0']) ? $url['0'] : $url['1'];
            //check is this valid method in instantiated controller
            if(method_exists($this->currentController,$method))
            {
                //if method exist set as current method
                $this->currentMethod = $method;

                //unset array
                if(isset($url['0']))
                {
                    unset($url['0']);
                }
                else
                {
                    unset($url['1']);
                }
            }
        }

        //rest of $url elements are our parameters. If no more elements $params is empty array
        $this->params = $url ? array_values($url) : [];
        
        //call current controller with current method and parameters
        call_user_func_array([$this->currentController,$this->currentMethod],$this->params);
    
    }

    protected function getURL()
    {
        if(isset($_GET['url']))
        {
            $url = trim($_GET['url'],'/');
            $url = filter_var($url,FILTER_SANITIZE_URL);
            $url = explode('/',$url);
            return $url;
        }
    }
}