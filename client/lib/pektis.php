<?php
class Pektis {
	public $login;
	public $onoma;
	public $email;
	public $kodikos;
	public $peparam;

	public function __construct($login, $kodikos = NULL) {
		$peparam = array();
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

	public function peparam_fetch() {
		if (!isset($this->login))
		return $this;

		$this->peparam = array();
		$query = "SELECT `param`, `timi` FROM `peparam` WHERE `pektis` LIKE " .
			Globals::asfales_sql($_SESSION["pektis"]);
		$res = Globals::query($query);
		while ($row = $res->fetch_array(MYSQLI_NUM)) {
			$this->peparam[$row[0]] = $row[1];
		}

		$res->free();
		return $this;
	}

	public function is_developer() {
		if (!isset($this->peparam))
		return FALSE;

		$idx = "DEVELOPER";
		if (!array_key_exists($idx, $this->peparam))
		return FALSE;

		return($this->peparam[$idx] === "ΝΑΙ");
	}
}
?>
