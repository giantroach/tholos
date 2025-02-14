const testDataBase = {
  current_player_id: '',
  decision: {
    decision_type: 'none',
  },
  game_result_neutralized: '0',
  gameMode: 'standard',
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
  mainBoard: {
    1: {
      id: '1',
      location: '0',
      color: 'white',
    },
    2: {
      id: '2',
      location: '0',
      color: 'black',
    },
    3: {
      id: '3',
      location: '2',
      color: 'white',
    },
    4: {
      id: '4',
      location: '3',
      color: 'black',
    },
    4: {
      id: '4',
      location: '3',
      color: 'gray',
    },
  },
  workshop: {
    1: {
      id: '1',
      ws: 'white',
      color: 'white',
    },
    2: {
      id: '2',
      ws: 'white',
      color: 'white',
    },
    3: {
      id: '3',
      ws: 'black',
      color: 'black',
    },
    4: {
      id: '4',
      ws: 'black',
      color: 'black',
    },
  },
  quarry: {
    black: {
      color: 'black',
      count: '13',
    },
    gray: {
      color: 'gray',
      count: '10',
    },
    white: {
      color: 'white',
      count: '13',
    },
  },
  playerSide: 'black',
};

const testData = [
  Object.assign(structuredClone(testDataBase), {
    mainBoard: {
      1: {
        id: '1',
        location: '0',
        color: 'white',
      },
      2: {
        id: '2',
        location: '0',
        color: 'black',
      },
      3: {
        id: '3',
        location: '2',
        color: 'white',
      },
      4: {
        id: '4',
        location: '3',
        color: 'black',
      },
      4: {
        id: '4',
        location: '3',
        color: 'gray',
      },
    },
    workshop: {
      1: {
        id: '1',
        ws: 'white',
        color: 'white',
      },
      2: {
        id: '2',
        ws: 'white',
        color: 'white',
      },
      3: {
        id: '3',
        ws: 'black',
        color: 'black',
      },
      4: {
        id: '4',
        ws: 'black',
        color: 'black',
      },
    },
    quarry: {
      black: {
        color: 'black',
        count: '13',
      },
      gray: {
        color: 'gray',
        count: '10',
      },
      white: {
        color: 'white',
        count: '13',
      },
    },
  }),
  Object.assign(structuredClone(testDataBase), {
    mainBoard: {
      1: {
        id: '1',
        location: '5',
        color: 'white',
      },
      2: {
        id: '2',
        location: '5',
        color: 'black',
      },
      3: {
        id: '3',
        location: '5',
        color: 'black',
      },
      4: {
        id: '4',
        location: '5',
        color: 'black',
      },
      5: {
        id: '5',
        location: '5',
        color: 'black',
      },
      6: {
        id: '6',
        location: '4',
        color: 'white',
      },
      7: {
        id: '7',
        location: '4',
        color: 'black',
      },
      8: {
        id: '8',
        location: '4',
        color: 'gray',
      },
      9: {
        id: '9',
        location: '4',
        color: 'black',
      },
      10: {
        id: '10',
        location: '4',
        color: 'gray',
      },
      11: {
        id: '11',
        location: '6',
        color: 'white',
      },
      12: {
        id: '12',
        location: '6',
        color: 'black',
      },
      13: {
        id: '13',
        location: '6',
        color: 'gray',
      },
      14: {
        id: '14',
        location: '6',
        color: 'black',
      },
      15: {
        id: '15',
        location: '6',
        color: 'gray',
      },
    },
  }),
  Object.assign(structuredClone(testDataBase), {
    gameMode: 'advanced',
    mainBoard: {
      1: {
        id: '1',
        location: '1',
        color: 'white',
      },
      2: {
        id: '2',
        location: '2',
        color: 'black',
      },
      3: {
        id: '3',
        location: '3',
        color: 'black',
      },
      4: {
        id: '4',
        location: '4',
        color: 'black',
      },
      5: {
        id: '5',
        location: '5',
        color: 'black',
      },
      6: {
        id: '6',
        location: '6',
        color: 'white',
      },
      7: {
        id: '7',
        location: '0',
        color: 'black',
      },
      8: {
        id: '8',
        location: '0',
        color: 'black',
      },
      9: {
        id: '9',
        location: '0',
        color: 'black',
      },
      10: {
        id: '10',
        location: '0',
        color: 'black',
      },
      11: {
        id: '11',
        location: '0',
        color: 'black',
      },
      12: {
        id: '12',
        location: '0',
        color: 'black',
      },
      13: {
        id: '13',
        location: '0',
        color: 'black',
      },
    },
    ornament: {
      1: {
        id: '1',
        location: '0',
        type: 'o1',
      },
      2: {
        id: '2',
        location: '1',
        type: 'o2',
      },
      3: {
        id: '3',
        location: '2',
        type: 'o3',
      },
      4: {
        id: '4',
        location: '3',
        type: 'o4',
      },
      5: {
        id: '5',
        location: '4',
        type: 'o5',
      },
      6: {
        id: '6',
        location: '5',
        type: 'o6',
      },
      7: {
        id: '7',
        location: '6',
        type: 'o7',
      },
    },
    workshop: {
      1: {
        id: '1',
        ws: 'white',
        color: 'white',
      },
      2: {
        id: '2',
        ws: 'white',
        color: 'gray',
      },
      3: {
        id: '3',
        ws: 'black',
        color: 'black',
      },
      4: {
        id: '4',
        ws: 'black',
        color: 'gray',
      },
    },
  }),
  Object.assign(structuredClone(testDataBase), {
    gameMode: 'advanced',
    mainBoard: {
      1: {
        id: '1',
        location: '1',
        color: 'white',
      },
      2: {
        id: '2',
        location: '2',
        color: 'black',
      },
      3: {
        id: '3',
        location: '3',
        color: 'black',
      },
      4: {
        id: '4',
        location: '4',
        color: 'black',
      },
      5: {
        id: '5',
        location: '5',
        color: 'black',
      },
      6: {
        id: '6',
        location: '6',
        color: 'white',
      },
      7: {
        id: '7',
        location: '0',
        color: 'black',
      },
      8: {
        id: '8',
        location: '0',
        color: 'black',
      },
      9: {
        id: '9',
        location: '0',
        color: 'black',
      },
      10: {
        id: '10',
        location: '0',
        color: 'black',
      },
      11: {
        id: '11',
        location: '0',
        color: 'black',
      },
      12: {
        id: '12',
        location: '0',
        color: 'black',
      },
    },
    ornament: {
      7: {
        id: '7',
        location: '0',
        type: 'o7',
      },
    }
  }),
];

