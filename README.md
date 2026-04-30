# Immersive Calculus Lab

A browser-based educational application built with Vite, Three.js, MathEngine (math.js + nerdamer), and MediaPipe to demonstrate undergraduate calculus visually and interactivity through an AR-styled UI.

## File Structure

```text
immersive_calculus_lab/
│
├── index.html                   # Main application shell and UI layout
├── main.js                      # Application entry point & initialization loop
├── package.json                 # Dependency and Vite environment definitions
│
├── css/
│   └── style.css                # Dark glassmorphism interface and aesthetics
│
└── js/
    ├── content/
    │   ├── CalculusModules.js   # The 12-Module curriculum data structure
    │   ├── DemoScenarios.js     # Teacher preset configurations for dynamic demonstrations 
    │   ├── TopicSchema.js       # Strict content validation schema ensuring consistency
    │   └── WorkedExamples.js    # Pre-verified complex examples for stable displays
    │
    └── core/
        ├── AccessibilityManager.js # Access and reduced-motion tools
        ├── BackgroundFx.js      # MediaPipe AR live-feed overlay & particle visualizer
        ├── DomainGuard.js       # Checks structural restrictions (e.g. division by zero, ln(x>0))
        ├── ExpressionNormalizer.js # Cleans mathematical strings for strict parsing
        ├── FallbackMode.js      # Graceful demotion to mouse interactivity if camera fails
        ├── Graph2D.js           # Draws dynamically shaded area/velocity curves on HTML Canvas
        ├── Graph3D.js           # Computes Three.js mappings for revolving Solids and Multivariable mappings
        ├── InputHandler.js      # Mediapipe gesture hook mapping for selection interactions
        ├── MathEngine.js        # Integrates Nerdamer mapping logic and delegates variables
        ├── PerformanceManager.js # Throttles rendering frame-rates dynamically based on context limits
        ├── PresentationMode.js  # Keyboard hooked sequencing between module topics
        ├── StateStore.js        # Observer-pattern application state 
        ├── TheoremExplorer.js   # Side-panel logic connecting text rules to math examples
        ├── UIManager.js         # Coordinates dynamic interface logic and element injection
        └── Verifier.js          # Computes numerical tolerance constraints crossing symbolic data
```

## Setup Instructions

1. **Install Dependencies**: Open the root `/immersive_calculus_lab` folder in your terminal and install the locked vendor dependencies (guarantees offline support):
   ```bash
   npm install
   ```
2. **Start Development Environment**:
   ```bash
   npm run dev
   ```
3. **Open the Application**: The command line will spit out a local server (e.g., `http://localhost:5173/`). Open this link in Chrome or Edge. Ensure your camera is allowed to test MediaPipe tracking. 
4. **Production Build**: If you are hosting this directly offline behind a static Apache/Python server, generate the dist files:
   ```bash
   npm run build
   ```

## Verification & Status Notes

As requested, mathematical verification layers were established to prevent fabricated results. 

**What is Verified (Exact results):**
- Polynomials, simple trigonometric derivatives `sin, cos`, and exponentials `e^x` correctly map through the `Nerdamer` engine. The `Verifier.js` subsequently checks the newly generated string by performing a numerical approximation limit over standard test scopes (e.g., $x \in [1, 3]$ to avoid $x=0$).
- Functions are mathematically clamped inside `DomainGuard` if properties restrict them entirely.

**What is Approximate:**
- Any integration command that exceeds basic symbolic lookup tables will drop the formal integration output, falling back exclusively to numerical approximations displayed via `Graph2D` area shading. These are marked explicitly via the UI as `APPROXIMATE: Numerical Only` to prevent misleading students.
- Volume by Slicing mappings natively rely on numeric point resolution rendering, meaning Three.js will visualize geometric approximations at high definitions rather than perfect non-triangulated curves.

**What is not yet implemented (Future Scalability):**
- The `CalculusModules.js` contains representations of all 12 modules, but does not yet contain *every* individual bullet point (such as Center of Mass calculations exclusively, or explicit Alternating series test evaluation logic). The `TopicSchema` architecture allows you to easily plug and play new JSON configurations for these missing pieces dynamically!
