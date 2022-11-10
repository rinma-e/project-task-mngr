<?php

class SpaceModel
{
    // load spaces from database for showing in html
    public function loadSpaces()
    {
        // order them by paren_id and by menu_order
        $sql = "SELECT id,parent_id,name,menu_order,icon FROM spaces ORDER BY parent_id,menu_order";
        $conn = Database::instance();
        $result = $conn->run($sql)->fetchAll(PDO::FETCH_ASSOC);

        if (is_array($result)) {
            // from loaded data make data tree (so is easier to show in html)
            return buildMenuTree($result);
        }
        return false;
    }

    public function loadSingleSpaceData($id)
    {
        // order them by paren_id and by menu_order
        $sql = "SELECT * FROM spaces WHERE id = :id";
        $conn = Database::instance();
        $result = $conn->run($sql, ['id' => $id])->fetch(PDO::FETCH_ASSOC);

        if (is_array($result)) {
            return $result;
        }
        return false;
    }

    public function addSpace($data)
    {
        $sql = "INSERT INTO spaces (name,parent_id,menu_order,icon) VALUES (:name,:parent_id,:menu_order,:icon)";
        $conn = Database::instance();
        $values = [
            'name' => $data['title'],
            'parent_id' => $data['parent_id'],
            'menu_order' => $data['menu_order'],
            'icon' => $data['icon']
        ];

        if ($conn->run($sql, $values)) {
            $result['last_id'] = $conn->lastInsertId();
            return $result;
        } else {
            return false;
        }
    }

    public function updateSpace($data)
    {
        // the list of allowed field names
        $allowed = ["name", "parent_id", "menu_order", "icon", "updated"];

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

        $sql = "UPDATE spaces SET $setStr WHERE id = :id";

        $conn = Database::instance();

        if ($conn->run($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }

    public function updateMultiSpaces($data)
    {
        // the list of allowed field names
        $allowed = ["id", "name", "parent_id", "menu_order", "icon", "updated"];

        // initialize an array with values:
        $params = [];

        // initialize a string with `fieldname` = :placeholder pairs
        $setStr = "";

        // dynamically create array with fields to be updated from first sub-array.
        // all sub-arrays must contain same keys. Data format:
        // $data[
        //     ['id'=>'1','title'=>'t1',...],
        //     ['id'=>'2','title'=>'t2',...],
        //     ['id'=>'3','title'=>'t3',...],
        //     ...
        // ]
        foreach ($allowed as $key) {
            if (isset($data[0][$key]) && $data[0][$key] != ""  && $key != "id") {
                $setStr .= "`$key` = :$key,";
            }
        }

        for ($i = 0; $i < count($data); $i++) {
            foreach ($allowed as $key) {
                if (isset($data[$i][$key]) && $data[$i][$key] != "") {
                    $params[$i][$key] = $data[$i][$key];
                }
            }
        }
        $setStr = rtrim($setStr, ",");

        $sql = "UPDATE spaces SET $setStr WHERE id = :id";

        $conn = Database::instance();

        if ($conn->run($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }


    public function deleteMultiSpaces($data)
    {
        // Data format:
        // $data[
        //          ['id'=>'1'],
        //          ['id'=>'2'],
        //          ['id'=>'3'],
        //          ...
        //      ]

        $sql = "DELETE FROM spaces WHERE id = :id";
        $conn = Database::instance();
        if ($conn->run($sql, $data)) {
            return true;
        } else {
            return false;
        }
    }
}
