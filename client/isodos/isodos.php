<?php
// Εδώ ουσιαστικά φροντίζουμε να θέσουμε τα cookies με τα στοιχεία εισόδου.
// Πρόκειται για το login name και το κλειδί του skiser. Αμέσως μετά περνάμε
// στη βασική σελίδα της εφαρμογής.

require_once("../lib/standard.php");
session_start();
Globals::database();

// Επειδή μπορεί ο καθένας να τρέξει το παρόν με στοιχεία της αρεσκείας του,
// προβαίνουμε σε έλεγχο των στοιχείων στην database.

$query = "SELECT `pektis`, `klidi` FROM `sinedria` WHERE `pektis` = " .
	Globals::asfales_sql($_REQUEST["login"]) . " AND `klidi` = BINARY " .
	Globals::asfales_sql($_REQUEST["klidi"]);
$row = Globals::first_row($query, MYSQLI_NUM);
if ($row) {
	$_SESSION["pektis"] = $row[0];
	$_SESSION["klidi"] = $row[1];
}
else {
	unset($_SESSION["pektis"]);
	unset($_SESSION["klidi"]);
}
?>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="refresh" content="0; url=<? print Globals::$server; ?>" />
</head>
</html>
