<?php

class SpacesController extends Controller
{
    public function __construct()
    {
        // check is user logged in and redirect to login page if not
        if (!isset($_SESSION['user_id'])) {
            redirect('users/login');
        }
        // load space model so data are available on page load
        $this->spaceModel = $this->loadModel('SpaceModel');
        $this->menuData = $this->spaceModel->loadSpaces();
    }

    public function index($param = '')
    {
        switch ($param) {
            case 'today':
                $data['page_title'] = 'Today';
                $_SESSION['space_ids'] = [0];
                $this->loadView('pages/today', $data);
                break;
            case 'next5':
                $data['page_title'] = 'Next 5 days';
                $_SESSION['space_ids'] = [0];
                $this->loadView('pages/today', $data);
                break;
            default:
                $data['page_title'] = 'Home';
                if (isset($_SESSION['space_ids'])) {
                    unset($_SESSION['space_ids']);
                }
                $this->loadView('pages/home', $data);
        };

        //$data['spaces'] = $this->menuData;
        // $this->loadView('pages/home', $data);
    }

    //data send via POST
    public function space()
    {
        if (isset($_POST['spaceIds'])) {
            // posted from "app.js" form on line 46-49
            //* space_ids is array stored in SESSION
            $space_ids = explode(",", $_POST['spaceIds']);
            $space = $this->spaceModel->loadSingleSpaceData($space_ids[0]);

            if (!$space) {
                redirect('spaces/index');
            }
            $_SESSION['space_ids'] = $space_ids;

            redirect('space/' . str_replace(' ', '_', strtolower($space['name'])));
        } elseif (!isset($_POST['spaceIds']) && isset($_SESSION['space_ids'])) {
            //* space_ids is array stored in SESSION
            $space = $this->spaceModel->loadSingleSpaceData($_SESSION['space_ids'][0]);
            $data['page_title'] = $space['name'];

            return $this->loadView('pages/space', $data);
        } else {
            redirect('spaces/index');
        }
    }

    // load menu data
    public function createMenuAjax()
    {
        $menu = $this->menuData;
        header('Content-Type: application/json');
        if ($menu) {
            print(json_encode($menu, JSON_PRETTY_PRINT));
        }
        return false;
    }

    public function addSpaceAjax()
    {
        if (isset($_POST['title']) && !empty($_POST['title']) && isset($_POST['parent_id']) && isset($_POST['menu_order'])) {
            $data['title'] = filter_var(trim($_POST['title']), FILTER_SANITIZE_STRING);
            $data['parent_id'] = filter_var(trim($_POST['parent_id']), FILTER_SANITIZE_NUMBER_INT);
            $data['menu_order'] = filter_var(trim($_POST['menu_order']), FILTER_SANITIZE_NUMBER_INT);
            $data['icon'] = filter_var(trim($_POST['icon']), FILTER_SANITIZE_STRING);

            $result = $this->spaceModel->addSpace($data);

            header('Content-Type: application/json');
            if ($result) {
                print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function updateSpaceAjax()
    {
        if (isset($_POST['space_id'])) {
            $data['id'] = filter_var(trim($_POST['space_id']), FILTER_SANITIZE_NUMBER_INT);
            $data['name'] = filter_var(trim($_POST['title']), FILTER_SANITIZE_STRING);
            $data['parent_id'] = filter_var(trim($_POST['parent_id']), FILTER_SANITIZE_NUMBER_INT);
            $data['menu_order'] = filter_var(trim($_POST['menu_order']), FILTER_SANITIZE_NUMBER_INT);
            $data['icon'] = filter_var(trim($_POST['icon']), FILTER_SANITIZE_STRING);

            $result = $this->spaceModel->updateSpace($data);

            header('Content-Type: application/json');
            if ($result) {
                print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function deleteSpacesAjax()
    {
        if (isset($_POST['spaceSelectedToDelete'])) {
            $spaceSelectedToDelete = filter_var($_POST['spaceSelectedToDelete'], FILTER_SANITIZE_NUMBER_INT);
            $spacesToUpdateOrDelete = isset($_POST['spacesToUpdateOrDelete']) ? filter_var_array($_POST['spacesToUpdateOrDelete'], FILTER_SANITIZE_NUMBER_INT) : [];
            $spaceToMoveTo = isset($_POST['spaceToMoveTo']) ? filter_var($_POST['spaceToMoveTo'], FILTER_SANITIZE_NUMBER_INT) : false;
            $deleteAction = filter_var($_POST['deleteAction'], FILTER_SANITIZE_STRING);

            if ($deleteAction == 'delete-space') {
                if (!empty($spacesToUpdateOrDelete)) {
                    for ($i = 0; $i < count($spacesToUpdateOrDelete); $i++) {
                        $data[$i]['id'] = $spacesToUpdateOrDelete[$i];
                        $data[$i]['parent_id'] = $spaceToMoveTo;
                    }
                    $result = $this->spaceModel->updateMultiSpaces($data);
                }
                $result = $this->spaceModel->deleteMultiSpaces([['id' => $spaceSelectedToDelete]]);
            } else {
                for ($i = 0; $i < count($spacesToUpdateOrDelete); $i++) {
                    $data[$i]['id'] = $spacesToUpdateOrDelete[$i];
                }
                $result = $this->spaceModel->deleteMultiSpaces($data);
            }


            header('Content-Type: application/json');
            if ($result) {
                print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
