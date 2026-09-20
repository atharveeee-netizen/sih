import os
import fitz  # PyMuPDF
import textwrap

def generate_svg_markup(include_a_tags=True):
    width = 1920
    height = 1080

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}" style="background-color: #f8fafc; font-family: 'Segoe UI', Arial, -apple-system, sans-serif;">

  <!-- BACKGROUND -->
  <rect width="{width}" height="{height}" fill="#fcfcfd"/>

  <!-- ================= HEADER SECTION ================= -->
  <!-- Beevil Knievel Oval Badge (Top Left) -->
  <g transform="translate(36, 16)">
    <!-- Oval Shadow -->
    <ellipse cx="117" cy="48" rx="112" ry="42" fill="#e2e8f0"/>
    <!-- Oval Base -->
    <ellipse cx="115" cy="46" rx="112" ry="42" fill="#fcf8f0" stroke="#1e293b" stroke-width="2.5"/>
    <text x="115" y="38" font-size="26" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" letter-spacing="0.5">Beevil</text>
    <text x="115" y="68" font-size="26" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" letter-spacing="0.5">Knievel</text>
  </g>

  <!-- Title (Center) -->
  <text x="960" y="74" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" letter-spacing="2">RESEARCH AND REFERENCES</text>

  <!-- SIH 2026 Logo Badge (Top Right) -->
  <g transform="translate(1680, 14)">
    <!-- Lightbulb icon -->
    <g transform="translate(0, 8)">
      <path d="M28 4 C18 4 10 12 10 22 C10 28 14 33 17 37 L17 43 C17 44.5 18.5 46 20 46 L36 46 C37.5 46 39 44.5 39 43 L39 37 C42 33 46 28 46 22 C46 12 38 4 28 4 Z" fill="#ffcc00" stroke="#d99b26" stroke-width="2"/>
      <path d="M20 48 L36 48 M23 52 L33 52 M25 56 L31 56" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 18 Q28 10 36 18" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="28" y1="-2" x2="28" y2="2" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="44" y1="4" x2="41" y2="7" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="4" x2="15" y2="7" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <!-- SIH 2026 Text -->
    <text x="70" y="44" font-size="42" font-weight="900" fill="#0f172a" font-family="'Segoe UI', Arial, sans-serif">SIH</text>
    <text x="70" y="78" font-size="34" font-weight="800" fill="#0f172a" font-family="'Segoe UI', Arial, sans-serif">2026</text>
  </g>

  <!-- Horizontal Dark Blue Divider Line -->
  <rect x="25" y="118" width="1870" height="4" fill="#1a365d"/>

  <!-- ================= COLUMN HEADERS ================= -->
  <!-- Column 1 Header: Academic Research -->
  <g transform="translate(36, 134)">
    <path d="M8 22 L34 10 L60 22 L34 34 Z" fill="#1a365d"/>
    <path d="M20 28 L20 40 C20 46 48 46 48 40 L48 28" fill="none" stroke="#1a365d" stroke-width="3" stroke-linecap="round"/>
    <path d="M56 24 L56 40" stroke="#1a365d" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="56" cy="42" r="2.5" fill="#1a365d"/>
    <text x="76" y="20" font-size="14" font-weight="800" fill="#1a365d" letter-spacing="1">COLUMN 1</text>
    <text x="76" y="44" font-size="23" font-weight="800" fill="#0f172a">Academic Research</text>
  </g>

  <!-- Column 2 Header: Standards and Regulations -->
  <g transform="translate(668, 134)">
    <path d="M12 18 L34 8 L56 18 Z" fill="#1a365d"/>
    <rect x="14" y="20" width="40" height="4" fill="#1a365d"/>
    <rect x="18" y="26" width="4" height="15" fill="#1a365d"/>
    <rect x="28" y="26" width="4" height="15" fill="#1a365d"/>
    <rect x="36" y="26" width="4" height="15" fill="#1a365d"/>
    <rect x="46" y="26" width="4" height="15" fill="#1a365d"/>
    <rect x="12" y="42" width="44" height="5" fill="#1a365d"/>
    <text x="76" y="20" font-size="14" font-weight="800" fill="#1a365d" letter-spacing="1">COLUMN 2</text>
    <text x="76" y="44" font-size="23" font-weight="800" fill="#0f172a">Standards and Regulations</text>
  </g>

  <!-- Column 3 Header: Open Source and Technical Docs -->
  <g transform="translate(1300, 134)">
    <rect x="10" y="8" width="50" height="40" rx="7" fill="#1a365d"/>
    <path d="M19 20 L28 28 L19 36" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="33" y1="36" x2="45" y2="36" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <text x="76" y="20" font-size="14" font-weight="800" fill="#1a365d" letter-spacing="1">COLUMN 3</text>
    <text x="76" y="44" font-size="23" font-weight="800" fill="#0f172a">Open Source and Technical Docs</text>
  </g>
