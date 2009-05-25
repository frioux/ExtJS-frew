<?php

/**
 * @class Request
 */
class Request {
    public $restful, $method, $id, $params;
    public function __construct($params) {
        $this->restful = (isset($params["restful"])) ? $params["restful"] : false;
        $this->method = $_SERVER["REQUEST_METHOD"];
        $this->parseRequest();
    }
    public function isRestful() {
        return $this->restful;
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
        if (isset($_SERVER["PATH_INFO"])){
            $id = array_pop(split('/', $_SERVER["PATH_INFO"]));
            $this->id = (is_numeric($id)) ? $id : null;
        }
    }
}
?>
