# 🖥️ BEEVIL KNIEVEL RECEIVER GATEWAY BASEBOARD SCHEMATIC
## High-Performance Edge Gateway (Orange Pi CM5 6 TOPS NPU + RAK2287 LoRaWAN Concentrator + PoE)

> **Status: PROPOSED, not built.**
>
> **What was built and tested.** A **Raspberry Pi 3B+ with a Waveshare SX1262
> LoRa HAT**, listed in [BOM_AND_PINOUT.md](BOM_AND_PINOUT.md). Every gateway
> measurement in this repository comes off that board. No custom PCB was
> fabricated.
>
> **What was procured but never fitted.** A **Raspberry Pi Compute Module 4**
> was bought, but no carrier board was obtained for it, so it was never
> brought up and contributes no results here.
>
> **What is proposed.** The Orange Pi CM5 and RAK2287 baseboard described
> below is the Phase 2 scaling path for concurrent multi spreading factor
> reception at cluster scale. It has not been fabricated. See
> [docs/ARCHITECTURE_CONTRADICTIONS.md](../docs/ARCHITECTURE_CONTRADICTIONS.md)
> for the full validated versus proposed ledger.

_The baseboard render for this proposed design is not committed._

---

## 📐 Circuit Architecture Overview

### 1. High-Density Compute Module Interface
- **Mezzanine Connectors**: Dual 100-pin high-speed Board-to-Board (B2B) connectors interfacing the **Orange Pi CM5** (Rockchip RK3588S octa-core processor + **built-in 6 TOPS NPU**).
- **Power Rail**: DC-DC 5V / 3.3V 5A synchronous buck step-down converter rail.

### 2. Peripheral Systems & Interface Busses
- **Power over Ethernet (PoE 802.3af/at)**: 48V to 5V DC Power Delivery (PD) controller block (TPS23753A / Si3404).
- **LoRaWAN Concentrator Slot**: Mini-PCIe interface powering the **RAK2287 SX1302 8-Channel Gateway Module** (IN865 / EU868 band).
- **M.2 Key-M Slot**: Single-lane PCIe 2.0 interface for NVMe M.2 SSD storage extension.
- **Dual Gigabit Ethernet**: Realtek RTL8211F GbE transceivers.
- **USB 3.0 Host**: VIA VL805 PCIe-to-USB 3.0 quad-port controller.
