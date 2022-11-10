<?php

class UsersController extends Controller
{
    public function __construct()
    {
        $this->userModel = $this->loadModel('UserModel');
    }

    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // init data
            $data = [
                'page_title' => 'Register',
                'name' => filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING),
                'lastname' => filter_var(trim($_POST['lastname']), FILTER_SANITIZE_STRING),
                'email' => filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL),
                'password' => filter_var($_POST['password'], FILTER_SANITIZE_STRING),
                'confirm_password' => filter_var($_POST['confirm_password'], FILTER_SANITIZE_STRING),
                'term_and_cond' => isset($_POST['term_and_cond']) ? filter_var($_POST['term_and_cond'], FILTER_SANITIZE_STRING) : 'off',
                'errors' => [],
            ];
            unset($_POST);

            // validate name
            if (empty($data['name'])) {
                $data['errors']['name_err'] = 'Please enter name';
            }

            // validate lastname
            if (empty($data['lastname'])) {
                $data['errors']['lastname_err'] = 'Please enter last name';
            }

            // validate email
            if (empty($data['email'])) {
                $data['errors']['email_err'] = 'Please enter email';
            } else {
                if ($this->userModel->findUserByEmail($data['email'])) {
                    $data['errors']['email_err'] = 'Email is already taken';
                }
            }

            // validate password
            if (empty($data['password'])) {
                $data['errors']['password_err'] = 'Please enter password';
            } elseif (strlen($data['password']) < 8) {
                $data['errors']['password_err'] = 'Password must be at least 8 characters long';
            }

            // validate confirm_password
            if (empty($data['confirm_password'])) {
                $data['errors']['confirm_password_err'] = 'Please confirm password';
            } else {
                if ($data['password'] != $data['confirm_password']) {
                    $data['errors']['confirm_password_err'] = 'Passwords do not mach';
                }
            }

            if ($data['term_and_cond'] == 'off') {
                $data['errors']['term_and_cond_err'] = 'To be able to register You must accept out terms and conditions';
            }

            // if there are no errors
            if (empty($data['errors'])) {
                // hash password
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

                // register user
                if ($this->userModel->registerUser($data)) {
                    flashMsg('register_success', ['title' => 'Registration successful', 'body' => 'Now You may login']);
                    redirect('login');
                } else {
                    $this->loadView('error/500');
                };
            } else {
                $this->loadView('users/register', $data);
            }
        } else {
            // init data
            $data = [
                'page_title' => 'Register',
                'name' => '',
                'lastname' => '',
                'email' => '',
                'password' => '',
                'confirm_password' => '',
                'term_and_cond' => 'off',
                'errors' => [],
            ];
            $this->loadView('users/register', $data);
        }
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // init data
            $data = [
                'page_title' => 'Login',
                'email' => filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL),
                'password' => filter_var($_POST['password'], FILTER_SANITIZE_STRING),
                'remember_me' => isset($_POST['remember_me']) ? 'yes' : 'no',
                'errors' => [],
            ];

            // validate email
            if (empty($data['email'])) {
                $data['errors']['email_err'] = 'Please enter email';
            }

            // validate password
            if (empty($data['password'])) {
                $data['errors']['password_err'] = 'Please enter password';
            }

            // if there are no errors
            if (empty($data['errors'])) {
                // login user
                $loggedInUser = $this->userModel->loginUser($data['email'], $data['password']);

                if ($loggedInUser) {
                    // set session variables
                    $this->createUserSession($loggedInUser);
                } else {
                    $data['errors']['user_not_found'] = 'No user found';
                    $this->loadView('users/login', $data);
                }
            } else {
                $this->loadView('users/login', $data);
            }
        } else {
            // init data
            $data = [
                'page_title' => 'Login',
                'email' => '',
                'password' => '',
                'remember_me' => 'no',
                'errors' => [],
            ];
            $this->loadView('users/login', $data);
        }
    }

    public function logout()
    {
        unset($_SESSION['user_id']);
        unset($_SESSION['user_email']);
        unset($_SESSION['user_name']);
        unset($_SESSION['user_lastname']);
        unset($_SESSION['roll']);
        unset($_SESSION['avatar']);
        session_destroy();
        redirect('users/login');
    }

    public function isLoggedIn()
    {
        if (isset($_SESSION['user_id'])) {
            return true;
        }
        return false;
    }

    private function createUserSession($user)
    {
        $_SESSION['user_id'] = $user->id;
        $_SESSION['user_email'] = $user->email;
        $_SESSION['user_name'] = $user->name;
        $_SESSION['user_lastname'] = $user->lastname;
        $_SESSION['roll'] = $user->roll_id;
        $_SESSION['avatar'] = $user->avatar;
        redirect('');
    }

    public function forgot_password()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // init data
            $data = [
                'page_title' => 'Forgot password',
                'email' => filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL),
                'errors' => [],
            ];
            unset($_POST);

            // validate email
            if (empty($data['email'])) {
                $data['errors']['email_err'] = 'Please enter email';
            } else {
                if (!$this->userModel->findUserByEmail($data['email'])) {
                    $data['errors']['email_err'] = 'Email does not exist';
                }
            }

            // if there are no errors
            if (empty($data['errors'])) {
                // login user
                $sendMail = $this->userModel->passwordResetReq($data['email']);

                if ($sendMail) {
                    // mail sent successfully
                    flashMsg('mail_sent_success', ['title' => 'Request for password reset sent successfully', 'body' => 'Verification link sent to supplied mail']);
                    redirect('users/login');
                } else {
                    $data['errors']['user_not_found'] = 'No user found';
                    $this->loadView('users/forgot_password', $data);
                }
            } else {
                $this->loadView('users/forgot_password', $data);
            }
        } else {
            // init data
            $data = [
                'page_title' => 'Forgot password',
                'email' => '',
                'errors' => [],
            ];
            $this->loadView('users/forgot_password', $data);
        }
    }
}
