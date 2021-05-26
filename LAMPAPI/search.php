<?php
  require ('./lib/db.php');

  //Get Request Data
  $reqData = getRequestInfo();
  //User will search by either first and last name/phone/address
  $search = $reqData["search"];
  $u_id = $reqData["u_id"];

  $conn = new mysqli($server, $dbUsername, $dbPassword, $dbname);
  if($conn->connect_error){
    returnError($conn->connect_error);
  }else{
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Contacts.u_id=?
      AND ((Contacts.fname LIKE %?% OR Contacts.lname LIKE %?%)
      OR Contacts.phone LIKE %?% OR Contacts.address LIKE %?%)");
    $stmt->bind_param("issss", $u_id, $search, $search, $search, $search);
    $execResult = $stmt->execute();

    if( false===$execResult ){
      returnError( $stmt->error );
    }

    $result = $stmt->get_result();
    $searchResult = "";
    $searchCount = 0;
    
    while($row = $result->fetch_assoc()){
      if($searchCount > 0){
        $searchResult .= ",";
      }
      $searchResult .= json_encode($row);
    }

    if($searchCount == 0){
      returnError("No Results Found");
    }else{
      returnInfo($searchResult);
    }
    
    $stmt->close();
    $conn->close();
  }

    function getRequestInfo (){
      return json_decode(file_get_contents('php://input'), true);
    }
  
    function sendResponse ( $response ){
      header('Content-type: application/json');
      echo $response;
    }

    function returnInfo( $searchResult ){
      $finalRes = '{"results":[' . $searchResult . ']}';
      printf("%s", $finalRes)
      sendResponse($finalRes);
    }
  
    function returnError ( $err ){
      $returnValue = '{"error":"' . $err . '"}';
      sendResponse($returnValue);
    }
?>