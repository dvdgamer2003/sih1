# PhET Simulations

This folder contains PhET Interactive Simulations for science and math education.

## How to Add Simulations

1. **Download PhET Simulations:**
   - Visit https://phet.colorado.edu/
   - Download HTML5 simulations (not Java or Flash)
   - Extract the simulation folder

2. **Add to this folder:**
   - Create a subfolder for each simulation
   - Example structure:
     ```
     simulations/
     ├── gravity-and-orbits/
     │   ├── gravity-and-orbits_en.html
     │   └── ... (other files)
     ├── circuit-construction-kit/
     │   ├── circuit-construction-kit_en.html
     │   └── ... (other files)
     └── README.md (this file)
     ```

3. **Link in Database:**
   - Update the Subchapter model with simulation path
   - Example: `/simulations/gravity-and-orbits/gravity-and-orbits_en.html`

## Popular PhET Simulations

### Physics
- Gravity and Orbits
- Forces and Motion
- Energy Skate Park
- Pendulum Lab
- Wave on a String

### Chemistry
- Build an Atom
- Molecule Shapes
- States of Matter
- pH Scale
- Balancing Chemical Equations

### Math
- Fractions Intro
- Area Builder
- Graphing Lines
- Function Builder

### Biology
- Natural Selection
- Gene Expression Essentials

## Usage in App

Simulations will be displayed in an iframe within the app:
- Navigate to a subchapter
- Click "Interactive Simulation" button
- Simulation loads in fullscreen modal

## License

PhET simulations are licensed under CC BY 4.0
https://phet.colorado.edu/en/licensing
