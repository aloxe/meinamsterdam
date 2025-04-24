
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

$sql = "SELECT *  FROM dc_post WHERE post_id = 476";
$result = $conn->query($sql);

if ($result->num_rows > 0) {



  // output data of each row
  while($row = $result->fetch_assoc()) {

    $content = $row[post_content];


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
        $destination_file = dirname(__FILE__) . "/" . basename($matches[1][$i]);
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

    $content = $row[post_content];
    $match_image = "/\(\(\/public\/images\/[0-9a-zA-Z-_.\/]*\/([0-9a-zA-Z-_.]*)(?:\|(.*))\|([A-Z]{1})\)\)/";

  
    preg_match($match_image, $content, $matches);
    echo "<pre style='color: #ff0000'>";
    echo "MATCHES";
    print_r($matches);
    echo "</pre>";
    $image = $matches[1];
    if (!$matches[2]) $image_alt = "altimage"; else $image_alt = $matches[2];
    $image_style = $matches[3];

    // images
    $content = preg_replace($match_image, '![$1]($2){.$3}', $content);
    // titles
    $content = preg_replace("/\!{3}(?: )?([\d\p{L}]{1})(.*)/", '### $1$2', $content);
    $content = preg_replace("/\!{2}(?: )?([\d\p{L}]{1})(.*)/", '## $1$2', $content);
    $content = preg_replace("/\!{1}(?: )?([\d\p{L}]{1})(.*)/", '# $1$2', $content);
    // styles
    $content = preg_replace("/\'\'(.*)\'\'/", '*$1*', $content);
    $content = preg_replace("/__(.*)__/", '**$1**', $content);


    echo "<pre>FRONTMATER";
    echo "\ntitle: ". $row[post_title];
    echo "\ndescription: ". $row[post_excerpt];
    echo "\nimage: ". $image;
    echo "\nimage_alt: ". $image_alt;
    echo "\npermalink: ". $row[post_url];
    echo "\ndate: ". $row[post_dt];
    echo "\nupdate: ". $row[post_upddt];  
    echo "\n---";
    echo "\n\n". $content;
    echo "</pre>";
    echo "<hr>";
  }
} else {
  echo "0 results";
}
$conn->close();
?> 

