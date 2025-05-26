<?php
    // Edel Sherratt October 2022
    // returns a PHP data object (PDO)
    
    require // path to cs25320_db_secrets.php

        'cs25320_db_secrets.php';              // Faculty Linux, also central, central is /aber/eds
        // 'M:\PHP\cs25320_db_secrets.php';                     // Inf. services Windows, central is M:
        //'/home/Edel/central_eds/PHP/cs25320_db_secrets.php'; // hp-enfys, central is mounted at /home/Edelcentral_eds

    function get_db_connection() {

        $data_source_name = DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME;

        try {

            return new PDO($data_source_name, DB_USER, DB_PASSWORD);

        } catch (PDOException $e) {

            // could do something more useful here
            echo "couldn't get a handle on the database ".$e."\n";
            return NULL;
        }
    }
?>
