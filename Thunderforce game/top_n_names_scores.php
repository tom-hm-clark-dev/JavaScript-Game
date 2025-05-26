<?php
    // Edel Sherratt October 2022
    // random leaderboard demo.
    // retrieve the top n (name, score)s from the database

    // number of rows to fetch
    if (array_key_exists("n", $_GET)) {
        $num_rows = $_GET["n"];
    } elseif (array_key_exists("N", $_GET)) {
        $num_rows = $_GET["N"];        
    } else {  
        $num_rows = 10; 
    }

    // open a connection to the database as a PDO
    require 'get_db_connection.php';
    $conn = get_db_connection();

    // a single query with no parameters, no need for a prepared statement
    $query = "select (name,score) from random_canvas_leaderboard order by score desc limit $num_rows";

    $result = $conn -> query($query);

    // pass an array of names and scores back to the JavaScript program
    echo json_encode($result->fetchAll(PDO::FETCH_COLUMN));

    // close the connection
    $conn = null;
?>
