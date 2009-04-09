<?php
class Tags {
    function load($data){
        $db = new SQLiteDatabase('sql/imgorg.db');
        // use $query for type-ahead
        $query = $data->query;
        
        $qryStr = 'SELECT * FROM Tags';
        if ($query) {
            $qryStr .= ' where text like "'.$query.'%"';
        }
        $q = $db->query($qryStr);
        return $q->fetchAll();
    }
}
?>