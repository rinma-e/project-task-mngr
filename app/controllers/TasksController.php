<?php

class TasksController extends Controller
{
    public function __construct()
    {
        // check is user logged in and redirect to login page if not
        if (!isset($_SESSION['user_id'])) {
            redirect('users/login');
        }
        // load event model so data are available on page load
        $this->taskModel = $this->loadModel('TaskModel');
    }

    public function loadAllTasksAjax()
    {
        $data['owner_id'] = $_SESSION['user_id'];

        $data['month_start'] = date('Y-m-d H:i:s', strtotime($_POST['start']));
        $data['month_end'] = date('Y-m-d H:i:s', strtotime($_POST['end']));
        $result['tasks'] = $this->taskModel->loadAllTasks($data);
        $result['month_start'] = $data['month_start'];
        $result['month_end'] = $data['month_end'];

        header('Content-Type: application/json');
        if ($result) {
            print(json_encode($result, JSON_PRETTY_PRINT));
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
        }
    }

    // data sent via POST
    public function loadAllSpaceTasksAjax()
    {
        $data['owner_id'] = $_SESSION['user_id'];

        //* $data['space_ids'] sent as json array and here decoded as array
        $data['space_ids'] = json_decode($_POST['space_ids']);
        $data['month_start'] = date('Y-m-d H:i:s', strtotime($_POST['start']));
        $data['month_end'] = date('Y-m-d H:i:s', strtotime($_POST['end']));
        $result['tasks'] = $this->taskModel->loadAllSpaceTasks($data);
        $result['month_start'] = $data['month_start'];
        $result['month_end'] = $data['month_end'];

        header('Content-Type: application/json');
        if ($result) {
            print(json_encode($result, JSON_PRETTY_PRINT));
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
        }
    }

    // load menu data
    public function loadSingleTaskAjax()
    {
        $menu = $this->menuData;
        header('Content-Type: application/json');
        if ($menu) {
            print(json_encode($menu, JSON_PRETTY_PRINT));
        }
        return print(json_encode(false, JSON_PRETTY_PRINT));
    }

