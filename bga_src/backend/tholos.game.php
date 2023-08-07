<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Tholos implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * tholos.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 *
 */

require_once APP_GAMEMODULE_PATH . 'module/table/table.game.php';

class Tholos extends Table
{
  function __construct()
  {
    // Your global variables labels:
    //  Here, you can assign labels to global variables you are using for this game.
    //  You can use any number of global variables with IDs between 10 and 99.
    //  If your game has options (variants), you also have to associate here a label to
    //  the corresponding ID in gameoptions.inc.php.
    // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
    parent::__construct();

    self::initGameStateLabels([
      //    "my_first_global_variable" => 10,
      //    "my_second_global_variable" => 11,
      //      ...
      //    "my_first_game_variant" => 100,
      //    "my_second_game_variant" => 101,
      //      ...
    ]);
  }

  protected function getGameName()
  {
    // Used for translations and stuff. Please do not modify.
    return 'tholos';
  }

  /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
  protected function setupNewGame($players, $options = [])
  {
    // Set the colors of the players with HTML color code
    // The default below is red/green/blue/orange/brown
    // The number of colors defined here must correspond to the maximum number of players allowed for the gams
    $gameinfos = self::getGameinfos();
    $default_colors = $gameinfos['player_colors'];

    // Create players
    // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
    $sql =
      'INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ';
    $values = [];
    foreach ($players as $player_id => $player) {
      $color = array_shift($default_colors);
      $values[] =
        "('" .
        $player_id .
        "','$color','" .
        $player['player_canal'] .
        "','" .
        addslashes($player['player_name']) .
        "','" .
        addslashes($player['player_avatar']) .
        "')";
    }
    $sql .= implode(',', $values);
    self::DbQuery($sql);
    self::reattributeColorsBasedOnPreferences(
      $players,
      $gameinfos['player_colors']
    );
    self::reloadPlayersBasicInfos();

    /************ Start the game initialization *****/

    // Init global values with their initial values
    //self::setGameStateInitialValue( 'my_first_global_variable', 0 );

    // Init game statistics
    // (note: statistics used in this file must be defined in your stats.inc.php file)
    //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
    //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

    // TODO: setup the initial game situation here

    // Update quarry data
    $sql = "INSERT INTO quarry (color, count) VALUES ('white', 13)";
    self::DbQuery($sql);
    $sql = "INSERT INTO quarry (color, count) VALUES ('gray', 10)";
    self::DbQuery($sql);
    $sql = "INSERT INTO quarry (color, count) VALUES ('black', 13)";
    self::DbQuery($sql);

    // update workshop data
    $sql = "INSERT INTO workshop (ws, color) VALUES ('white', 'white')";
    self::DbQuery($sql);
    $sql = "INSERT INTO workshop (ws, color) VALUES ('white', 'white')";
    self::DbQuery($sql);
    $sql = "INSERT INTO workshop (ws, color) VALUES ('black', 'black')";
    self::DbQuery($sql);
    $sql = "INSERT INTO workshop (ws, color) VALUES ('black', 'black')";
    self::DbQuery($sql);

    // NOTE: Nothing to do with mainBoard

    // Activate first player (which is in general a good idea :) )
    $this->activeNextPlayer();

    /************ End of the game initialization *****/
  }

