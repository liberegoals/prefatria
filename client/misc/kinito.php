<?php
require_once "../lib/standard.php";
session_start();

if (Globals::perastike("energo")) $_SESSION["kinito"] = 1;
else unset($_SESSION["kinito"]);
Globals::klise_fige();
?>
