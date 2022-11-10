<?php

class Database
{
    protected static $instance;
    protected $db;

    public function __construct()
    {
        $dsn = DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        try {
            $options = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                PDO::ATTR_EMULATE_PREPARES => FALSE
            );
            $this->db = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
            //echo "Connected";
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int) $e->getCode());
        }
    }

    public static function instance()
    {
        if (self::$instance === null) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function __call($method, $arguments)
    {
        return call_user_func_array(array($this->db, $method), $arguments);
    }

    public function run($sql, $arguments = [])
    {
        if (!$arguments) {
            return $this->query($sql);
        }

        $statement = $this->db->prepare($sql);

        if (isMultiArray($arguments)) {
            $this->db->beginTransaction();
            // loop over the data array
            foreach ($arguments as $row) {
                $statement->execute($row);
            }
            $this->db->commit();
        } else {
            $statement = $this->db->prepare($sql);
            $statement->execute($arguments);
        }

        return $statement;
    }
}
