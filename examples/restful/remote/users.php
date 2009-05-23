<?php
    /**
     * Simple MVC-like REST backend with simulated database using $_SESSION.
     * This file contains following Classes
     *   - ApplicationController:  base-class for Controllers
     *   - Users: extends ApplicationController
     *   - User:  A simple ORM class
     *   - Response:  A simple JSON-response class
     *   - DB:  A simulated database connection
     */
    session_start();

    // Fake a database connection using _SESSION
    $dbh = new DB();

    // Create controller instance and dispatch the action.
    $controller = new Users();
    echo $controller->dispatch();

    /**
     * @class ApplicationController
     */
    class ApplicationController {
        protected $method, $id, $params;

        public function __construct() {
            // grab the HTTP method
            $this->method = $_SERVER["REQUEST_METHOD"];
            $this->parseRequest();
        }

        /**
         * dispatch
         * Dispatch request to appropriate controller-action by convention according to the HTTP method.
         */
        public function dispatch() {
            switch ($this->method) {
                case 'GET':
                    return $this->view();
                    break;
                case 'POST':
                    return $this->create();
                    break;
                case 'PUT':
                    return $this->update();
                    break;
                case 'DELETE':
                    return $this->destroy();
                    break;
            }
        }

        protected function parseRequest() {
            if ($this->method == 'PUT') {   // <-- Have to jump through hoops to get PUT data
                $raw  = '';
                $httpContent = fopen('php://input', 'r');
                while ($kb = fread($httpContent, 1024)) {
                    $raw .= $kb;
                }
                fclose($httpContent);
                $params = array();
                parse_str($raw, $params);
                $this->id = (isset($params['id'])) ? $params['id'] : null;
                $this->params = (isset($params['data'])) ? json_decode(stripslashes($params['data']), true) : null;
            } else {
                // grab JSON data if there...
                $this->params = (isset($_REQUEST['data'])) ? json_decode(stripslashes($_REQUEST['data']), true) : null;
            }
            // grab id from path if exists... (eg: /users/69)
            $id = array_pop(split('/', $_SERVER["PATH_INFO"]));
            $this->id = (is_numeric($id)) ? $id : null;
        }
    }

    /**
     * @class Users
     * A simple application controller extension
     */
    class Users extends ApplicationController {
        /**
         * view
         * Retrieves rows from database.
         */
        public function view() {
            $res = new Response();
            $res->success = true;
            $res->message = "Loaded data";
            $res->data = User::all();
            return $res->to_json();
        }
        /**
         * create
         */
        public function create() {
            $res = new Response();
            $rec = User::create($this->params);
            if ($rec) {
                $res->success = true;
                $res->message = "Created new User" . $rec->id;
                $res->data = $rec->to_hash();
            } else {
                $res->message = "Failed to create User";
            }
            return $res->to_json();
        }
        /**
         * update
         */
        public function update() {
            $res = new Response();
            $rec = User::update($this->id, $this->params);
            if ($rec) {
                $res->data = $rec->to_hash();
                $res->success = true;
                $res->message = 'Updated User ' . $this->id;
            } else {
                $res->message = "Failed to find that User";
            }
            return $res->to_json();
        }
        /**
         * destroy
         */
        public function destroy() {
            $res = new Response();
            if (User::destroy($this->id)) {
                $res->success = true;
                $res->message = 'Destroyed User ' . $this->id;
            } else {
                $res->message = "Failed to destroy User";
            }
            return $res->to_json();
        }
    }

    /**
     * @class User
     * A typical Model class from an ORM.
     */
    class User {
        public $id, $attributes;
        static function create($params) {
            $user = new User($params);
            $user->save();
            return $user;
        }
        static function find($id) {
            global $dbh;
            $found = null;
            foreach ($dbh->rs() as $rec) {
                if ($rec['id'] == $id) {
                    $found = new User($rec);
                    break;
                }
            }
            return $found;
        }
        static function update($id, $params) {
            global $dbh;
            $rec = User::find($id);
            if ($rec == null) {
                return $rec;
            }
            $rs = $dbh->rs();
            foreach ($rs as $idx => $row) {
                if ($row['id'] == $id) {
                    $rec->attributes = array_merge($rec->attributes, $params);
                    $dbh->update($idx, $rec->attributes);
                    break;
                }
            }
            return $rec;
        }
        static function destroy($id) {
            global $dbh;
            $rec = null;
            $rs = $dbh->rs();
            foreach ($rs as $idx => $row) {
                if ($row['id'] == $id) {
                    $rec = new User($dbh->destroy($idx));
                    break;
                }
            }
            return $rec;
        }
        static function all() {
            global $dbh;
            return $dbh->rs();
        }

        public function __construct($params) {
            $this->id = $params["id"] || null;
            $this->attributes = $params;
        }
        public function save() {
            global $dbh;
            $this->attributes['id'] = $dbh->pk();
            $dbh->insert($this->attributes);
        }
        public function to_hash() {
            return $this->attributes;
        }
    }

    /**
     * @class Response
     * A simple JSON Response class.
     */
    class Response {
        public $success, $data, $message;

        public function __construct($params = array()) {
            $this->success  = $params["success"] || false;
            $this->message  = $params["message"] || '';
            $this->data     = $params["data"]    || array();
        }
        public function to_json() {
            return json_encode(array(
                'success'   => $this->success,
                'message'   => $this->message,
                'data'      => $this->data
            ));
        }
    }

    /**
     * @class DB
     * Fake Database.  Stores records in $_SESSION
     */
    class DB {
        public function __construct() {
            if (!isset($_SESSION['pk'])) {
                $_SESSION['pk'] = 10;           // <-- start fake pks at 10
                $_SESSION['rs'] = getData();    // <-- populate $_SESSION with data.
            }
        }
        // fake a database pk
        public function pk() {
            return $_SESSION['pk']++;
        }
        // fake a resultset
        public function rs() {
            return $_SESSION['rs'];
        }
        public function insert($rec) {
            array_push($_SESSION['rs'], $rec);
        }
        public function update($idx, $attributes) {
            $_SESSION['rs'][$idx] = $attributes;
        }
        public function destroy($idx) {
            return array_shift(array_splice($_SESSION['rs'], $idx, 1));
        }
    }

    // Sample data.
    function getData() {
        return array(
            array('id' => 1, 'first' => "Fred", 'last' => 'Flintstone', 'email' => 'fred@flintstone.com'),
            array('id' => 2, 'first' => "Wilma", 'last' => 'Flintstone', 'email' => 'wilma@flintstone.com'),
            array('id' => 3, 'first' => "Pebbles", 'last' => 'Flintstone', 'email' => 'pebbles@flintstone.com'),
            array('id' => 4, 'first' => "Barney", 'last' => 'Rubble', 'email' => 'barney@rubble.com'),
            array('id' => 5, 'first' => "Betty", 'last' => 'Rubble', 'email' => 'betty@rubble.com'),
            array('id' => 6, 'first' => "BamBam", 'last' => 'Rubble', 'email' => 'bambam@rubble.com')
        );
    }
?>
