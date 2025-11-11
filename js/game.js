// js/game.js
// Core game logic and state for NULL — Rope & Silence
// Exposes a global `Game` object that the UI uses.

(function(window){
  const LOCS = ['Still Market','Gloam Garden','Braided Archive','Quiet Kiln','Last Bell'];

  let state = {
    location: 'Still Market',
    pings: 0,
    turns: 0,
    inventory: {
      'Quencher Powder': 1,
      'Aura Thread': 1,
      'Blackglass Lantern': 0,
      'Beads': 3,
      'Braids': 1
    },
    flags: {}
  };

  function getState(){ return JSON.parse(JSON.stringify(state)); }
  function setState(s){ state = s; }

  function locations(){ return LOCS.slice(); }

  function updatePing(delta, reason){
    state.pings = Math.max(0, state.pings + delta);
    state.turns++;
    if (state.pings >= 6) {
      // triggered externally by UI check
    }
  }

  // Actions — return an object { text:[], pingDelta: number, changedState: {...}, end?: 'leviathan'|'good' }
  function actionListenThread(){
    const messages = ["You pluck the Aura Thread between you and your companions. Tiny tugs return, like distant footfalls under water."];
    return { messages, pingDelta: 0 };
  }

  function actionTravelTo(loc){
    const messages = ["You coil your rope and step toward " + loc + "."];
    return { messages, pingDelta: 1, newLocation: loc };
  }

  function actionBuyMoss(){
    if ((state.inventory['Beads']||0) <= 0) {
      return { messages: ["You have no beads to trade."], pingDelta: 0, fail:true };
    }
    state.inventory['Beads']--;
    state.inventory['Quencher Powder'] = (state.inventory['Quencher Powder'] || 0) + 1;
    return { messages: ["You trade a bead for a small pad of Muffle Moss."], pingDelta: 0 };
  }

  function actionLightLantern(){
    return { messages: ["You strike a small lantern. Light spills — a warm wrongness in the dark."], pingDelta: 3 };
  }

  function actionShout(){
    return { messages: ["You shout in frustration. The sound scatters like beads on stone."], pingDelta: 2 };
  }

  // Expose API for UI
  window.Game = {
    getState,
    setState,
    locations,
    updatePing,
    actionListenThread,
    actionTravelTo,
    actionBuyMoss,
    actionLightLantern,
    actionShout
  };
})(window);