'''

    def render_card(x, y, w, h, ref_id, bold_text, normal_text, link_url=None):
        doc_icon = '''
        <g transform="translate(25, 48)">
          <path d="M0 0 L18 0 L26 8 L26 34 L0 34 Z" fill="#ffffff" stroke="#111111" stroke-width="2"/>
          <path d="M18 0 L18 8 L26 8" fill="none" stroke="#111111" stroke-width="1.8"/>
          <line x1="5" y1="14" x2="21" y2="14" stroke="#111111" stroke-width="2" stroke-linecap="round"/>
          <line x1="5" y1="20" x2="21" y2="20" stroke="#111111" stroke-width="2" stroke-linecap="round"/>
          <line x1="5" y1="26" x2="16" y2="26" stroke="#111111" stroke-width="2" stroke-linecap="round"/>
        </g>
        '''
        
        combined = bold_text + " " + normal_text
        wrapped_lines = textwrap.wrap(combined, width=54)
        
        text_svg = ""
        line_y = 28
        
        for idx, line in enumerate(wrapped_lines[:4]):
            if idx == 0 and bold_text in line:
                rem = line[len(bold_text):].strip()
                text_svg += f'<text x="96" y="{line_y}" font-size="13.5" font-family="\'Segoe UI\', Arial, sans-serif" fill="#0f172a"><tspan font-weight="800">{bold_text} </tspan><tspan font-weight="400">{rem}</tspan></text>\n'
            else:
                text_svg += f'<text x="96" y="{line_y}" font-size="13.5" font-family="\'Segoe UI\', Arial, sans-serif" font-weight="400" fill="#1e293b">{line}</text>\n'
            line_y += 21

        content = f'''
  <g transform="translate({x}, {y})">
    <!-- Offset shadow -->
    <rect x="2" y="2" width="{w}" height="{h}" rx="14" fill="#e2e8f0"/>
    <!-- Base White Card -->
    <rect width="{w}" height="{h}" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Left Amber Tab -->
    <path d="M 0,14 A 14,14 0 0 1 14,0 L 76,0 L 76,{h} L 14,{h} A 14,14 0 0 1 0,{h-14} Z" fill="#ebb03c"/>
    <text x="38" y="34" font-size="17" font-weight="800" font-family="\'Segoe UI\', Arial, sans-serif" fill="#111111" text-anchor="middle">{ref_id}</text>
    {doc_icon}
    
    <!-- Body Text -->
    {text_svg}
  </g>
