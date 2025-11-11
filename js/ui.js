// js/ui.js
// UI glue: renders DOM, wires buttons to game actions, updates ping visuals.

(function(){
  const logEl = document.getElementById('log');
  const choicesEl = document.getElementById('choices');
  const inventoryEl = document.getElementById('inventory');
  const locationsEl = document.getElementById('locations');
  const sensateEl = document.getElementById('sensate');
  const ropeEl = document.getElementById('rope');
  const pingNumEl = document.getElementById('pingNum');
  const turnsEl = document.getElementById('turns');

  // short helpers
  function write(text, cls='m-info'){ const d=document.createElement('div'); d.className=cls; d.textContent=text; logEl.appendChild(d); logEl.scrollTop=logEl.scrollHeight; }
  function writeSense(text){ write("» " + text, 'm-sense'); }

  // render functions
  function renderAll(){
    const s = Game.getState();
    renderLocations(s.location);
    renderInventory(s.inventory);
    updatePingDisplay(s.pings);
    updateSensate(s.pings);
    turnsEl.textContent = "Turns: " + s.turns;
  }

  function renderLocations(current){
    locationsEl.innerHTML = '';
    Game.locations().forEach(loc=>{
      const el = document.createElement('div');
      el.className = 'loc';
      el.textContent = loc;
      if (loc === current) el.style.outline = '1px dashed rgba(159,211,199,0.08)';
      el.addEventListener('click', ()=> runAction(() => Game.actionTravelTo(loc)));
      locationsEl.appendChild(el);
    });
  }

  function renderInventory(inv){
    inventoryEl.innerHTML = '';
    for(const k in inv){
      if (inv[k] > 0){
        const it = document.createElement('div');
        it.className = 'item';
        it.textContent = k + (typeof inv[k] === 'number' ? ' ×'+inv[k] : '');
        inventoryEl.appendChild(it);
      }
    }
  }

  function updatePingDisplay(p){
    pingNumEl.textContent = p;
    const beads = ropeEl.querySelectorAll('.bead');
    beads.forEach(b=>{
      const i = Number(b.getAttribute('data-i'));
      if (i < p) b.classList.add('on'); else b.classList.remove('on');
    });
  }

  function updateSensate(p){
    let msg = '';
    if (p <= 1) msg = "Calm and quiet. The sensate is clear: near shapes, small and steady.";
    else if (p <= 3) msg = "Unease: several disturbances. Shapes overlap; intent is muddled.";
    else if (p <= 5) msg = "Noisy sensate. You feel pressure, edges of hungry shapes. Trust ropes and ritual.";
    else msg = "The world thins. The sensate is almost drowned.";
    sensateEl.textContent = msg;
  }

  // central runner for actions returned by Game
  function runAction(actionFn){
    // actionFn may be a function that returns an action result or a Game.* call wrapper
    const result = actionFn();
    // process result
    if (!result) return;
    if (result.messages){
      result.messages.forEach(m => write(m, 'm-action'));
    }
    if (result.newLocation){
      const s = Game.getState();
      s.location = result.newLocation;
      Game.setState(s);
    }
    if (typeof result.pingDelta === 'number'){
      Game.updatePing(result.pingDelta);
    } else if (result.pingDelta === undefined && result.pingDelta !== 0){
      // nothing
    }
    // check global pings and possible end
    const s2 = Game.getState();
    updatePingDisplay(s2.pings);
    updateSensate(s2.pings);
    renderInventory(s2.inventory);
    renderLocations(s2.location);
    turnsEl.textContent = "Turns: " + s2.turns;

    if (s2.pings >= 6) {
      write("Silence condenses. The Silence Leviathan notices.", 'm-danger');
      choicesEl.innerHTML = '';
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'Restart';
      b.addEventListener('click', resetGame);
      choicesEl.appendChild(b);
    }
  }

  // wire top-level buttons and actions map
  function wire(){
    document.getElementById('saveBtn').addEventListener('click', ()=>{
      localStorage.setItem('null_state', JSON.stringify(Game.getState()));
      write("Saved.", 'm-action');
    });
    document.getElementById('loadBtn').addEventListener('click', ()=>{
      const s = localStorage.getItem('null_state');
      if (s){ Game.setState(JSON.parse(s)); renderAll(); write("Loaded.", 'm-action'); }
      else write("No save found.", 'm-danger');
    });
    document.getElementById('resetBtn').addEventListener('click', resetGame);

    // dynamic choices that mimic the single-file behaviours
    addChoiceButton("Listen with the thread", ()=> runAction(Game.actionListenThread));
    addChoiceButton("Check inventory/braids", ()=> { write("You run your hands along your kit: ropes, beads, a small pouch of Quencher Powder.", 'm-world'); renderAll(); });
    addChoiceButton("Purchase Muffle Moss (spend a bead)", ()=> runAction(Game.actionBuyMoss));
    addChoiceButton("Light a small lantern (add strong Ping)", ()=> runAction(Game.actionLightLantern));
    addChoiceButton("Whisper loudly / shout (draw attention)", ()=> runAction(Game.actionShout));
  }

  function addChoiceButton(label, fn){
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = label;
    btn.addEventListener('click', fn);
    choicesEl.appendChild(btn);
  }

  function resetGame(){
    const startState = {
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
    Game.setState(startState);
    logEl.innerHTML = '';
    write("You wake into silence. The market around you is a tangle of ropes and curtained stalls.", 'm-world');
    renderAll();
  }

  // init
  wire();
  resetGame();

})();