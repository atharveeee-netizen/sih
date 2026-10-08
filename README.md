# Honey Chain

**Smart India Hackathon 2026 - Problem Statement 26021**
Ministry of MSME, Coordination Section - Agriculture, FoodTech and Rural Development

A blockchain based honey traceability and smart beekeeping system: QR code consumer
verification, secure batch tracking, and IoT plus AI hive monitoring for the KVIC
Honey Mission.

**Team Beevil Knievel** - Atharve Dahima, Srajan Mishra, Kavin

---

## What this repository is

The problem statement asks for three things. This README is organised around those
three, and each section says what was built, where the code is, and the command that
proves it. If you only have ten minutes, run the block in section 1.

---

## 1. Blockchain traceability with QR consumer authentication

**Built.** Two Solidity contracts covering the full custody lifecycle: register a
beekeeper, submit a harvest, officer approval and mint, custody transfer, QR
commit-reveal binding, consumer scan recording, fraud flagging, dispute resolution,
batch revocation, under-cap PIN claim, and direct farmer tipping. Roles are separated
into beekeeper, field officer and district supervisor.

Anti-counterfeiting uses a commit-reveal scheme: the QR seed hash is committed on
chain *before* the token is issued, so a token cannot be forged after the fact and a
QR cannot be quietly repointed at a different batch later.

Beekeepers never hold a wallet, buy cryptocurrency, or pay gas. The server derives and
holds a per farmer key and funds it before signing, so a beekeeper with a basic phone
takes part without knowing what a blockchain is.

**Where.** `contracts/contracts/HoneyChain.sol`, `contracts/contracts/HoneyChainQR.sol`
Consumer verification UI: `frontend/src/app/verify/`
Officer portal: `frontend/src/app/dashboard/`

**Verify.**

```bash
cd contracts && npm install && npx hardhat test
```

Expected: **68 passing**. The suite covers role permissions, the full mint lifecycle,
multi farmer batch contributions, and QR clone detection (a token scanned past a
threshold is flagged suspicious).

To run the whole system locally you need three terminals: a local Hardhat chain,
a contract deploy, then the web app. The web app needs its environment file first,
otherwise `prisma` has no database URL and the build stops:

```bash
cd frontend
cp .env.example .env          # required, defaults to a local SQLite file
npm install
npm run db:push && npm run db:seed
npm run dev                   # http://localhost:3000
```

Full step by step, including the two chain terminals, is in [DEMO.md](DEMO.md).

---

## 2. IoT hive monitoring and AI analytics

**Built.** A sensor node that lives between the frames and reports without the hive
being opened. Temperature is the primary signal: a TI TMP117 reads the brood core to
0.1 C, and five DS18B20 probes map the gradient out to the wall. Acoustics, CO2,
humidity, VOC, weight and tilt are also carried.

Telemetry leaves as a fixed **40 byte binary frame** (`protocol_version` 0x02,
enforced by `static_assert` in all three firmware targets) over sub GHz LoRa to a
gateway that logs to SQLite locally, so an apiary with no connectivity keeps every
reading.

Analytics run in two places. On the node, a 256 point real FFT via ARM CMSIS-DSP
reduces each acoustic frame to band energies, and a Page CUSUM filter watches for the
slow downward temperature drift that indicates a failing queen. Off the node, a
FastAPI service scores honey quality against FSSAI parameters and classifies
adulterants, and a Random Forest advisor flags colony pathology.

**Where.** `firmware/` (node), `gateway/` (receiver, SQLite, blockchain bridge),
`ai_service/` (FSSAI scoring and adulterant classifier), `Cloud Model/` (pathology
advisor), `TinyML Model/` (acoustic classifier), `iot_simulator/` (run without hardware)

**Verify.**

```bash
cd contracts && npx hardhat compile && cd ..   # gateway reads ABIs from these artifacts
pip install -r gateway/requirements.txt
python gateway/seed_honeychain_demo.py    # seeds the gateway database
python -m pytest tests/                   # 39 passing

cd ai_service && python train.py          # rebuilds both model files
```

