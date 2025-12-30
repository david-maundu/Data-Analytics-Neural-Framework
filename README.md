# Data Analytics Neural Framework

[![Deploy to GitHub Pages](https://github.com/david-maundu/Data-Analytics-Neural-Framework/actions/workflows/deploy.yml/badge.svg)](https://github.com/david-maundu/Data-Analytics-Neural-Framework/actions/workflows/deploy.yml)

**🚀 [Launch Application](https://david-maundu.github.io/Data-Analytics-Neural-Framework/)**

![Description of Image](images/Neural_Framework.png)

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

- **React 19**: UI Layer
- **Vite 6**: Build tooling & development server
- **TypeScript 5.8**: Type safety
- **Tailwind CSS**: Enterprise-grade responsive styling
- **GitHub Pages**: Static hosting

## 🎯 Getting Started

### Online (Recommended)
Simply visit the live application:
**[https://david-maundu.github.io/Data-Analytics-Neural-Framework/](https://david-maundu.github.io/Data-Analytics-Neural-Framework/)**

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/david-maundu/Data-Analytics-Neural-Framework.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 📊 How to Use

1. **Quantum Framing**: Assign scores [1-10] to Problem Definition and Business Context to establish the base potential
2. **Reality Gating**: Calibrate feasibility layers. Low scores act as 'Strategic Gates' using Geometric Mean bottlenecking
3. **Bias Modulation**: Inject Bias Terms to account for organizational culture, friction, or competitive catalysts
4. **Focus Simulation**: Apply multipliers [1.1x - 1.5x] to pin specific drivers for management priority testing
5. **Analyze Results**: Review the Neural Network Results panel for actionability scores and recommendations
6. **Save Scenarios**: Store different configurations for comparison and future reference

## 🔧 Configuration

### Customizing the Base Path
If deploying to a different hosting service or subdirectory, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-custom-path/',
  // ... rest of config
});
```

## 📈 Deployment

This project automatically deploys to GitHub Pages via GitHub Actions on every push to `main`. 

To deploy your own instance:
1. Fork this repository
2. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions
3. Push to main branch
4. Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Mathematical Foundation

### Engine Theory: Asymptotic Actionability

Optimization is non-linear. The framework utilizes a **Sigmoid Activation Gate** where the jump from 90% to 95% feasibility is mathematically 4x harder than 0% to 50%. This simulates real-world entropy.

**Sigmoid Function:**
```
f(x) = 1 / (1 + e^(-x))
```

**Geometric Mean Gate:**
```
G = ⁿ√(∏xᵢ)
```

This ensures that weak links in execution capacity create proportional drag on the entire strategic outcome.

---

*Neural Strategy Command © Global Strategic Services*

**Version:** 2.5.1-STRAT-A1  
**Node Cluster:** Sigmoid/Geometric Hybrid
