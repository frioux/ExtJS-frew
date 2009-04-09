<?php
class Images {
    function load($data){
        $db = new SQLiteDatabase("sql/imgorg.db");
        $tag = $data->tag;
        $album = $data->album;
        $qry = 'select i.filename as filename, i.url as url, i.id as id from Images i';
        if ($tag) {
            $qry .= ' INNER JOIN Images_Tags it ON i.id = it.image_id WHERE it.tag_id ="'.$tag.'"';
        } elseif ($album) {
            $qry .= ' INNER JOIN Albums_Images ai ON i.id = ai.image_id WHERE ai.album_id ="'.$album.'"';
        }
        $res = $db->query($qry);
        return $res->fetchAll();
    }

    function upload($data, $files){
        $name = $files["Filedata"]["name"];
        $db = new SQLiteDatabase("sql/imgorg.db");
        $db->queryExec('INSERT INTO Images (filename, url) VALUES("'.$name.'","images/'.$name.'")');
        move_uploaded_file($files["Filedata"]["tmp_name"],"../../images/".$name);
        
        return array(data => $files["Filedata"]);
    }
    
    function addToAlbum($data) {
        $images = $data->images;
        $album = $data->album;
        $db = new SQLiteDatabase("sql/imgorg.db");
        for ($i = 0;$i < sizeof($images);$i++) {
            $db->queryExec('INSERT INTO Albums_Images (image_id, album_id) VALUES ("'.$images[$i].'","'.$album.'")');
        }
        return array(success => true, images => $images, album => $album);
    }
    
    function tagImage($data) {
        $images = $data->images;
        $tag = $data->tag;
        $db = new SQLiteDatabase("sql/imgorg.db");
        // if it is a known tag the id is sent, otherwise a new string is, so we need to insert
        if (!is_numeric($tag)) {
            $db->queryExec('INSERT INTO Tags (text) VALUES ("'.$tag.'")');
            $q = $db->query('SELECT id FROM Tags WHERE text = "'.$tag.'"');
            $tag = $q->fetchObject()->id;
        }
        for ($i = 0;$i < sizeof($images);$i++) {
            $db->queryExec('INSERT INTO Images_Tags (image_id, tag_id) VALUES ("'.$images[$i].'","'.$tag.'")');
        }
        return array(success => true, images => $images, tag => $tag);
    }
    
    function rename($data) {
        $db = new SQLiteDatabase("sql/imgorg.db");
        $image = $data->image;
        $name = $data->name;
        $url = $data->url;
        $urls = split('/',$url);
        array_pop($urls);
        $newUrl = (join('/',$urls)).'/'.$name;
        
        $db->queryExec('UPDATE Images SET url = "'.$newUrl.'", filename = "'.$name.'" WHERE id = "'.$image.'"');
        rename('../'.$url, '../'.$newUrl);
        
        return array(image => $image, name => $name, url => $newUrl);
    }
    
    function remove($data) {
        $db = new SQLiteDatabase("sql/imgorg.db");
        $images = $data->images;
        for ($i = 0;$i < sizeof($images);$i++) {
            $res = $db->query('SELECT url FROM Images where id ="'.$images[$i].'"');
            $url = $res->fetchObject()->url;
            unlink('../'.$url);
            $db->queryExec('DELETE FROM Images WHERE id ="'.$images[$i].'"');
            $db->queryExec('DELETE FROM Images_Tags WHERE image_id ="'.$images[$i].'"');
            $db->queryExec('DELETE FROM Albums_Images WHERE image_id ="'.$images[$i].'"');
        }
    }
}
?>