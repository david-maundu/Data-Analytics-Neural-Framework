# Data Analytics Neural Framework

![Neural Analytics Header](https://raw.githubusercontent.com/google/material-design-icons/master/png/action/settings_input_component/black/48dp.png)

An enterprise-grade strategic assessment engine designed to quantify project actionability and implementation risk. This framework moves beyond simple averaging by utilizing non-linear neural gate simulations and geometric mean gating to model real-world strategic constraints.

## 🧠 Core Mathematical Architecture

The framework is built on a deterministic computational engine that simulates organizational entropy:

- **Potential Vector Synthesis**: Initial strategic potential is derived from weighted arithmetic aggregation of problem-space variables (Definition, Stakeholders, Business Context).
- **Geometric Filtering (Strategic Gating)**: Implementation constraints apply a Geometric Mean logic $G = \sqrt[n]{\prod x_i}$. This ensures that a single critical failure (e.g., a "1" in Budget or Data Quality) acts as a bottleneck, accurately reflecting real-world project dependencies.
- **Sigmoid Activation Gates**: Signals pass through discrete sequential high-pass gates. We use Sigmoid normalization to account for the "last mile" difficulty—where the leap from 90% to 95% feasibility is mathematically represented as harder than 0% to 50%.
- **Contextual Bias Modulation**: A dedicated scalar layer allows for the injection of organizational culture, external market conditions, and cognitive biases into the pre-activation potential.

## 🚀 Key Features

### 🛠️ Strategic Focus Workbench
Pin specific variables to simulate executive priority. Apply **Focus Multipliers (1.1x - 1.5x)** to individual nodes to perform sensitivity analysis and see how targeted improvements impact the overall viability index.

### 🎚️ Advanced Calibration
Fine-tune the global calculation engine. The Calibration Panel allows you to adjust the relative significance of entire categories (e.g., weighing "Data Reality" more heavily than "Political Support") with a range of 0.5x to 2.0x.

### 🧬 Dynamic Node Manipulation
The engine is fully modular. Inject custom contextual variables into any layer or remove redundant nodes to tailor the framework to specific industry requirements.

### 💾 Scenario Vault & Comparison
- **State Persistence**: Save complete project configurations to local storage.
- **A/B Testing**: Select multiple saved scenarios for side-by-side comparison, highlighting delta metrics and specific "Strategic Adjustments" between versions.
- **Portable Logic**: Share entire project states via Base64-encoded URL hashes.

## 🛡️ Security & Privacy

**Zero External Dependencies**: This application is a pure client-side strategic tool.
- **No Database**: All scenario data is stored in your browser's `localStorage`.
- **No AI Privacy Risk**: All calculations are deterministic and performed locally on your machine.
- **Air-Gapped Ready**: Once loaded, the app requires no active internet connection to perform strategic simulations.

## 💻 Tech Stack

- **React 19**: UI Layer.
- **Tailwind CSS**: Enterprise-grade responsive styling.
- **Lucide Icons**: Visual semiotics.
- **ESM Modules**: Modern, zero-build deployment architecture.

## 🏁 Getting Started

Since this project uses modern ESM imports and a CDN-based setup, there is **no build step required**.

1. Clone the repository.
2. Serve the root directory using any local web server (e.g., `npx serve`, `python -m http.server`, or Live Server in VS Code).
3. Open `index.html` in a modern browser.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Neural Strategy Command © Global Strategic Services*