'''
        if include_a_tags and link_url:
            return f'<a xlink:href="{link_url}" target="_blank">\n{content}\n</a>\n'
        return content

    col_w = 584
    card_h = 138
    
    cards_col1 = [
        ("Ref 1", "Mondal S. et al., 2019 –", "Blockchain Inspired RFID-Based Information Architecture for Food Supply Chain. IEEE Internet of Things Journal, DOI:10.1109/JIOT.2019", "https://doi.org/10.1109/JIOT.2019"),
        ("Ref 2", "Ferrag MA. et al., 2018 –", "Blockchain Technologies for the Internet of Things: Research Issues and Challenges. IEEE of Things Journal, Vol.6, pp.2188-2204, DOI:10.1109/JIOT.2018.2882794", "https://doi.org/10.1109/JIOT.2018.2882794"),
        ("Ref 3", "Saberi S. et al., 2019 –", "Blockchain technology and its relationships to sustainable supply chain management. International Journal of Production Research, Vol.57(7), pp.2117-2135", "https://doi.org/10.1080/00207543.2018.1533261"),
        ("Ref 4", "Tzachor A. et al., 2021 –", "Responsible Artificial Intelligence in Agriculture requires systemic understanding of risks and externalities. Nature Machine Intelligence", "https://doi.org/10.1038/s42256-021-00414-9"),
    ]
    
    cards_col2 = [
        ("Ref 5", "FSSAI 2020 –", "Food Safety and Standards (Food Products Standards and Food Additives) Regulations: Honey moisture less than 20 percent, HMF limits, adulteration thresholds", "https://fssai.gov.in"),
        ("Ref 6", "BIS IS 4941:2023 –", "Indian Standard for Honey: Quality parameters, pollen analysis, pure botanical origin labeling, test specifications", "https://bis.gov.in"),
        ("Ref 7", "KVIC Annual Report 2023-24 –", "Ministry of MSME: National Bee Mission targets, tribal beekeeper livelihood data, Langstroth hive distribution statistics", "https://kvic.gov.in"),
        ("Ref 8", "LoRa Alliance –", "IN865-867MHz Regional Parameters v1.0.3 – India sub-GHz LoRaWAN band plan, dwell times and transmit limits", "https://lora-alliance.org"),
    ]
    
    cards_col3 = [
        ("Ref 9", "Polygon Technology –", "Polygon PoS Technical Documentation v2 – EVM sidechain, Amoy testnet, MATIC gas mechanism, smart contract state verification", "https://docs.polygon.technology"),
        ("Ref 10", "Nordic Semiconductor –", "nRF52840 Product Specification v1.7 – SoC multiprotocol, 18uA sleep current, BLE 5, ARM Cortex-M4F acoustic compute", "https://nordicsemi.com"),
        ("Ref 11", "Semtech –", "SX1262 Datasheet Rev 2.1 – LoRa sub-GHz transceiver, plus 22dBm output, minus 148dBm sensitivity in apiary wireless nodes", "https://semtech.com"),
        ("Ref 12", "NomicFoundation –", "Hardhat Ethereum Development Environment, v2.22 – Automated test framework & dual-EOA deployment: github.com/NomicFoundation/hardhat", "https://github.com/NomicFoundation/hardhat"),
    ]

    y_starts = [190, 338, 486, 634]
    
    for i in range(4):
        y = y_starts[i]
        c1 = cards_col1[i]
        svg += render_card(36, y, col_w, card_h, c1[0], c1[1], c1[2], c1[3])
        c2 = cards_col2[i]
        svg += render_card(668, y, col_w, card_h, c2[0], c2[1], c2[2], c2[3])
        c3 = cards_col3[i]
        svg += render_card(1300, y, col_w, card_h, c3[0], c3[1], c3[2], c3[3])

    # ================= RECONFIGURED INTERACTIVE LINKS DOCK (Bottom Section) =================
    dock_y = 795
    dock_h = 265
    
    # YouTube Card
    yt_card = '''
      <g transform="translate(24, 88)">
        <!-- Shadow -->
        <rect x="2" y="2" width="588" height="152" rx="12" fill="#fee2e2"/>
        <!-- Card -->
        <rect width="588" height="152" rx="12" fill="#ffffff" stroke="#ef4444" stroke-width="2"/>
        
        <!-- Red YouTube Icon Badge -->
        <g transform="translate(18, 16)">
          <rect width="48" height="34" rx="8" fill="#ff0000"/>
          <path d="M19 10 L33 17 L19 24 Z" fill="#ffffff"/>
        </g>
        
        <!-- Label & Details -->
        <text x="76" y="30" font-size="17" font-weight="900" fill="#b91c1c" font-family="'Segoe UI', Arial, sans-serif">YOUTUBE VIDEO DEMONSTRATION</text>
        <text x="76" y="48" font-size="13" font-weight="600" fill="#475569" font-family="'Segoe UI', Arial, sans-serif">Complete Extended 8m 54s Edge AI &amp; Blockchain Walkthrough</text>
        
        <!-- Clickable URL Box -->
        <rect x="18" y="66" width="552" height="42" rx="8" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
        <text x="32" y="92" font-size="16" font-weight="800" fill="#991b1b" font-family="'Segoe UI', Arial, sans-serif">https://youtu.be/H-zuEF6TKJk</text>
        
        <!-- Action Button Pill -->
        <rect x="435" y="72" width="125" height="30" rx="6" fill="#dc2626"/>
        <text x="497" y="92" font-size="12.5" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif">WATCH DEMO ↗</text>
        
        <text x="24" y="132" font-size="12" font-weight="600" fill="#64748b" font-family="'Segoe UI', Arial, sans-serif">Verified: Full End-to-End Hardware &amp; Polygon PoS Smart Contract Execution</text>
      </g>
    '''

    # Drive Card
    drive_card = '''
      <g transform="translate(630, 88)">
        <!-- Shadow -->
        <rect x="2" y="2" width="588" height="152" rx="12" fill="#dbeafe"/>
        <!-- Card -->
        <rect width="588" height="152" rx="12" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
        
        <!-- Blue Google Drive Icon Badge -->
        <g transform="translate(18, 14)">
          <path d="M18 4 L34 4 L48 28 L32 28 Z" fill="#4285f4"/>
          <path d="M10 36 L18 22 L48 22 L40 36 Z" fill="#34a853"/>
          <path d="M4 26 L19 0 L27 14 L12 40 Z" fill="#fbbc05" transform="scale(0.9) translate(4, 2)"/>
        </g>
        
        <!-- Label & Details -->
        <text x="76" y="30" font-size="17" font-weight="900" fill="#1d4ed8" font-family="'Segoe UI', Arial, sans-serif">ANSYS SIMULATION DATA SUITE</text>
        <text x="76" y="48" font-size="13" font-weight="600" fill="#475569" font-family="'Segoe UI', Arial, sans-serif">Langstroth Hive Acoustic Resonance &amp; Thermal FEA Models</text>
        
        <!-- Clickable URL Box -->
        <rect x="18" y="66" width="552" height="42" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
        <text x="32" y="92" font-size="13" font-weight="800" fill="#1e40af" font-family="'Segoe UI', Arial, sans-serif">drive.google.com/.../folders/1mcRlA34NsPGypRmftliZy71pt72OI7e1</text>
        
        <!-- Action Button Pill -->
        <rect x="435" y="72" width="125" height="30" rx="6" fill="#2563eb"/>
        <text x="497" y="92" font-size="12.5" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif">OPEN DRIVE ↗</text>
        
        <text x="24" y="132" font-size="12" font-weight="600" fill="#64748b" font-family="'Segoe UI', Arial, sans-serif">Complete Raw Results: Modal acoustics, 300-500Hz piping &amp; CFD heat distribution</text>
      </g>
    '''

    # GitHub Card
    git_card = '''
      <g transform="translate(1236, 88)">
        <!-- Shadow -->
        <rect x="2" y="2" width="588" height="152" rx="12" fill="#e2e8f0"/>
        <!-- Card -->
        <rect width="588" height="152" rx="12" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        
        <!-- Dark GitHub Icon Badge -->
        <g transform="translate(18, 14)">
          <circle cx="20" cy="18" r="18" fill="#0f172a"/>
          <path d="M20 6 C12.3 6 6 12.3 6 20 C6 26.2 10 31.4 15.6 33.3 C16.3 33.4 16.6 33 16.6 32.6 C16.6 32.2 16.6 31.2 16.6 29.9 C12.7 30.7 11.9 28.1 11.9 28.1 C11.3 26.5 10.4 26 10.4 26 C9.1 25.1 10.5 25.1 10.5 25.1 C11.9 25.2 12.7 26.6 12.7 26.6 C14 28.7 16 28.1 16.8 27.8 C16.9 26.8 17.3 26.1 17.8 25.7 C14.7 25.3 11.4 24.1 11.4 18.8 C11.4 17.3 11.9 16.1 12.8 15.1 C12.6 14.7 12.2 13.3 12.9 11.5 C12.9 11.5 14.1 11.1 16.7 12.9 C17.8 12.6 19 12.4 20.1 12.4 C21.2 12.4 22.4 12.6 23.5 12.9 C26.1 11.1 27.3 11.5 27.3 11.5 C28 13.3 27.6 14.7 27.4 15.1 C28.3 16.1 28.8 17.3 28.8 18.8 C28.8 24.1 25.5 25.3 22.4 25.7 C23 26.2 23.5 27.2 23.5 28.7 C23.5 30.8 23.5 32.5 23.5 32.6 C23.5 33 23.8 33.4 24.5 33.3 C30.1 31.4 34.1 26.2 34.1 20 C34.1 12.3 27.8 6 20 6 Z" fill="#ffffff"/>
        </g>
        
        <!-- Label & Details -->
        <text x="76" y="30" font-size="17" font-weight="900" fill="#0f172a" font-family="'Segoe UI', Arial, sans-serif">OPEN SOURCE REPOSITORY</text>
        <text x="76" y="48" font-size="13" font-weight="600" fill="#475569" font-family="'Segoe UI', Arial, sans-serif">Full Firmware, Schematics, Smart Contracts &amp; PWA</text>
        
        <!-- Clickable URL Box -->
        <rect x="18" y="66" width="552" height="42" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="32" y="92" font-size="16" font-weight="800" fill="#0f172a" font-family="'Segoe UI', Arial, sans-serif">github.com/atharveeee-netizen/sih</text>
        
        <!-- Action Button Pill -->
        <rect x="435" y="72" width="125" height="30" rx="6" fill="#0f172a"/>
        <text x="497" y="92" font-size="12.5" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif">VIEW CODE ↗</text>
        
        <text x="24" y="132" font-size="12" font-weight="600" fill="#64748b" font-family="'Segoe UI', Arial, sans-serif">Team: Beevil Knievel | Smart India Hackathon (SIH 2026) Problem Statement</text>
      </g>
    '''

    if include_a_tags:
        yt_rendered = f'<a xlink:href="https://youtu.be/H-zuEF6TKJk" target="_blank">\n{yt_card}\n</a>'
        drive_rendered = f'<a xlink:href="https://drive.google.com/drive/folders/1mcRlA34NsPGypRmftliZy71pt72OI7e1?usp=sharing" target="_blank">\n{drive_card}\n</a>'
        git_rendered = f'<a xlink:href="https://github.com/atharveeee-netizen/sih" target="_blank">\n{git_card}\n</a>'
    else:
        yt_rendered = yt_card
        drive_rendered = drive_card
        git_rendered = git_card

    svg += f'''
  <!-- ================= DEDICATED LINKS & VERIFICATION DOCK ================= -->
  <g transform="translate(36, {dock_y})">
    <!-- Dock Shadow -->
    <rect x="2" y="2" width="1848" height="{dock_h}" rx="16" fill="#e2e8f0"/>
    
    <!-- Dock Base Container -->
    <rect width="1848" height="{dock_h}" rx="16" fill="#fdfbf7" stroke="#e09f2b" stroke-width="2.5"/>
    
    <!-- Dock Title Banner Header -->
    <path d="M 0,16 A 16,16 0 0 1 16,0 L 1832,0 A 16,16 0 0 1 1848,16 L 1848,46 L 0,46 Z" fill="#ebb03c"/>
    <text x="924" y="31" font-size="19" font-weight="900" fill="#111111" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" letter-spacing="1">PROJECT ARTIFACTS, SIMULATION MODELS &amp; LIVE DEMO VERIFICATION LINKS</text>

    <!-- Subtitle Guide -->
    <text x="924" y="72" font-size="14" font-weight="700" fill="#475569" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif">Click any card below to launch resource directly, or copy the URL into your presentation deck / Canva:</text>

    <!-- ================= THREE DEDICATED LINK CARDS ================= -->
    {yt_rendered}
    {drive_rendered}
    {git_rendered}

  </g>
