

<?php

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

$sql = "SELECT *  FROM dc_post WHERE post_id > 766";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
   echo "mam";
// output data of each row
  while($row = $result->fetch_assoc()) {
  echo "<pre>FRONTMATER";
  echo "\ntitle: ". $row[post_title];
  echo "\ndescription: ". $row[post_excerpt];
  echo "\nimage: ";
  echo "\npermalink: ". $row[post_url];
  echo "\ndate: ". $row[post_dt];
  echo "\nupdate: ". $row[post_upddt];  
  echo "\n---";
  echo "\n\n".$row[post_content];
    echo "</pre>";
    echo "<hr>";
  }
} else {
  echo "0 results";
}
$conn->close();
?> 

