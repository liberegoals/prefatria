<?php
class Pektis {
	public $login;
	public $onoma;
	public $email;
	public $kodikos;

	function __construct($login, $kodikos = NULL) {
		$query = "SELECT * FROM `pektis` WHERE (`login` LIKE " . Globals::asfales_sql($login) . ")";

		if ($kodikos !== NULL)
		$query .= " AND (`kodikos` LIKE BINARY " . Globals::asfales_sql(sha1($kodikos)) . ")";

		$result = Globals::$db->query($query);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		$result->free();
		if (!$row) return;

		foreach($row as $col => $val) {
			$this->$col = $val;
		}
	}
}
?>
