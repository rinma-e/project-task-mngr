<?php

class TaskModel
{
    // load all tasks
    public function loadAllTasks($data)
    {
        // collect tasks in defined time period
        $sql = "SELECT t.*, s.name AS space_name FROM tasks AS t JOIN spaces AS s ON t.space_id = s.id
                 WHERE t.owner_id = :owner_id AND 
            (
                (t.start_date < :month_starta AND (t.finished IS NULL)) 
                OR 
                (t.start_date BETWEEN :month_start AND :month_end) 
                OR 
                (t.end_date BETWEEN :month_startb AND :month_endb)
            ) 
            ORDER BY t.start_date,t.title ASC,t.finished DESC";
        $values = [
            'owner_id' => $data['owner_id'],
            'month_starta' => $data['month_start'],
            'month_start' => $data['month_start'],
            'month_end' => $data['month_end'],
            'month_startb' => $data['month_start'],
            'month_endb' => $data['month_end']
        ];
        $conn = Database::instance();
        $result = $conn->run($sql, $values)->fetchAll();

        if (is_array($result)) return $result;
        return false;
    }

    // load tasks by space_id and owner_id
    public function loadAllSpaceTasks($data)
    {
        // prepare named placeholders of space_ids for IN clause
        $ids = $data['space_ids']; // $data['space_ids'] passed as array
        $in = "";
        $i = 0; // we are using an external counter because the actual array key could be dangerous
        foreach ($ids as $item) {
            $key = ":id" . $i++;
            $in .= "$key,";
            $in_params[$key] = $item; // collecting values into key-value array
        }
        $in = rtrim($in, ","); // :id0,:id1,:id2

        // collect tasks in defined time period
        $sql = "SELECT t.*, s.name AS space_name FROM tasks AS t JOIN spaces AS s ON t.space_id = s.id
                 WHERE t.space_id IN ($in) AND t.owner_id = :owner_id AND 
            (
                (t.start_date < :month_starta AND (t.finished IS NULL)) 
                OR 
                (t.start_date BETWEEN :month_start AND :month_end) 
                OR 
                (t.end_date BETWEEN :month_startb AND :month_endb)
            ) 
            ORDER BY t.start_date,t.title ASC,t.finished DESC";
        $values = [
            'owner_id' => $data['owner_id'],
            'month_starta' => $data['month_start'],
            'month_start' => $data['month_start'],
            'month_end' => $data['month_end'],
            'month_startb' => $data['month_start'],
            'month_endb' => $data['month_end']
        ];
        $conn = Database::instance();
        $result = $conn->run($sql, array_merge($values, $in_params))->fetchAll();

        if (is_array($result)) return $result;
        return false;
    }

    public function loadTask($task_id)
    {
        $sql = "SELECT * FROM tasks WHERE id = :id";
        $conn = Database::instance();
        $result = $conn->run($sql, ['id' => $task_id])->fetch(PDO::FETCH_ASSOC);

        if (is_array($result)) return $result;
        return false;
    }

    public function addTask($data)
    {
        // return $data;
        $fields = "";
        $place_holders = "";
        $values = [];
        foreach ($data as $key => $val) {
            if ($val) {
                $fields .= "`$key`,";
                $place_holders .= ":$key,";
                $values[$key] = $val;
            }
        }
        $fields = rtrim($fields, ",");
        $place_holders = rtrim($place_holders, ",");
        $sql = "INSERT INTO tasks ($fields) VALUES ($place_holders)";
        $conn = Database::instance();

        if ($conn->run($sql, $values)) {
            $result['last_id'] = $conn->lastInsertId();
            return $result;
        } else {
            return false;
        }
    }

    public function deleteTask($task_id)
    {
        // return false;
        $sql = "DELETE FROM tasks WHERE id = :id";
        $conn = Database::instance();
        if ($conn->run($sql, $task_id)) {
            return true;
        } else {
            return false;
        }
    }

    public function editTask($data)
    {
        // return "call to editTask from model successful";
        // the list of allowed field names
        $allowed = ["owner_id", "space_id", "title", "description", "start_date", "end_date", "started", "finished", "all_day", "priority", "track_working_h", "recurring", "reminder", "timezone", "parent_task_id"];

        // initialize an array with values:
        $params = [];

        // initialize a string with `fieldname` = :placeholder pairs
        $setStr = "";

        // loop over source data array
        foreach ($allowed as $key) {
            if (isset($data[$key]) && $data[$key] != ""  && $key != "id") {
                $setStr .= "`$key` = :$key,";
                $params[$key] = $data[$key];
            }
        }
        $setStr = rtrim($setStr, ",");

        $params['id'] = $data['id'];

        $sql = "UPDATE tasks SET $setStr WHERE id = :id";

        $conn = Database::instance();

        if ($conn->run($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }
}
