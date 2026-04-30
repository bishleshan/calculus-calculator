import './css/style.css';
import { StateStore } from './js/core/StateStore.js';
import { MathEngine } from './js/core/MathEngine.js';
import { CalculatorModules } from './js/content/CalculusModules.js';
import { UIManager } from './js/core/UIManager.js';
import { Graph2D } from './js/core/Graph2D.js';
import { BackgroundFx } from './js/core/BackgroundFx.js';
import { Graph3D } from './js/core/Graph3D.js';
import { InputHandler } from './js/core/InputHandler.js';
import { FallbackMode } from './js/core/FallbackMode.js';
import { PerformanceManager } from './js/core/PerformanceManager.js';
import { PresentationMode } from './js/core/PresentationMode.js';
import { TheoremExplorer } from './js/core/TheoremExplorer.js';

async function init() {
  document.getElementById('status').textContent='INITIALIZING SYSTEMS...';
  
  // Initialize Core State
  const state = new StateStore();
  
  // Initialize Math Engine (loads dependencies: mathjs, nerdamer)
  const mathEngine = new MathEngine();
  
  // Load Content Layout
  const modules = CalculatorModules;
  state.setModules(modules);
  
  // Initialize Systems
  const perfMan = new PerformanceManager();
  const ui = new UIManager(state, mathEngine);
  const explorer = new TheoremExplorer(state);
  
  document.getElementById('btn-explore').addEventListener('click', () => explorer.show());
  const fx = new BackgroundFx();
  const g2d = new Graph2D(state);
  const g3d = new Graph3D(state);
  
  // Inputs
  const inputHandler = new InputHandler(state, ui);

  // Initialize first module / topic
  ui.buildModuleNav();
  ui.selectTopic(modules[0].topics[0].id);

  // ---- Mode Selection ----
  const modeSelect = document.getElementById('mode-select');
  const btnMouseOnly = document.getElementById('btn-mouse-only');
  const btnHandsMouse = document.getElementById('btn-hands-mouse');

  // Mouse Only: no camera, no MediaPipe, no gesture cursor
  btnMouseOnly.addEventListener('click', () => {
    modeSelect.style.display = 'none';
    document.body.classList.add('mouse-only');
    ui.showUI();
    document.getElementById('status').textContent = 'MOUSE MODE ACTIVE';
  });

  // Hands + Mouse: request camera, load hand tracking
  btnHandsMouse.addEventListener('click', async () => {
    modeSelect.style.display = 'none';
    try {
      const test = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      test.getTracks().forEach(t => t.stop());
      await inputHandler.startCamera();
      fx.startVideoFeedback(document.getElementById('vid'));
    } catch (e) {
      // Camera denied — fall back to mouse-only
      FallbackMode.enableMouseFallback(inputHandler);
      ui.showUI();
      document.getElementById('gest-guide').style.display = 'none';
      document.getElementById('status').textContent = 'CAMERA DENIED — MOUSE MODE ACTIVE';
    }
  });

  // ---- View Toggle: 2D ⇄ 3D ----
  const btn2d = document.getElementById('btn-view-2d');
  const btn3d = document.getElementById('btn-view-3d');
  if(btn2d && btn3d) {
    btn2d.addEventListener('click', () => {
      document.body.classList.add('mode-2d');
      btn2d.classList.add('active');
      btn3d.classList.remove('active');
      setTimeout(() => g3d.resize(), 430);
    });
    btn3d.addEventListener('click', () => {
      document.body.classList.remove('mode-2d');
      btn3d.classList.add('active');
      btn2d.classList.remove('active');
      setTimeout(() => g3d.resize(), 430);
    });
  }

  // Presentation Mode Init
  PresentationMode.init(state, ui);

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    const dt = 0.016;
    time += dt;
    
    perfMan.update(dt);
    
    // Render systems if not throttled
    if(!perfMan.shouldThrottleRendering()) {
      fx.render(time);
      g3d.render(time);
      g2d.render();
    }
    
    inputHandler.updateCursor();
  }
  
  animate();
}

window.addEventListener('load', init);
