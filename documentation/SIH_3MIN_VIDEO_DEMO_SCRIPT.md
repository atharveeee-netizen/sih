# 🎬 HoneyChain — Official 3-Minute SIH Video Demo Script
> **Problem Statement 26021 — Ministry of MSME, Coordination Section**  
> **Theme: Smart Automation | Category: Software**  
> **Team: Beevil Knievel**

---

## ⏱️ Video Structure Overview (180 Seconds Total)

| Timestamp | Section | Visual Screen Recording | Speaker |
|---|---|---|---|
| **0:00 – 0:30** | The Crisis: Honey Fraud & Colony Collapse | Problem slides + footage of adulterated syrup vs living apiary | **Member 1 (Lead)** |
| **0:30 – 1:00** | Edge IoT & AI Diagnostic Models | Hardware schematic, 32B payload struct + AI 1D-CNN spectrum | **Member 2 & 3** |
| **1:00 – 1:30** | DePIN Blockchain & Multi-Oracle Consensus | Terminal CLI demo (`demo_honeychain_flow.py`) + Hardhat tests | **Member 4** |
| **1:30 – 2:15** | Live Web App Demo: Verify & Label Generator | Screen recording of `/verify/1` + `/dashboard` Jar Label Modal | **Member 5** |
| **2:15 – 2:45** | KVIC Rural Scalability & Offline Sync | Screen recording of `/kvic-onboard` + SQLite offline queue | **Member 6** |
| **2:45 – 3:00** | Conclusion & Impact | Summary slide with GitHub QR code + Team callout | **Member 1 (Lead)** |

---

## 🎙️ Exact Audio Narration & Screen Directions

### [0:00 – 0:30] Introduction & Problem Statement
* **Visual**: Show title slide, then cut to honey adulteration statistics (3rd most faked food) and Varroa mite damage in bee colonies.
* **Audio (Member 1)**:
  > *"Every year, millions of consumers unknowingly buy adulterated sugar syrup disguised as pure honey, while rural Indian beekeepers lose their livelihoods to undetected diseases like Varroa mites. Existing traceability relies on paper factory certificates, with zero proof from the live hive. We are Team Beevil Knievel, presenting **HoneyChain**—the first DePIN and AI-IoT smart automation platform that gives every jar of honey a mathematically verifiable digital identity."*

---

### [0:30 – 1:00] Edge IoT & Multi-Tier AI Diagnostics
* **Visual**: Cut to 32-byte packed binary struct diagram, then to the 8-band FFT acoustic spectrum bar chart on the live dashboard.
* **Audio (Member 2 & 3)**:
  > *"At the edge, our Nordic nRF52840 sensor nodes monitor brood nest temperature, humidity, and acoustic signatures, packing them into an ECDSA-signed 32-byte LoRa frame. Model V2, our 980-byte TinyML triage engine, runs in under 1 millisecond on the MCU to filter 95% of routine data. On the gateway, a 1D-CNN acoustic model detects Varroa destructor and foulbrood with 96.4% accuracy, while our LSTM forecasts swarming risk 24 hours in advance."*

---

### [1:00 – 1:30] DePIN Blockchain & 2-of-3 Oracle Consensus
* **Visual**: Screen capture of terminal running `python demo_honeychain_flow.py` and showing `HoneyProvenance.sol` passing 9/9 Hardhat tests.
* **Audio (Member 4)**:
  > *"To ensure tamper-proof provenance without gas bloat, daily curing summaries are compiled into a sorted-pair Keccak-256 Merkle tree. Only the 32-byte root is anchored on Polygon Amoy. A harvest batch is only finalized when a **2-of-3 multi-oracle quorum** co-signs the proposal, preventing any single compromised node from faking history."*

---

### [1:30 – 2:15] Live Consumer QR Verification & Jar Label Generator
* **Visual**: Open `localhost:3000/verify/1`. Click "Validate Merkle Proof" (shows green checkmark). Scroll down to the 21-day temperature graph and AI health score. Then switch to `/dashboard` and open the **"Generate Jar Label"** modal, showing the printable SVG sticker.
* **Audio (Member 5)**:
  > *"For consumers, verification is 100% gasless with zero crypto wallet required. Scanning the jar's QR code makes a direct view call to the smart contract, validating the Merkle proof in under 5 milliseconds in the browser. On the Beekeeper Dashboard, beekeepers can manage 100-hive fleets and instantly print high-resolution 300 DPI vector jar labels with embedded QR codes and holographic security seals."*

---

### [2:15 – 2:45] KVIC Rural Model & Offline Resilience
* **Visual**: Show `/kvic-onboard` form, demonstrating registration of Hive #108, then toggle the "Offline SQLite Cache" button on the dashboard.
* **Audio (Member 6)**:
  > *"HoneyChain is engineered for rural MSME clusters under KVIC. One shared community gateway services 20 hives, while our software-only onboarding portal enables beekeepers without IoT hardware to register using smartphone inspection logs. When rural connectivity drops, our offline SQLite buffer queues transactions locally and syncs automatically upon reconnection."*

---

### [2:45 – 3:00] Conclusion
* **Visual**: Final slide showing GitHub repository URL (`github.com/atharveeee-netizen/sih`) and team contact info.
* **Audio (Member 1)**:
  > *"With 100% test coverage, trained AI models, and an active smart contract, HoneyChain transforms Indian apiculture into a high-trust, premium export industry. Thank you!"*