function loadTestData(idx = 0) {
  const vue = window.vue;
  vue.gamedata = testData[idx];
  // vue.restore();
  vue.state.current = 'playerTurn:init';
  // vue.state.refresh();
}

const testEvent = [
  {
    name: 'takeStone',
    args: {
      player_side: 'black',
      player_name:
        '<!--PNS--><span class="playername" style="color:#008000;">giantroach0</span><!--PNE-->',
      color: 'white',
      count: '1',
    },
  },
  {
    name: 'placeStone',
    args: {
      player_side: 'black',
      player_name:
        '<!--PNS--><span class="playername" style="color:#008000;">giantroach0</span><!--PNE-->',
      color: 'black',
      target: '0',
      locationName: 'α',
    },
  },
  {
    name: 'moveStone',
    args: {
      player_side: 'black',
      player_name:
        '<!--PNS--><span class="playername" style="color:#008000;">giantroach0</span><!--PNE-->',
      from: '3',
      fromName: 'δ',
      to: '2',
      toName: 'γ',
    },
  },
  {
    name: 'removeStone',
    args: {
      player_side: 'black',
      player_name:
        '<!--PNS--><span class="playername" style="color:#008000;">giantroach0</span><!--PNE-->',
      from: '0',
      fromName: 'α',
    },
  },
  {
    name: 'stealStone',
    args: {
      player_side: 'black',
      player_name:
        '<!--PNS--><span class="playername" style="color:#008000;">giantroach0</span><!--PNE-->',
      color: 'white',
      from: '3',
    },
  },
];

function loadTestEvent(idx = 0) {
  const vue = window.vue;
  vue.bgaNotifications.push(testEvent[idx]);
}

// append UI
const base = document.createElement('div');
base.innerHTML = `
<div>
<select id="test-data-idx">
</select>
<button
onclick="loadTestData(Number(document.getElementById('test-data-idx').value))"
  >
  Load test data
</button>
<select id="test-event-idx">
</select>
<button
onclick="loadTestEvent(Number(document.getElementById('test-event-idx').value))"
  >
  Load test event
</button>
</div>
`;
document.body.prepend(base);
const sel1 = document.getElementById('test-data-idx');
testData.forEach((d, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.innerText = idx;
  sel1.appendChild(opt);
});
const sel2 = document.getElementById('test-event-idx');
testEvent.forEach((d, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.innerText = `${idx}: ${d.name}`;
  sel2.appendChild(opt);
});
