
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
    $todo = "";

    //////////////////////////////////
    // copy images in the file
    
    $content = $row[post_excerpt] . "\n\n" . $row[post_content];

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

          if ($i == 0) {
            $image = pathinfo($matches[1][0], PATHINFO_BASENAME);
            $imagealt = $matches[2][0];
            echo $image . " " . $imagealt . " ←←←←←";
          }
          echo "</pre>";
        }
      } else {
        echo "<pre style='color: #660000'>";
        echo $i." ". $matches[1][$i] . " Exists not " . realpath($_SERVER["DOCUMENT_ROOT"]).$matches[1][$i];
        echo "</pre>";
      }
    }

    if (!$image) {
      $todo = $todo . "[no image] ";
    }
    if (!$imagealt) {
      $todo = $todo . "[no image alt] ";
    }
    // 
    //////////////////////////////////


    //////////////////////////////////
    // format content
    $description = $row[post_excerpt];
    $description = preg_replace("/\(\(([^)]*)\)\)/", "", $description); // images
    $description = preg_replace("/\[([^|\]]+)\|([^|\]]+)(\|[a-z]{2})?\]/", '$1', $description); // links
    $description = preg_replace("/\!{1,3}(?: )?([\d\p{L}]{1})(.*)/", '$1', $description); // titles
    $description = preg_replace("/\'\'([^']*)\'\'/", '$1', $description); // styles
    $description = preg_replace("/__([^_]*)__/", '$1', $description); // styles
    $description = preg_replace("/\[([^|\]]+)\|([^|\]]+)(\|[a-z]{2})?\]/", '[$1]($2)', $description);  // links
    $description = str_replace("\n", " ", $description);
    $description = str_replace("\r", " ", $description);
    $shortdescription = substr($description, 0, 160);
    if (strcmp($description, $shortdescription)) {
      $todo = $todo . "[shortened desc] ";
    }

    // images (new match to remove path)
    $match_image = "/\(\(\/public\/images\/[0-9a-zA-Z-_.\/]*\/([0-9a-zA-Z-_.]*)(?:\|([^|\]]*))?(?:\|([A-Z]{1}))?(?:\|(?:[^|\]]*))?\)\)/";
    $cleancontent = preg_replace($match_image, '![$1]($2){.$3}', $content);
    $match_remote_image = "/\(\((http[s]?\:\/\/[0-9a-zA-Z-_.\/]*\/[0-9a-zA-Z-_.]*)(?:\|([^|\]]*))?(?:\|([A-Z]{1}))?(?:\|(?:[^|\]]*))?\)\)/";
    $cleancontent = preg_replace($match_remote_image, '![$1]($2){.$3}', $cleancontent);
    $cleancontent = str_replace("]()", "]()<!-- TODO: Add image alt -->", $cleancontent);
    $cleancontent = str_replace("{.C}", "{.center}", $cleancontent);
    $cleancontent = str_replace("{.L}", "{.left}", $cleancontent);
    $cleancontent = str_replace("{.R}", "{.right}", $cleancontent);
    $cleancontent = str_replace("{.}", "", $cleancontent);

    // titles
    $cleancontent = preg_replace("/\!{3}(?: )?([\d\p{L}]{1})(.*)/", '### $1$2', $cleancontent);
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

    $fullcontent = "title: ". $row[post_title];
    $fullcontent .= "\ndescription: ". $shortdescription;
    $fullcontent .=  "\ntitle: ". $row[post_title];
    $fullcontent .=  "\ndescription: ". $shortdescription;
    $fullcontent .=  "\nimage: ". $image;
    $fullcontent .=  "\nimage_alt: ". $imagealt;
    $fullcontent .=  "\npermalink: ". $row[post_url];
    $fullcontent .=  "\ndate: ". substr($row[post_dt], 0, 10);
    $fullcontent .=  "\nupdate: ". substr($row[post_upddt], 0, 10);
    if ($todo) { $fullcontent .=  "\nTODO: ". $todo; }
    $fullcontent .=   "\n---";
    $fullcontent .=   "\n\n". $cleancontent;

    echo "<pre style='width:100%; text-wrap: auto;'> ==========↓ ".$row[post_id]." ↓===================";
    echo "\n";
    echo $fullcontent;
    // echo "\ntitle: ". $row[post_title];
    // echo "\ndescription: ". $shortdescription;
    // echo "\nimage: ". $image;
    // echo "\nimage_alt: ". $imagealt;
    // echo "\npermalink: ". $row[post_url];
    // echo "\ndate: ". substr($row[post_dt], 0, 10);
    // echo "\nupdate: ". substr($row[post_upddt], 0, 10);
    // if ($todo) { echo "\nTODO: ". $todo; }
    // echo "\n---";
    // echo "\n\n". $cleancontent;
    echo "\n ==========↑ ".$row[post_id]." ↑↑↑===================</pre>";
    // 
    //////////////////////////////////

    //////////////////////////////////
    // save content
    $filename = dirname(__FILE__) . "/" . $folder . "/" . $row[post_url] . ".md";
    file_put_contents($filename, $fullcontent);
    echo "<b> ↑ ".$filename." copied</b>";
    echo "<hr>";
    // 
    //////////////////////////////////
  }
} else {
  echo "0 results";
}
$conn->close();
?> 

