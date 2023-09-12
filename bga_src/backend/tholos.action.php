<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Tholos implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 *
 * tholos.action.php
 *
 * Tholos main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/tholos/tholos/myAction.html", ...)
 *
 */

class action_tholos extends APP_GameAction
{
  // Constructor: please do not modify
  public function __default()
  {
    if (self::isArg('notifwindow')) {
      $this->view = 'common_notifwindow';
      $this->viewArgs['table'] = self::getArg('table', AT_posint, true);
    } else {
      $this->view = 'tholos_tholos';
      self::trace('Complete reinitialization of board game');
    }
  }

  public function takeStone()
  {
    self::setAjaxMode();
    $color = self::getArg('color', AT_alphanum, true);
    $count = self::getArg('count', AT_posint, true);

    $this->game->takeStone($color, $count);
    self::ajaxResponse();
  }

  public function placeStone()
  {
    self::setAjaxMode();
    $color = self::getArg('color', AT_alphanum, true);
    $bonusAction = self::getArg('bonusAction', AT_bool, true);
    $target0 = self::getArg('target0', AT_posint, true);
    $target1 = self::getArg('target1', AT_alphanum, false);
    $target2 = self::getArg('target2', AT_alphanum, false);

    $this->game->placeStone($color, $bonusAction, $target0, $target1, $target2);
    self::ajaxResponse();
  }

  // TODO: defines your action entry points there

  /*

    Example:

    public function myAction()
    {
        self::setAjaxMode();

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }

    */
}
