/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Tholos implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * tholos.js
 *
 * Tholos user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

const appName = 'tholos';
let i18n;

// load client ES module code
const s = document.createElement('script');
s.type = 'module';
s.src = `${g_gamethemeurl}modules/app.js`;
document.body.appendChild(s);
const p = new Promise((resolve) => {
  const timer = setInterval(() => {
    if (window['vue']) {
      clearTimeout(timer);
      resolve(window['vue']);
    }
  });
}, 100);

define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  // NOTE: This does not work since it is an ES module
  // g_gamethemeurl + 'modules/app.js',
], function (dojo, declare) {
  let vue = null;
  return declare('bgagame.tholos', ebg.core.gamegui, {
    constructor: function () {
      console.log('tholos constructor');
      // Here, you can init the global variables of your user interface
      // Example:
      // this.myGlobalValue = 0;
    },

    /*
      setup:

      This method must set up the game user interface according to current game situation specified
      in parameters.

      The method is called each time the game interface is displayed to a player, ie:
      _ when the game starts
      _ when a player refreshes the game page (F5)

      "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */

    setup: function (gamedatas) {
      console.log('Starting game setup');
      // Setting up player boards
      for (var player_id in gamedatas.players) {
        var player = gamedatas.players[player_id];
        // TODO: Setting up players boards if needed
      }

      // when the client script is ready
      p.then((v) => {
        vue = v;
        vue.urlBase = g_gamethemeurl;

        // TODO: Set up your game interface here, according to "gamedatas"
        this.refreshGamedata(gamedatas);
        vue.playerID = this.player_id;
        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();
        this.setupActions();
        // inject translation
        i18n = window['_'];
        vue.translation = {
          'Tholos..': _('Tholos'),
        };
        console.log('Ending game setup');
      });
    },

    refreshGamedata: function (gamedatas) {
      Object.keys(gamedatas).forEach((prop) => {
        vue.gamedata[prop] = gamedatas[prop];
      });
    },

    ///////////////////////////////////////////////////
    //// Game & client states

    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    onEnteringState: function (stateName, args) {
      console.log('Entering state: ' + stateName);
      p.then(() => {
        switch (stateName) {
          case 'playerTurn':
            if (this.isCurrentPlayerActive()) {
              vue.bgaStates.push('playerTurn:init');
            }
            break;
        }
      });
    },

    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    onLeavingState: function (stateName) {
      console.log('Leaving state: ' + stateName);
      p.then(() => {
        switch (stateName) {
          case 'playerTurn':
            vue.bgaStates.push('waitingForOtherPlayer');
            break;
        }
      });
    },

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    onUpdateActionButtons: function (stateName, args) {
      console.log('onUpdateActionButtons: ' + stateName);
      if (this.isCurrentPlayerActive()) {
        switch (
          stateName
          /*
            Example:

            case 'myGameState':

               // Add 3 action buttons in the action status bar:

               this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
               this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
               this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
               break;
           */
        ) {
        }
      }
    },

    ///////////////////////////////////////////////////
    //// Utility methods

    /*

      Here, you can defines some utility methods that you can use everywhere in your javascript
      script.

    */

    ///////////////////////////////////////////////////
    //// Player's action

    /*

      Here, you are defining methods to handle player's action (ex: results of mouse click on
      game objects).

      Most of the time, these methods:
      _ check the action is possible at this game state.
      _ make a call to the game server

    */

    /* Example:

       onMyMethodToCall1: function( evt )
       {
       console.log( 'onMyMethodToCall1' );

       // Preventing default browser reaction
       dojo.stopEvent( evt );

       // Check that this action is possible (see "possibleactions" in states.inc.php)
       if( ! this.checkAction( 'myAction' ) )
       {   return; }

       this.ajaxcall( "/vughex/vughex/myAction.html", {
       lock: true,
       myArgument1: arg1,
       myArgument2: arg2,
       ...
       },
       this, function( result ) {

       // What to do after the server call if it succeeded
       // (most of the time: nothing)

       }, function( is_error) {

       // What to do after the server call in anyway (success or failure)
       // (most of the time: nothing)

       } );
       },

    */

    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications

    /*
      setupNotifications:

      In this method, you associate each of your game notifications with your local method to handle it.

      Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
      your vughex.game.php file.

    */
    setupNotifications: function () {
      console.log('notifications subscriptions setup');
      // TODO: here, associate your game notifications with local methods

      // Example 1: standard notification handling
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

      // Example 2: standard notification handling + tell the user interface to wait
      //            during 3 seconds after calling the method in order to let the players
      //            see what is happening in the game.
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
      // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
      //

      const notifications = ['moveStone'];
      notifications.forEach((n) => {
        dojo.subscribe(n, this, (data) => {
          vue.bgaNotifications.push({
            name: n,
            args: data.args,
          });
        });
      });
    },

    // TODO: from this point and below, you can write your game notifications handling methods

    /*
      Example:

      notif_cardPlayed: function( notif )
      {
      console.log( 'notif_cardPlayed' );
      console.log( notif );

      // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

      // TODO: play the card in the user interface.
      },

    */

    setupActions: function () {
      vue.$watch(() => vue.bgaRequest, (req) => {
        if (!req) {
          return;
        }
        const reqBase = `/${appName}/${appName}`;
        const url = `${reqBase}/${req.name}.html`;
        vue.bgaRequestPromise = new Promise((resolve, reject) => {
          this.ajaxcall(
            url,
            Object.assign(
              {
                lock: true,
              },
              req.args
            ),
            this,
            (result) => {
              resolve(result);
            },
            (error) => {
              // this is called even if it success
              if (error) {
                reject(error);
              }
            }
          );
        });
      });
    },
  });
});
