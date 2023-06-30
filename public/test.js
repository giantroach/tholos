const testdata = [
  {
    current_player_id: '',
    decision: {
      decision_type: 'none',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '2',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: -28,
          2348343: '180',
        },
        initial: {
          2348342: 178,
        },
        initial_ts: {
          2348342: 1687781331158,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card or pass',
      descriptionmyturn: '${you} must play a card or pass',
      type: 'activeplayer',
      possibleactions: ['moveStone', 'pass'],
      transitions: {
        moveStone: 2,
        pass: 2,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          '': 2,
        },
      },
      2: {
        name: 'playerTurn',
        description: '${actplayer} must play a card or pass',
        descriptionmyturn: '${you} must play a card or pass',
        type: 'activeplayer',
        possibleactions: ['moveStone', 'pass'],
        transitions: {
          moveStone: 2,
          pass: 2,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '1',
      move_nbr: '1',
    },
    playerorder: ['2348342', 2348343],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    tablespeed: '1',
  },
];

function loadTestData(idx = 0) {
  const vue = window.vue;
  vue.gamedata = testdata[idx];
  // vue.restore();
  vue.state.current = "playerTurn:init";
  // vue.state.refresh();
}

// append UI
const base = document.createElement('div');
base.innerHTML = `
<select id="test-data-idx">
  <option value="0" selected>0</option>
</select>
<button
onclick="loadTestData(Number(document.getElementById('test-data-idx').value))"
  >
  Load test data
</button>
`;
document.body.prepend(base);
const sel = document.getElementById('test-data-idx');
testdata.forEach((d, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.innerText = idx;
  sel.appendChild(opt);
});
