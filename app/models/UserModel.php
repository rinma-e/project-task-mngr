<?php

class UserModel
{
    public function loginUser($email, $password)
    {
        $sql = "SELECT * FROM users WHERE email = :email";
        $conn = Database::instance();
        $result = $conn->run($sql, ['email' => $email])->fetch(PDO::FETCH_OBJ);

        if ($result) {
            if (password_verify($password, $result->password)) {
                return $result;
            }
            return false;
        }
        return false;
    }

    public function registerUser($data)
    {
        $sql = "INSERT INTO users (name,lastname,email,password) VALUES (:name,:lastname,:email,:password)";
        $conn = Database::instance();
        $values = [
            'name' => $data['name'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'password' => $data['password']
        ];

        if ($conn->run($sql, $values)) {
            return true;
        } else {
            return false;
        }
    }

    public function findUserByEmail($email)
    {
        $sql = "SELECT count(*) AS user_count FROM users WHERE email = :email";
        $conn = Database::instance();
        $result = $conn->run($sql, ['email' => $email])->fetch();

        if ($result->user_count > 0) {
            return true;
        }
        return false;
    }

    public function passwordResetReq($email = '')
    {
        if (!empty($email)) {
            return true;
        }
        return false;
    }
}