</svg>
'''
    return svg

def main():
    # 1. SVG for Canva / Web (includes live <a xlink:href>)
    svg_interactive = generate_svg_markup(include_a_tags=True)
    svg_path = r"C:\Users\noobg\.gemini\antigravity-ide\scratch\sih\research_and_references_sih.svg"
    desktop_svg = r"C:\Users\noobg\OneDrive\Desktop\research_and_references_sih.svg"
    
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_interactive)
    with open(desktop_svg, "w", encoding="utf-8") as f:
        f.write(svg_interactive)
    print("Interactive SVG saved.")

    # 2. SVG for PyMuPDF raster rendering (no <a> tags so all cards render completely)
    svg_render = generate_svg_markup(include_a_tags=False)
    doc = fitz.open(stream=svg_render.encode('utf-8'), filetype='svg')
    page = doc[0]
    
    # 1080p PNG
    pix = page.get_pixmap(dpi=72)
    png_path = r"C:\Users\noobg\.gemini\antigravity-ide\scratch\sih\research_and_references_sih.png"
    desktop_png = r"C:\Users\noobg\OneDrive\Desktop\research_and_references_sih.png"
    pix.save(png_path)
    pix.save(desktop_png)
    print("PNG rendered:", pix.width, "x", pix.height)

    # 4K Ultra HD PNG (3840x2160) for Canva importing!
    pix_2x = page.get_pixmap(dpi=144)
    desktop_2x_png = r"C:\Users\noobg\OneDrive\Desktop\research_and_references_sih_4k.png"
    pix_2x.save(desktop_2x_png)
    print("4K PNG rendered:", pix_2x.width, "x", pix_2x.height)

    # 3. PDF with native clickable link annotations
    pdf_bytes = doc.convert_to_pdf()
    pdf_doc = fitz.open("pdf", pdf_bytes)
    pdf_page = pdf_doc[0]
    
    # Scale from 1920x1080 viewBox to PDF points
    # fitz converts 1 SVG pixel = 1 pt by default
    scale_x = pdf_page.rect.width / 1920.0
    scale_y = pdf_page.rect.height / 1080.0
    
    def add_link(x, y, w, h, uri):
        r = fitz.Rect(x * scale_x, y * scale_y, (x + w) * scale_x, (y + h) * scale_y)
        pdf_page.insert_link({"kind": fitz.LINK_URI, "from": r, "uri": uri})
    
    # Add clickable areas for bottom 3 cards
    # YT: translate(36+24, 795+88) = (60, 883), w=588, h=152
    add_link(60, 883, 588, 152, "https://youtu.be/H-zuEF6TKJk")
    # Drive: translate(36+630, 795+88) = (666, 883), w=588, h=152
    add_link(666, 883, 588, 152, "https://drive.google.com/drive/folders/1mcRlA34NsPGypRmftliZy71pt72OI7e1?usp=sharing")
    # GitHub: translate(36+1236, 795+88) = (1272, 883), w=588, h=152
    add_link(1272, 883, 588, 152, "https://github.com/atharveeee-netizen/sih")
    
    # Add clickable areas for the 12 reference cards
    ref_links = [
        # Col 1
        (36, 190, 584, 138, "https://doi.org/10.1109/JIOT.2019"),
        (36, 338, 584, 138, "https://doi.org/10.1109/JIOT.2018.2882794"),
        (36, 486, 584, 138, "https://doi.org/10.1080/00207543.2018.1533261"),
        (36, 634, 584, 138, "https://doi.org/10.1038/s42256-021-00414-9"),
        # Col 2
        (668, 190, 584, 138, "https://fssai.gov.in"),
        (668, 338, 584, 138, "https://bis.gov.in"),
        (668, 486, 584, 138, "https://kvic.gov.in"),
        (668, 634, 584, 138, "https://lora-alliance.org"),
        # Col 3
        (1300, 190, 584, 138, "https://docs.polygon.technology"),
        (1300, 338, 584, 138, "https://nordicsemi.com"),
        (1300, 486, 584, 138, "https://semtech.com"),
        (1300, 634, 584, 138, "https://github.com/NomicFoundation/hardhat"),
    ]
    for rx, ry, rw, rh, ruri in ref_links:
        add_link(rx, ry, rw, rh, ruri)
        
    pdf_path = r"C:\Users\noobg\OneDrive\Desktop\research_and_references_sih_slide.pdf"
    pdf_doc.save(pdf_path)
    print("Interactive PDF slide saved.")

if __name__ == "__main__":
    main()
