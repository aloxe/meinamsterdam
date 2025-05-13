
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
echo "connected 1<br>";

$sql = "SELECT *  FROM dc_post WHERE post_id = 476";
$result = $conn->query($sql);

if ($result->num_rows > 0) {



  // output data of each row
  while($row = $result->fetch_assoc()) {



    //////////////////////////////////
    // find an image in the content
    $content = $row[post_content];
    $match_image = "/\(\(\/public\/images\/[0-9a-zA-Z-_.\/]*\/([0-9a-zA-Z-_.]*)(?:\|(.*))\|([A-Z]{1})\)\)/";

    $year = substr($row[post_dt], 0, 4);
    // echo dirname(__FILE__);
    if (!file_exists(dirname(__FILE__) . "/" . $year)) {
      mkdir(dirname(__FILE__) . "/" . $year, 0777, true);
      echo "<pre style='color: #33ff00'>";
      echo "FOLDER " . $year . " created";
      echo "</pre>";
    } else {
      echo "<pre style='color: #ffaa00'>";
      echo "FOLDER " . $year . " dejà là";
      echo "</pre>";
    }



    if ($year > 2013) {
      echo "<pre style='color: #0000ff'>";
      echo "recent" . $year . " No folder month";
      echo "</pre>";
      $folder = $year;
    } else {
      echo "old year ";
      $month = substr($row[post_dt], 5, 2);
      if (!file_exists(dirname(__FILE__) . "/" . $year . "/" . $month)) {
        mkdir(dirname(__FILE__) . "/" . $year . "/" . $month, 0777, true);
        echo "<pre style='color: #33ff00'>";
        echo "FOLDER " . $month . " created";
        echo "</pre>";
      } else {
        echo "<pre style='color: #ffaa00'>";
        echo "FOLDER " . $month . " dejà là";
        echo "</pre>";
      }
      $folder = $year . "/" . $month;
    }

    $month = substr($row[post_dt], 5, 2);
    echo "MONTH " . $month . ' c';
    // if (!file_exists(dirname(__FILE__) . $year)) {
    //   mkdir(dirname(__FILE__) . $year, 0777, true);
    // }



    // preg_match($match_image, $content, $matches);
    // echo "<pre style='color: #ff0000'>";
    // echo "MATCHES";
    // print_r($matches);
    // echo "</pre>";
    // $image = $matches[1];
    // if (!$matches[2]) $image_alt = "altimage"; else $image_alt = $matches[2];
    // $image_style = $matches[3];



    //////////////////////////////////
    // format content

    // images
    $cleancontent = preg_replace($match_image, '![$1]($2){.$3}', $content);
    $cleancontent = preg_replace("{\.C}", '{.center}', $cleancontent);
    // titles
    $cleancontent = preg_replace("/\!{3}(?: )?([\d\p{L}]{1})(.*)/", '### $1$2', $cleancontent);
    $cleancontent = preg_replace("/\!{2}(?: )?([\d\p{L}]{1})(.*)/", '## $1$2', $cleancontent);
    $cleancontent = preg_replace("/\!{1}(?: )?([\d\p{L}]{1})(.*)/", '# $1$2', $cleancontent);
    // styles italic bold
    $cleancontent = preg_replace("/\'\'(.*)\'\'/", '*$1*', $cleancontent);
    $cleancontent = preg_replace("/__(.*)__/", '**$1**', $cleancontent);

    echo "<pre style='width:100%; text-wrap: auto;'> =============================";
    echo "\ntitle: ". $row[post_title];
    echo "\ndescription: ". $row[post_excerpt];
    echo "\nimage: ". $image;
    echo "\nimage_alt: ". $image_alt;
    echo "\npermalink: ". $row[post_url];
    echo "\ndate: ". substr($row[post_dt], 0, 10);
    echo "\nupdate: ". substr($row[post_upddt], 0, 10);
    echo "\n---";
    echo "\n\n". $content;
    echo "</pre>";
    echo "<hr>";
  }
    // 
    //////////////////////////////////

    //////////////////////////////////
    // copy images in the file
    
    $match_image = "/\(\((\/public\/images\/[0-9a-zA-Z-_.\/]*\/[0-9a-zA-Z-_.]*)(?:\|(.*))\|([A-Z]{1})\)\)/";
    preg_match_all($match_image, $content, $matches);
    echo "<pre style='color: #ff00ff'>";
    echo "MATCHES";
    print_r($matches[1]);
    echo realpath($_SERVER["DOCUMENT_ROOT"]);
    echo "</pre>";
    for($i = 0; $i < count($matches[1]); $i++) {
      if (file_exists(realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i])) {
        echo $i." copy ". $matches[1][$i] . "<br>";
        $origin_file = realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i];
        $destination_file = dirname(__FILE__) . "/" . $folder . "/" . basename($matches[1][$i]);
        if (!copy($origin_file, $destination_file)) {
          echo "failed to copy $file...\n";
        } else {
          echo $i."· ". basename($matches[1][$i]) . " copied \o/ <br>";
        }
      } else {
        echo $i." ". $matches[1][$i] . "NOT exist not ";
      }
    }
    // 
    //////////////////////////////////

} else {
  echo "0 results";
}
$conn->close();
?> 

