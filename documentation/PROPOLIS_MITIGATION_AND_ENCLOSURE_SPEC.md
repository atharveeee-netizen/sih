# 🛡️ HoneyChain Propolis Mitigation & In-Hive Enclosure Specification

> **Target Problem**: Honeybees coat any foreign in-hive electronics in sticky, antibacterial tree resin (**propolis**) and beeswax comb, potentially blocking microphone ports and insulating thermal probes.  
> **Engineering Solution**: Hydrophobic ePTFE acoustic membranes, 316L medical stainless thermowells, and strict 9.5 mm Langstroth "bee-space" physical architecture.

---

## 1. 📐 Mechanical Design & The 9.5 mm "Bee Space" Rule

Lorenzo Langstroth discovered that if a gap between comb frames is:
* **$< 6.0\text{ mm}$**: Bees glue it shut with **propolis** (resin).
* **$> 9.5\text{ mm}$**: Bees build **burr comb** (wax) in the empty cavity.
* **$= 7.5\text{ to } 9.5\text{ mm}$ (The Bee Space)**: Bees leave the passageway 100% open and unobstructed!

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              LANGSTROTH FRAME CROSS-SECTION & PROBE PLACEMENT               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│      [ Wooden Top Bar Frame #4 ]           [ Wooden Top Bar Frame #5 ]      │
│     ┌───────────────────────────┐         ┌───────────────────────────┐     │
│     │   Capped Honeycomb Comb   │         │   Capped Honeycomb Comb   │     │
│     │                           │         │                           │     │
│     │                           │ ◄─────► │                           │     │
│     └───────────────────────────┘  8.5 mm └───────────────────────────┘     │
│                                  BEE SPACE                                  │
│                                      │                                      │
│                                      ▼                                      │
│                        ┌──────────────────────────┐                         │
│                        │  HoneyChain Node Sleeve  │                         │
│                        │  (6.5 mm Slim Enclosure) │                         │
│                        │  • ePTFE Acoustic Vent   │                         │
│                        │  • 316L SS Temp Probe    │                         │
│                        └──────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 🧰 Material Specifications & Anti-Propolis Barriers

### A. Acoustic MEMS Port Protection: Hydrophobic ePTFE Membrane
* **Material**: Expanded Polytetrafluoroethylene (ePTFE, Pore Size: $0.2\,\mu\text{m}$, IP68 rated).
* **Acoustic Transmissibility**: $> 94\%$ acoustic transparency across $100\text{ Hz} - 2.5\text{ kHz}$ (bee communication band).
* **Surface Chemistry**: Oleophobic & hydrophobic coating ($\text{Contact Angle} > 120^\circ$) preventing honey droplet adhesion and bee propolis resin deposition.
* **Bezel**: Silicone O-ring with flush snap-fit bezel to eliminate tactile edges that stimulate bee propolizing instincts.

### B. Temperature & Humidity Probes: Medical-Grade 316L Stainless Steel
* **Material**: 316L Stainless Steel sheathed thermowell with electropolished mirror finish ($Ra < 0.2\,\mu\text{m}$).
* **Sensor**: Sensirion SHT45 (dual relative humidity $\pm 1.0\%$ & temperature $\pm 0.1^\circ\text{C}$) protected behind a sintered porous metal filter cap.
* **Thermal Time Constant ($\tau$)**: $\le 12.5\text{ seconds}$ in moving hive air convection currents.

### C. Enclosure Polymer: Food-Grade POM / PEEK
* **Material**: Polyoxymethylene (POM-C) or Polyether ether ketone (PEEK), FDA 21 CFR § 177.2470 compliant.
* **Odorless**: Zero volatile organic chemical (VOC) outgassing to prevent triggering bee alarm pheromone (isopentyl acetate).

---

## 3. 🧠 Software-Side Propolis Occlusion AI Detection

Our gateway AI suite includes the **`PropolisOcclusionDetector`** (`gateway/ai_pipeline.py`):
1. **Spectral Roll-Off Ratio**: Compares high-frequency wing harmonics ($>800\text{ Hz}$) against base colony flight hum ($220\text{ Hz}$).
2. **Thermal Inertia Drift**: If sensor thermal response $\tau$ increases by $>150\%$, the AI alerts the beekeeper:
   $$\text{Flag: } \texttt{"PROPOLIS\_OCCLUSION\_DETECTED"} \implies \text{Maintenance: Wipe PTFE membrane at next frame rotation.}$$

---

## 4. 🛠️ Maintenance & Inspection Schedule
* **Routine Apiary Visit**: Every 21 days (aligned with natural brood cycle and honey extraction).
* **Cleaning Protocol**: Food-grade 70% ethanol swab over the ePTFE vent (takes $<10\text{ seconds}$).
