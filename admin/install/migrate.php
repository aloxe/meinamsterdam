
migrate.php 
<?php

// scp -P 2322 admin/install/migrate.php alx@s2.lib.re:~/domains/meinamsterdam.nl/public_html/admin/install/ 

$servername = "localhost";
$username = 'root';
$password = "apoijTpiHy6h6tFA";
$dbname = 'meinamsterdam';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "connected<br>";

// $sql = "SELECT *  FROM dc_post WHERE post_id = 476";
// $sql = "SELECT *  FROM dc_post WHERE post_id = 468";
// $sql = "SELECT *  FROM dc_post WHERE post_id = 1";
$sql = "SELECT *  FROM dc_post WHERE post_id BETWEEN 1 AND 100";
$result = $conn->query($sql);

if ($result->num_rows > 0) {



  // output data of each row
  while($row = $result->fetch_assoc()) {



    //////////////////////////////////
    // find folder name (year and month)

    $year = substr($row[post_dt], 0, 4);
    // echo dirname(__FILE__);
    if (!file_exists(dirname(__FILE__) . "/pages/" . $year)) {
      mkdir(dirname(__FILE__) . "/pages/" . $year, 0777, true);
      echo "<pre style='color: #226600'>";
      echo "FOLDER " . $year . " created";
      echo "</pre>";
    } else {
      echo "<pre style='color: #cc6600'>";
      echo "FOLDER " . $year . " dejà là";
      echo "</pre>";
    }

    if ($year > 2013) {
      echo "<pre style='color: #0000ff'>";
      echo "recent" . $year . " No folder month";
      echo "</pre>";
      $folder = $year;
    } else {

      $month = substr($row[post_dt], 5, 2);
      if (!file_exists(dirname(__FILE__) . "/pages/" . $year . "/" . $month)) {
        mkdir(dirname(__FILE__) . "/pages/" . $year . "/" . $month, 0777, true);
        echo "<pre style='color: #226600'>";
        echo "FOLDER " . $month . " created";
        echo "</pre>";
      } else {
        echo "<pre style='color: #cc6600'>";
        echo "FOLDER " . $month . " dejà là";
        echo "</pre>";
      }
      $folder = $year . "/" . $month;
    }
    $folder = "pages/" . $folder;

    // 
    //////////////////////////////////

    // echo "<pre style='color: #669933'>";
    // print_r($row);
    // echo "</pre>";
    
    //////////////////////////////////
    // format content
    $content = $row[post_excerpt] . "\n\n" . $row[post_content];

    // images
    $match_image = "/\(\(\/public\/images\/[0-9a-zA-Z-_.\/]*\/([0-9a-zA-Z-_.]*)(?:\|([^|\]]*))?(?:\|([A-Z]{1}))?(?:\|(?:[^|\]]*))?\)\)/";
    $cleancontent = preg_replace($match_image, '![$1]($2){.$3}', $content);
    $match_remote_image = "/\(\((http[s]?\:\/\/[0-9a-zA-Z-_.\/]*\/[0-9a-zA-Z-_.]*)(?:\|([^|\]]*))?(?:\|([A-Z]{1}))?(?:\|(?:[^|\]]*))?\)\)/";
    $cleancontent = preg_replace($match_remote_image, '![$1]($2){.$3}', $cleancontent);
    $cleancontent = str_replace("]()", "](TODO: ALTIMAGE)", $cleancontent);
    $cleancontent = str_replace("{.C}", "{.center}", $cleancontent);
    $cleancontent = str_replace("{.L}", "{.left}", $cleancontent);
    $cleancontent = str_replace("{.R}", "{.right}", $cleancontent);
    $cleancontent = str_replace("{.}", "", $cleancontent);

    // titles
    $cleancontent = preg_replace("/\!{3}(?: )?([\d\p{L}]{1})(.*)/", '### $1$2', $cleancontent);
    $cleancontent = preg_replace("/\!{2}(?: )?([\d\p{L}]{1})(.*)/", '## $1$2', $cleancontent);
    $cleancontent = preg_replace("/\!{1}(?: )?([\d\p{L}]{1})(.*)/", '# $1$2', $cleancontent);

    // styles italic bold
    $cleancontent = preg_replace("/\'\'([^']*)\'\'/", '*$1*', $cleancontent);
    $cleancontent = preg_replace("/__([^_]*)__/", '**$1**', $cleancontent);

    // links
    $cleancontent = preg_replace("/\[([^|\]]+)\|([^|\]]+)(\|[a-z]{2})?\]/", '[$1]($2)', $cleancontent);

    // html clean
    $cleancontent = str_replace("%%%", "\n\n", $cleancontent);
    $cleancontent = str_replace("///html", "<!-- HTML -->", $cleancontent);
    $cleancontent = str_replace("///", "<!-- / HTML -->", $cleancontent);


    echo "<pre style='width:100%; text-wrap: auto;'> ==========↓ ".$row[post_id]." ↓===================";
    echo "\ntitle: ". $row[post_title];
    echo "\ndescription: ". $row[post_excerpt];
    echo "\nimage: ". $image;
    echo "\nimage_alt: ". $image_alt;
    echo "\npermalink: ". $row[post_url];
    echo "\ndate: ". substr($row[post_dt], 0, 10);
    echo "\nupdate: ". substr($row[post_upddt], 0, 10);
    echo "\n---";
    echo "\n\n". $cleancontent;
    echo "\n ==========↑ ".$row[post_id]." ↑===================</pre>";
    // 
    //////////////////////////////////

    //////////////////////////////////
    // copy images in the file
    
    // different catch $1
    // also not copying remot files
    $match_image = "/\(\((\/public\/images\/[0-9a-zA-Z-_.\/]*\/[0-9a-zA-Z-_.]*)(?:\|([^|\]]*))?(?:\|([A-Z]{1}))?\)\)/";
    preg_match_all($match_image, $content, $matches);
    // echo "<pre style='color: #cc00ff'>";
    // print_r($matches);
    // echo "</pre>";
    for($i = 0; $i < count($matches[1]); $i++) {
      if (file_exists(realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i])) {
        $origin_file = realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i];
        $destination_file = dirname(__FILE__) . "/" . $folder . "/" . basename($matches[1][$i]);
        if (!copy($origin_file, $destination_file)) {
          echo "<pre style='color: #aa0000'>";
          echo "failed to copy $origin_file...\n";
          echo "</pre>";
        } else {
          echo "<pre style='color: #669900'>";
          echo $i."· ". basename($matches[1][$i]) . " copied \o/";
          echo "</pre>";
        }
      } else {
        echo "<pre style='color: #660000'>";
        echo $i." ". $matches[1][$i] . " Exists not " . realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i];
        echo "</pre>";
      }
    }
    // 
    //////////////////////////////////
    echo "<hr>";
  }
} else {
  echo "0 results";
}
$conn->close();
?> 