  /*
        getAllDatas:

        Gather all informations about current game situation (visible by the current player).

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
  protected function getAllDatas()
  {
    $result = [];

    $current_player_id = self::getCurrentPlayerId(); // !! We must only return informations visible by this player !!

    // Get information about players
    // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
    $sql = 'SELECT player_id id, player_score score FROM player ';
    $result['players'] = self::getCollectionFromDb($sql);

    // TODO: Gather all information about current game situation (visible by player $current_player_id).
    $sql = 'SELECT * from quarry';
    $result['quarry'] = self::getCollectionFromDb($sql);

    $sql = 'SELECT * from workshop';
    $result['workshop'] = self::getCollectionFromDb($sql);

    $sql = 'SELECT * from mainBoard';
    $result['mainBoard'] = self::getCollectionFromDb($sql);

    $result['playerSide'] = $this->getPlayerSide($current_player_id);

    return $result;
  }

  /*
        getGameProgression:

        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).

        This method is called each time we are in a game state with the "updateGameProgression" property set to true
        (see states.inc.php)
    */
  function getGameProgression()
  {
    // TODO: compute and return the game progression

    return 0;
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Utility functions
  ////////////

  /*
        In this space, you can put any utility methods useful for your game logic
    */

  function getPlayerSide($playerID)
  {
    $sql = "SELECT player_no from player where player_id='" . $playerID . "'";
    $playerNo = self::getUniqueValueFromDB($sql);

    if ($playerNo == 1) {
      return 'white';
    }
    if ($playerNo == 2) {
      return 'black';
    }

    die('ok');
  }

  function getActivePlayerSide()
  {
    $apid = self::getActivePlayerId();
    return $this->getPlayerSide($apid);
  }

  function getLocationName($idx)
  {
    if ($idx == 0) {
      return 'α';
    }
    if ($idx == 1) {
      return 'β';
    }
    if ($idx == 2) {
      return 'γ';
    }
    if ($idx == 3) {
      return 'δ';
    }
    if ($idx == 4) {
      return 'π';
    }
    if ($idx == 5) {
      return 'Σ';
    }
    if ($idx == 6) {
      return 'Ω';
    }

    die('ok');
  }

  function applyBonusAction($target0, $target1, $target2)
  {
    $t0 = intval($target0);
    self::dump('$t0', $t0);
    switch ($t0) {
      case 0:
        // move gray stone from $t1 to $t2
        $t1 = intval($target1);
        $t2 = intval($target2);
        $this->_moveStone($t1, $t2, 'gray');
        break;
      case 2:
        // remove the top stone from t1
        $t1 = intval($target1);
        $this->_removeStone($t1);
        break;
      case 3:
        // take stone from quarry
        $color = $target1;
        $this->_takeStone($color);
        break;
      case 4:
        // take stone from quarry
        $color = $target1;
        $this->_stealStone($color);
        break;
    }
  }

  function notifyBonusAction($side, $target0, $target1, $target2)
  {
    $t0 = intval($target0);
    self::dump('$t0', $t0);
    switch ($t0) {
      case 0:
        $t1 = intval($target1);
        $t2 = intval($target2);
        self::notifyAllPlayers(
          'moveStone',
          clienttranslate(
            '[Bonus Action] ${player_name} moved a gray stone from the column ${from_name} to the column ${to_name}.'
          ),
          [
            'player_side' => $side,
            'player_name' => self::getActivePlayerName(),
            'from' => $t1,
            'from_name' => $this->getLocationName($t1),
            'to' => $t2,
            'to_name' => $this->getLocationName($t2),
          ]
        );
        break;

      case 2:
        $t1 = intval($target1);
        self::notifyAllPlayers(
          'removeStone',
          clienttranslate(
            '[Bonus Action] ${player_name} returned the top stone of the column ${from_name} back to the quarry.'
          ),
          [
            'player_side' => $side,
            'player_name' => self::getActivePlayerName(),
            'from' => $t1,
            'from_name' => $this->getLocationName($t1),
          ]
        );
        break;

      case 3:
        $color = $target1;
        self::notifyAllPlayers(
          'takeStone',
          clienttranslate(
            '[Bonus Action] ${player_name} took a ${color} stone from the quarry.'
          ),
          [
            'player_side' => $side,
            'player_name' => self::getActivePlayerName(),
            'color' => $color,
            'count' => 1,
          ]
        );
        break;

      case 4:
        $color = $target1;
        self::notifyAllPlayers(
          'stealStone',
          clienttranslate(
            '[Bonus Action] ${player_name} stole a ${color} stone from the workshop.'
          ),
          [
            'player_side' => $side,
            'player_name' => self::getActivePlayerName(),
            'color' => $color,
          ]
        );
        break;
    }
  }

  function _moveStone($from, $to, $color)
  {
    // Do delete then insert to increment the index
    $sql =
      'DELETE FROM mainBoard WHERE location=' .
      $from .
      " AND color='" .
      $color .
      "'" .
      ' ORDER BY id desc LIMIT 1';
    self::DbQuery($sql);

    $sql =
      "INSERT INTO mainBoard(location, color) VALUES('" .
      $to .
      "', '" .
      $color .
      "')";
    self::DbQuery($sql);
  }

  function _removeStone($from)
  {
    // get color / num first and refill quarry
    $sql =
      'SELECT color FROM mainBoard WHERE location=' .
      $from .
      ' ORDER BY id desc LIMIT 1';
    $color = self::getUniqueValueFromDB($sql);

    $sql = "SELECT count FROM quarry WHERE color='" . $color . "'";
    $num = intval(self::getUniqueValueFromDB($sql));

    // Delete
    $sql =
      'DELETE FROM mainBoard WHERE location=' .
      $from .
      ' ORDER BY id desc LIMIT 1';
    self::DbQuery($sql);

    // Refill
    $sql =
      'UPDATE quarry SET count=' . ($num + 1) . " WHERE color='" . $color . "'";
    self::DbQuery($sql);
  }

  function _takeStone($color, $count = 1)
  {
    $side = $this->getActivePlayerSide();

    // update quarry
    $sql = "SELECT count FROM quarry WHERE color='" . $color . "'";
    $remains = intval(self::getUniqueValueFromDB($sql)) - $count;
    $sql =
      'UPDATE quarry SET count=' . $remains . " WHERE color='" . $color . "'";
    self::DbQuery($sql);

    // update workshop
    for ($i = 1; $i <= intval($count); $i++) {
      $sql =
        "INSERT INTO workshop(ws, color) VALUES ('" .
        $side .
        "', '" .
        $color .
        "')";
      self::DbQuery($sql);
    }
  }

  function _stealStone($color)
  {
    $side = $this->getActivePlayerSide();

    // update workshop (victim)
    $sql =
      "DELETE FROM workshop WHERE ws<>'" .
      $side .
      "' AND color='" .
      $color .
      "' LIMIT 1";
    self::DbQuery($sql);

    // update workshop (active player)
    $sql =
      "INSERT INTO workshop(ws, color) VALUES ('" .
      $side .
      "', '" .
      $color .
      "')";
    self::DbQuery($sql);
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Player actions
  ////////////

  /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in tholos.action.php)
    */

  /*

    Example:

    function playCard( $card_id )
    {
        // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        self::checkAction( 'playCard' );

        $player_id = self::getActivePlayerId();

        // Add your game logic to play a card there
        ...

        // Notify all players about the card played
        self::notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
            'player_id' => $player_id,
            'player_name' => self::getActivePlayerName(),
            'card_name' => $card_name,
            'card_id' => $card_id
        ) );

    }

    */

  function takeStone($color, $count)
  {
    self::checkAction('takeStone');
    $side = $this->getActivePlayerSide();

    // FIXME: input check logic
    // both stone count in quarry & stone count in workshop.

    $this->_takeStone($color, intval($count));

    self::notifyAllPlayers(
      'takeStone',
      clienttranslate(
        '${player_name} took ${count} of ${color} stone(s) from the quarry.'
      ),
      [
        'player_side' => $side,
        'player_name' => self::getActivePlayerName(),
        'color' => $color,
        'count' => $count,
      ]
    );

    $this->gamestate->nextState('nextPlayer');
  }

  function placeStone($color, $bonusAction, $target0, $target1, $target2)
  {
    self::checkAction('placeStone');
    $side = $this->getActivePlayerSide();

    // FIXME: input check logic

    // update workshop
    $sql =
      "DELETE FROM workshop WHERE color = '" .
      $color .
      "' AND ws = '" .
      $side .
      "' LIMIT 1";
    self::DbQuery($sql);

    // bonus action
    if ($bonusAction) {
      $this->applyBonusAction($target0, $target1, $target2);
    }

    // update mainboard
    $sql =
      "INSERT INTO mainBoard(location, color) VALUES('" .
      $target0 .
      "', '" .
      $color .
      "')";
    self::DbQuery($sql);

    // notify
    $locationName = $this->getLocationName($target0);
    self::notifyAllPlayers(
      'placeStone',
      clienttranslate(
        '${player_name} placed a ${color} stone on ${locationName}.'
      ),
      [
        'player_side' => $side,
        'player_name' => self::getActivePlayerName(),
        'color' => $color,
        'target' => $target0,
        'locationName' => $locationName,
        'bonusAction' => $bonusAction,
      ]
    );

    // notify for bonus action (it should be later than main action)
    if ($bonusAction) {
      $this->notifyBonusAction($side, $target0, $target1, $target2);
    }

    $this->gamestate->nextState('nextPlayer');
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Game state arguments
  ////////////

  /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

  /*

    Example for game state "MyGameState":

    function argMyGameState()
    {
        // Get some values from the current game situation in database...

        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }
    */

  //////////////////////////////////////////////////////////////////////////////
  //////////// Game state actions
  ////////////

  /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

  function stNextPlayer()
  {
    $playerID = self::activeNextPlayer();
    self::giveExtraTime($playerID);
    $this->gamestate->nextState('playerTurn');

    // FIXME: if all columns are full, go end game state.
    // $this->gamestate->nextState("endGame");
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Zombie
  ////////////

  /*
        zombieTurn:

        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).

        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message.
    */

  function zombieTurn($state, $active_player)
  {
    $statename = $state['name'];

    if ($state['type'] === 'activeplayer') {
      switch ($statename) {
        default:
          $this->gamestate->nextState('zombiePass');
          break;
      }

      return;
    }

    if ($state['type'] === 'multipleactiveplayer') {
      // Make sure player is in a non blocking status for role turn
      $this->gamestate->setPlayerNonMultiactive($active_player, '');

      return;
    }

    throw new feException(
      'Zombie mode not supported at this game state: ' . $statename
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////:
  ////////// DB upgrade
  //////////

  /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

  function upgradeTableDb($from_version)
  {
    // $from_version is the current version of this game database, in numerical form.
    // For example, if the game was running with a release of your game named "140430-1345",
    // $from_version is equal to 1404301345

    // Example:
    //        if( $from_version <= 1404301345 )
    //        {
    //            // ! important ! Use DBPREFIX_<table_name> for all tables
    //
    //            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
    //            self::applyDbUpgradeToAllDB( $sql );
    //        }
    //        if( $from_version <= 1405061421 )
    //        {
    //            // ! important ! Use DBPREFIX_<table_name> for all tables
    //
    //            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
    //            self::applyDbUpgradeToAllDB( $sql );
    //        }
    //        // Please add your future database scheme changes here
    //
    //
  }
}