    public function addTaskAjax()
    {
        header('Content-Type: application/json');
        //* test to see is addTaskAjax function called
        // return print(json_encode($_POST['title'], JSON_PRETTY_PRINT));

        //TODO: verify user input (see usersController). Add token to addTask form and to SESSION
        //TODO: first verify if token in SESSION and token received are same and then proceed to verify data
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // init data
            //? according to many: you make basic checking of input data (not empty if required,
            //? max and min length, can do some regex checking of format (password in accordance
            //? to rules: one big letter, one special char, length...),...).
            //? when retrieving data from DB data should be escaped with 'htmlspecialchars' php function
            $htmlPurifier = new HTMLPurifier();

            //TODO: check for empty times and when this is acceptable then 
            //TODO: combine start date and start time
            // validate title
            if (empty($_POST['title'])) {
                $data['errors']['title'] = 'Please enter task title';
            }

            // validate start date
            if (empty($_POST['taskStartDate'])) {
                $data['errors']['taskStartDate'] = 'Please enter when task starts';
            }

            if (isset($_POST['allDayTask'])) {
                if (!validateDate($_POST['taskStartDate'], 'Y-m-d')) {
                    $data['errors']['taskStartDate'] = 'Invalid start date';
                }

                if ($_POST['taskDueDate'] && !validateDate($_POST['taskDueDate'], 'Y-m-d')) {
                    $data['errors']['taskDueDate'] = 'Invalid due date';
                }
            } else {
                if (!validateDate($_POST['taskStartDate'] . ' ' . $_POST['taskStartTime'], 'Y-m-d H:i')) {
                    $data['errors']['taskStartDate'] = 'Invalid start date or time';
                }

                if (!empty($_POST['taskDueDate']) && empty($_POST['taskDueTime'])) {
                    $data['errors']['taskDueTime'] = 'For non "All day" tasks due time must be supplied!';
                } else if (!empty($_POST['taskDueDate']) && !validateDate($_POST['taskDueDate'] . ' ' . $_POST['taskDueTime'], 'Y-m-d H:i')) {
                    $data['errors']['taskDueDate'] = 'Invalid due date or time';
                }
            }

            // if there are no errors
            if (empty($data['errors'])) {
                $data = [
                    'space_id' => filter_var($_POST['space_id'], FILTER_SANITIZE_NUMBER_INT),
                    'owner_id' => filter_var($_POST['owner_id'], FILTER_SANITIZE_NUMBER_INT),
                    'title' => $htmlPurifier->purify($_POST['title']),
                    'description' => $htmlPurifier->purify($_POST['description']),
                    'start_date' => isset($_POST['allDayTask']) ? $_POST['taskStartDate'] : trim($_POST['taskStartDate'] . " " . $_POST['taskStartTime']),
                    'end_date' => isset($_POST['allDayTask']) ? $_POST['taskDueDate'] : trim($_POST['taskDueDate'] . " " . $_POST['taskDueTime']),
                    'all_day' => isset($_POST['allDayTask']) ? '1' : '0',
                    'priority' => filter_var(trim($_POST['priority']), FILTER_SANITIZE_NUMBER_INT),
                    'recurring' => isset($_POST['#addRepeatTask']) ? '1' : '0',
                    'reminder' => isset($_POST['taskReminder']) ? '1' : '0',
                    'timezone' => $_POST['timezone']
                ];
                unset($_POST);

                $result = $this->taskModel->addTask($data);
                if ($result) {
                    return print(json_encode($result, JSON_PRETTY_PRINT));
                } else {
                    return print(json_encode(false, JSON_PRETTY_PRINT));
                };
            } else {
                return print(json_encode($data, JSON_PRETTY_PRINT));
            }
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
            // $this->loadView('error/500');
        }
    }

    public function editTaskAjax()
    {
        header('Content-Type: application/json');
        //* test to see is editTaskAjax function called
        // return print(json_encode($_POST['title'], JSON_PRETTY_PRINT));

        //TODO: verify user input (see usersController). Add token to addTask form and to SESSION
        //TODO: first verify if token in SESSION and token received are same and then proceed to verify data
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // init data
            //? according to many: you make basic checking of input data (not empty if required,
            //? max and min length, can do some regex checking of format (password in accordance
            //? to rules: one big letter, one special char, length...),...).
            //? when retrieving data from DB data should be escaped with 'htmlspecialchars' php function
            $htmlPurifier = new HTMLPurifier();

            //TODO: check for empty times and when this is acceptable then 
            //TODO: combine start date and start time
            // validate title
            if (empty($_POST['title'])) {
                $data['errors']['title'] = 'Please enter task title';
            }

            // validate start date
            if (empty($_POST['taskStartDate'])) {
                $data['errors']['taskStartDate'] = 'Please enter when task starts';
            }

            if (isset($_POST['allDayTask'])) {
                if (!validateDate($_POST['taskStartDate'], 'Y-m-d')) {
                    $data['errors']['taskStartDate'] = 'Invalid start date';
                }

                if ($_POST['taskDueDate'] && !validateDate($_POST['taskDueDate'], 'Y-m-d')) {
                    $data['errors']['taskDueDate'] = 'Invalid due date';
                }
            } else {
                if (!validateDate($_POST['taskStartDate'] . ' ' . $_POST['taskStartTime'], 'Y-m-d H:i')) {
                    $data['errors']['taskStartDate'] = 'Invalid start date or time';
                }

                if (!empty($_POST['taskDueDate']) && empty($_POST['taskDueTime'])) {
                    $data['errors']['taskDueTime'] = 'For non "All day" tasks due time must be supplied!';
                } else if (!empty($_POST['taskDueDate']) && !validateDate($_POST['taskDueDate'] . ' ' . $_POST['taskDueTime'], 'Y-m-d H:i')) {
                    $data['errors']['taskDueDate'] = 'Invalid due date or time';
                }
            }

            // header('Content-Type: application/json');
            // return print(json_encode($data, JSON_PRETTY_PRINT));

            header('Content-Type: application/json');
            // if there are no errors
            if (empty($data['errors'])) {
                $data = [
                    'id' => filter_var($_POST['task_id'], FILTER_SANITIZE_NUMBER_INT),
                    'space_id' => filter_var($_POST['space_id'], FILTER_SANITIZE_NUMBER_INT),
                    'owner_id' => filter_var($_POST['owner_id'], FILTER_SANITIZE_NUMBER_INT),
                    'title' => $htmlPurifier->purify($_POST['title']),
                    'description' => $htmlPurifier->purify($_POST['description']),
                    'start_date' => isset($_POST['allDayTask']) ? $_POST['taskStartDate'] : trim($_POST['taskStartDate'] . " " . $_POST['taskStartTime']),
                    'end_date' => isset($_POST['allDayTask']) ? $_POST['taskDueDate'] : trim($_POST['taskDueDate'] . " " . $_POST['taskDueTime']),
                    'all_day' => isset($_POST['allDayTask']) ? '1' : '0',
                    'priority' => filter_var(trim($_POST['priority']), FILTER_SANITIZE_NUMBER_INT),
                    'recurring' => isset($_POST['#addRepeatTask']) ? '1' : '0',
                    'reminder' => isset($_POST['taskReminder']) ? '1' : '0',
                    'timezone' => $_POST['timezone']
                ];
                unset($_POST);

                $result = $this->taskModel->editTask($data);
                if ($result) {
                    return print(json_encode($result, JSON_PRETTY_PRINT));
                } else {
                    return print(json_encode(false, JSON_PRETTY_PRINT));
                };
            } else {
                return print(json_encode($data, JSON_PRETTY_PRINT));
            }
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
            // $this->loadView('error/500');
        }
    }

    public function deleteTaskAjax()
    {
        header('Content-Type: application/json');
        if (isset($_POST['task_id'])) {
            $task_id = filter_var($_POST['task_id'], FILTER_SANITIZE_NUMBER_INT);

            unset($_POST);

            $result = $this->taskModel->deleteTask([$task_id]);

            if ($result) {
                return print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return print(json_encode(false, JSON_PRETTY_PRINT));
            }
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
        }
    }

    public function addTaskStartedDateAjax()
    {
        header('Content-Type: application/json');
        if (isset($_POST['task_id']) && isset($_POST['started'])) {
            $data = [
                'id' => filter_var($_POST['task_id'], FILTER_SANITIZE_NUMBER_INT),
                'started' => $_POST['started']
            ];
            unset($_POST);

            $result = $this->taskModel->editTask($data);

            if ($result) {
                return print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return print(json_encode(false, JSON_PRETTY_PRINT));
            }
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
        }
    }

    public function addTaskFinishedDateAjax()
    {
        header('Content-Type: application/json');
        if (isset($_POST['task_id']) && isset($_POST['finished'])) {
            $data = [
                'id' => filter_var($_POST['task_id'], FILTER_SANITIZE_NUMBER_INT),
                'finished' => $_POST['finished']
            ];
            unset($_POST);

            $result = $this->taskModel->editTask($data);

            if ($result) {
                return print(json_encode($result, JSON_PRETTY_PRINT));
            } else {
                return print(json_encode(false, JSON_PRETTY_PRINT));
            }
        } else {
            return print(json_encode(false, JSON_PRETTY_PRINT));
        }
    }
}
