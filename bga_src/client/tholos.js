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
        vue.gamedata = gamedatas;
        vue.playerID = this.player_id;
        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();
        this.setupActions();
        // inject translation
        i18n = window['_'];
        vue.translation = {
          'Tholos..': _('Tholos'),

          // src/def/ctrlBar.ts
          'Choose and take stones from query or choose and place a stone from your workshop.':
            _(
              'Choose and take stones from query or choose and place a stone from your workshop.'
            ),
          'Choose a column to place your stone.': _(
            'Choose a column to place your stone.'
          ),
          'Do you like to perform Bonus Action?': _(
            'Do you like to perform Bonus Action?'
          ),
          'No valid target.': _('No valid target.'),
          'Choose a gray stone to move from.': _(
            'Choose a gray stone to move from.'
          ),
          'Choose a white stone to move from.': _(
            'Choose a white stone to move from.'
          ),
          'Choose a stone to take away from the board.': _(
            'Choose a stone to take away from the board.'
          ),
          'Choose a stone to take from the quarry.': _(
            'Choose a stone to take from the quarry.'
          ),
          "Choose a stone to take from the opponent's workshop.": _(
            "Choose a stone to take from the opponent's workshop."
          ),
          'Choose another stone in your workshop to place.': _(
            'Choose another stone in your workshop to place.'
          ),
          'Choose a black stone to move from.': _(
            'Choose a black stone to move from.'
          ),
          'Choose a column to move to.': _('Choose a column to move to.'),
          'Choose a column to move to.': _('Choose a column to move to.'),
          'Choose a column to move to.': _('Choose a column to move to.'),
          'Choose a column to move to.': _('Choose a column to move to.'),
          "Press 'Submit' to confirm": _("Press 'Submit' to confirm"),

          // src/def/ctrlButton.ts
          Cancel: _('Cancel'),
          Submit: _('Submit'),
          'Take Action': _('Take Action'),
          'No Action': _('No Action'),
          OK: _('OK'),

          // src/def/pillar.ts
          'Locations α: The player who places a stone of their color in this locations may move the top Gray color stone of the column at a different temple location to a third different —and valid— temple location.':
            _(
              'Locations α: The player who places a stone of their color in this locations may move the top Gray color stone of the column at a different temple location to a third different —and valid— temple location.'
            ),
          'Locations β: The player who places a stone of their color in this locations may move the top White color stone of the column at a different temple location to a third different —and valid— temple location.':
            _(
              'Locations β: The player who places a stone of their color in this locations may move the top White color stone of the column at a different temple location to a third different —and valid— temple location.'
            ),
          'Location γ: The player who places a stone of their color in this location may return the top stone (of any color) of the column at a different temple location back to the quarry.':
            _(
              'Location γ: The player who places a stone of their color in this location may return the top stone (of any color) of the column at a different temple location back to the quarry.'
            ),
          'Location δ: The player who places a stone of their color in this location may move a stone (of any color) from the quarry to their workshop; the player must have room for it in their workshop.':
            _(
              'Location δ: The player who places a stone of their color in this location may move a stone (of any color) from the quarry to their workshop; the player must have room for it in their workshop.'
            ),
          'Location π: The player who places a stone of their color in this location may move a stone (of any color) from their rival’s workshop to their own workshop; the player must have room for it in their workshop.':
            _(
              'Location π: The player who places a stone of their color in this location may move a stone (of any color) from their rival’s workshop to their own workshop; the player must have room for it in their workshop.'
            ),
          'Location Σ: The player who places a stone of their color in this location may place a stone (of any color) from their workshop in another valid temple location.':
            _(
              'Location Σ: The player who places a stone of their color in this location may place a stone (of any color) from their workshop in another valid temple location.'
            ),
          'Locations Ω: The player who places a stone of their color in this locations may move the top Black color stone of the column at a different temple location to a third different —and valid— temple location.':
            _(
              'Locations Ω: The player who places a stone of their color in this locations may move the top Black color stone of the column at a different temple location to a third different —and valid— temple location.'
            ),

          // src/def/quarry.ts
          'How many stones?': _('How many stones?'),
        };

        // update player area
        gamedatas.playerorder.forEach((pID, idx) => {
          // append stone icon
          const icon = document.createElement('div');
          icon.style.height = '20px';
          icon.style.width = '20px';
          icon.style.display = 'inline-block';
          icon.style.backgroundImage = `url(${g_gamethemeurl}img/player_icon.png)`;
          if (gamedatas.playerID === Number(pID)) {
            icon.style.backgroundPosition =
              gamedatas.playerSide === 'black' ? '0 0' : '-20px 0';
          } else {
            icon.style.backgroundPosition =
              gamedatas.playerSide === 'black' ? '-20px 0' : '0 0';
          }
          icon.style.marginBottom = '-2px';
          document
            .querySelector(`#player_board_${pID} .player_score`)
            ?.prepend(icon);
        });

        console.log('Ending game setup');
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

      dojo.subscribe('updateScore', this, (data) => {
        const a = data.args;
        this.scoreCtrl[a.playerID].setValue(a.score);
      });

      const notifications = [
        'takeStone',
        'placeStone',
        'moveStone',
        'removeStone',
        'stealStone',
      ];
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
      vue.$watch(
        () => vue.bgaRequest,
        (req) => {
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
        }
      );
    },
  });
});