Trained model files are not committed; `train.py` regenerates them from the
benchmark dataset in `ai_service/dataset/`.

---

## 3. Scalable deployment framework

**Built.** A star topology where one gateway covers a cluster of hives rather than one
radio per hive, which is what makes a KVIC district deployable at sensible cost. The
gateway holds its own SQLite write ahead log, so the system degrades to offline rather
than failing. Consumer verification also has an SMS and USSD path prototyped for
feature phones.

Hardware feasibility was checked in simulation before anything was ordered: eleven
Ansys solvers covering antenna return loss through timber and comb, enclosure thermals,
drop shock, modal isolation from the bee band, switching flux at the sensor, in hive
airflow, battery winter thermal, wind load, bus signal integrity, microphone trace
parasitics, and solar harvest.

**Full solver output.** The workbench binaries and full resolution renders
are published outside git: https://drive.google.com/drive/folders/1mcRlA34NsPGypRmftliZy71pt72OI7e1?usp=sharing

**Where.** `simulations/screenshots_for_judges/` (the eleven result figures),
`hardware/` (bill of materials and pinout), `docs/` (deployment and reproducibility),
`tests/simulate_100_hives.py` (scaling load test)

---

## Honest scope

Read **[LIMITATIONS.md](LIMITATIONS.md)** before judging any claim in here. In short:
this is a working bench prototype, not a season in a live apiary. The acoustic model is
trained on an annotated European dataset and would need retuning for Indian
subspecies, the pathology model is trained on parametric synthetic data grounded in
published literature, and radio range figures are calculated link budgets rather than
walked field measurements. Those distinctions are labelled throughout rather than
smoothed over.

---

## Repository map

| Path | What it is |
|---|---|
| `contracts/` | Solidity contracts, Hardhat tests, deploy scripts |
| `frontend/` | Next.js officer portal and consumer verification |
| `farmer_ui/` | Beekeeper companion app, multi language, offline first |
| `firmware/` | nRF52840 sensor node, 40 byte LoRa telemetry |
| `gateway/` | LoRa receiver, SQLite store, blockchain bridge |
| `ai_service/` | FSSAI quality scoring and adulterant classifier |
| `Cloud Model/`, `TinyML Model/` | Colony pathology advisor, acoustic classifier |
| `iot_simulator/` | Telemetry generator, runs without hardware |
| `simulations/` | Ansys results, curated figures for review |
| `hardware/` | BOM, pinout, enclosure |
| `tests/` | Gateway pipeline, telemetry, end to end |
| `docs/` | Architecture, validation status, deployment |

Large media (rendered video, raw production footage, Ansys workbench binaries,
trained model files) is intentionally not committed, so the repository stays quick to
clone. See `.gitignore` for the list and the regeneration command.

---

## Attribution

The blockchain layer of this project builds on an MIT licensed open source
project by another SIH 2026 team, rather than being written from scratch:

> **HoneyChain** by Shivam Gawade, Rahul Rathod, Rehan Harmalkar,
> Avneesh Walwalkar, Sunehri Sonar and Shaunak Pai (Team Crimson Syndicate)
> <https://github.com/ShivamGawade-XS/HoneyChain_SIH2026>

Their work underpins the Solidity contracts and test suite, the AI quality and
adulterant service, the telemetry generator, and parts of the web application.
Individual files keep their original author headers, and the full MIT notice is
reproduced in [NOTICE](NOTICE).

What Team Beevil Knievel contributed on top: the entire hardware and IoT stack
(nRF52840 sensor node, 40 byte LoRa telemetry protocol, receiving gateway and
local store), the beekeeper companion application, the eleven Ansys studies and
the analytical models behind them, the colony pathology advisor and on-node
acoustic classifier, and the integration that ties the physical hive to the
chain.

## Licence

Original Beevil Knievel work is all rights reserved, for evaluation only.
Third party components remain under their own MIT licence. See
[LICENSE](LICENSE) and [NOTICE](NOTICE).
