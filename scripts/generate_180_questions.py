#!/usr/bin/env python3
"""
Master Builder: 180 SIH Grand Jury Questions & Technical Terminology Dossier
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel (HoneyChain)

Compiles all 180 questions into:
1. documentation/HONEYCHAIN_180_JURY_QUESTIONS_MASTER_DEFENSE.md
2. documentation/HoneyChain_180_Jury_Questions_Master_Defense.pdf
3. <brain_artifacts>/HoneyChain_180_Jury_Questions_Master_Defense.pdf
"""

import os
import sys
import shutil

# Ensure scripts directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from questions_member1 import QUESTIONS_MEMBER_1, MEMBER_1_INFO
from questions_member2 import QUESTIONS_MEMBER_2, MEMBER_2_INFO
from questions_member3 import QUESTIONS_MEMBER_3, MEMBER_3_INFO
from questions_member4 import QUESTIONS_MEMBER_4, MEMBER_4_INFO
from questions_member5 import QUESTIONS_MEMBER_5, MEMBER_5_INFO
from questions_member6 import QUESTIONS_MEMBER_6, MEMBER_6_INFO

ALL_MEMBERS_DATA = [
    (MEMBER_1_INFO, QUESTIONS_MEMBER_1),
    (MEMBER_2_INFO, QUESTIONS_MEMBER_2),
    (MEMBER_3_INFO, QUESTIONS_MEMBER_3),
    (MEMBER_4_INFO, QUESTIONS_MEMBER_4),
    (MEMBER_5_INFO, QUESTIONS_MEMBER_5),
    (MEMBER_6_INFO, QUESTIONS_MEMBER_6),
]

TOTAL_QUESTIONS = sum(len(q_list) for _, q_list in ALL_MEMBERS_DATA)
print(f"Loaded {len(ALL_MEMBERS_DATA)} members with a total of {TOTAL_QUESTIONS} questions.")
assert TOTAL_QUESTIONS == 180, f"Expected exactly 180 questions, got {TOTAL_QUESTIONS}"

# -------------------------------------------------------------
# 1. BUILD MASTER MARKDOWN FILE
# -------------------------------------------------------------
md_lines = []
md_lines.append("# 🏛️ SMART INDIA HACKATHON (SIH) — 180 GRAND JURY QUESTIONS & MASTER DEFENSE DOSSIER")
md_lines.append("> **Problem Statement ID: 26021** | **Ministry of MSME, Coordination Section**")
md_lines.append("> **Category: Software** | **Theme: Smart Automation**")
md_lines.append("> **Project: HoneyChain (Beevil Knievel)** | **Target Repository:** `github.com/atharveeee-netizen/sih`")
md_lines.append("> **Format: 6 Team Members × 30 Questions = Exactly 180 Grilling Questions with Presentation Scripts & Cross-Counter Terminology Breakdowns**")
md_lines.append("\n---\n")

md_lines.append("## 📋 Table of Contents\n")
for idx, (m_info, q_list) in enumerate(ALL_MEMBERS_DATA, 1):
    q_start = q_list[0]['num']
    q_end = q_list[-1]['num']
    md_lines.append(f"{idx}. **[{m_info['role']} (Questions {q_start}–{q_end})](#member-{idx}-{m_info['role'].lower().replace(' ', '-').replace(':', '')})**")
md_lines.append("\n---\n")

for idx, (m_info, q_list) in enumerate(ALL_MEMBERS_DATA, 1):
    md_lines.append(f"\n# Member {idx}: {m_info['role']}\n")
    md_lines.append(f"**Primary Focus:** {m_info['focus']}  ")
    md_lines.append(f"**Key Repository Files:** `{m_info['key_files']}`  \n")
    md_lines.append("---\n")

    for q in q_list:
        md_lines.append(f"### Q{q['num']}. {q['question']}\n")
        md_lines.append(f"* **Interrogating Judge:** {q['judge']}")
        md_lines.append(f"* **The Jury Trap / Intent:** *{q['trap']}*\n")
        md_lines.append(f"**🎙️ Clean Word Script (What You Say to the Jury):**")
        md_lines.append(f"> \"{q['script']}\"\n")
        md_lines.append(f"**🔍 Cross-Counter Terminology & Gateway Breakdown:**")
        for term, explanation in q['terms']:
            md_lines.append(f"* **`[{term}]`**: {explanation}")
        md_lines.append("\n---\n")

md_output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "documentation", "HONEYCHAIN_180_JURY_QUESTIONS_MASTER_DEFENSE.md")
os.makedirs(os.path.dirname(md_output_path), exist_ok=True)
with open(md_output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))
print(f"Markdown generated at: {md_output_path} ({os.path.getsize(md_output_path)} bytes)")

# -------------------------------------------------------------
# 2. BUILD MASTER REPORTLAB PDF FILE
# -------------------------------------------------------------
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages after cover page)
        if self._pageNumber > 1:
            self.drawString(36, 756, "HONEYCHAIN (BEEVIL KNIEVEL) — SIH PS 26021 GRAND JURY DEFENSE DOSSIER")
            self.drawRightString(576, 756, "MINISTRY OF MSME · 180 QUESTIONS")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 750, 576, 750)
            
        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 24, page_str)
        self.drawString(36, 24, "CONFIDENTIAL & PROPRIETARY · TEAM BEEVIL KNIEVEL · SMART INDIA HACKATHON 2026")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 32, 576, 32)
        
        self.restoreState()

pdf_output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "documentation", "HoneyChain_180_Jury_Questions_Master_Defense.pdf")

doc = SimpleDocTemplate(
    pdf_output_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=46,
    bottomMargin=44
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "CoverTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=26,
    textColor=colors.HexColor("#0F172A"),
    alignment=1
)

subtitle_style = ParagraphStyle(
    "CoverSubtitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=11,
    leading=15,
    textColor=colors.HexColor("#334155"),
    alignment=1
)

badge_style = ParagraphStyle(
    "CoverBadge",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#FFFFFF"),
    alignment=1
)

member_banner_style = ParagraphStyle(
    "MemberBanner",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=16,
    textColor=colors.HexColor("#FFFFFF")
)

member_meta_style = ParagraphStyle(
    "MemberMeta",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor("#E2E8F0")
)

q_title_style = ParagraphStyle(
    "QTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=10.5,
    leading=13.5,
    textColor=colors.HexColor("#0F172A")
)

judge_style = ParagraphStyle(
    "JudgeTrap",
    parent=styles["Normal"],
    fontName="Helvetica-Oblique",
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor("#92400E")
)

script_label_style = ParagraphStyle(
    "ScriptLabel",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor("#1E3A8A")
)

script_body_style = ParagraphStyle(
    "ScriptBody",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor("#1E293B")
)

term_title_style = ParagraphStyle(
    "TermTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor("#0369A1")
)

term_desc_style = ParagraphStyle(
    "TermDesc",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor("#334155")
)

story = []

# COVER / TITLE BLOCK
story.append(Spacer(1, 15))
story.append(Paragraph("SMART INDIA HACKATHON (SIH) 2026", ParagraphStyle("SIHTag", fontName="Helvetica-Bold", fontSize=12, leading=14, textColor=colors.HexColor("#D97706"), alignment=1)))
story.append(Spacer(1, 6))
story.append(Paragraph("180 GRAND JURY QUESTIONS & MASTER DEFENSE DOSSIER", title_style))
story.append(Spacer(1, 8))
story.append(Paragraph("<b>Problem Statement 26021</b> — Ministry of MSME, Coordination Section<br/><i>Theme: Smart Automation · Category: Software (with Edge-AI & DePIN Backhaul)</i>", subtitle_style))
story.append(Spacer(1, 10))

meta_table_data = [
    [
        Paragraph("<b>Project:</b> HoneyChain (Beevil Knievel)", ParagraphStyle("m1", fontName="Helvetica", fontSize=8.5, leading=11)),
        Paragraph("<b>Target Team:</b> 6 Specialist Members", ParagraphStyle("m2", fontName="Helvetica", fontSize=8.5, leading=11)),
        Paragraph("<b>Total Questions:</b> Exactly 180 (30 / Member)", ParagraphStyle("m3", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=colors.HexColor("#16A34A")))
    ],
    [
        Paragraph("<b>Smart Contract:</b> HoneyProvenance.sol", ParagraphStyle("m4", fontName="Helvetica", fontSize=8.5, leading=11)),
        Paragraph("<b>Edge Hardware:</b> nRF52840 + SX1262 LoRa", ParagraphStyle("m5", fontName="Helvetica", fontSize=8.5, leading=11)),
        Paragraph("<b>Verification:</b> Zero-Wallet Gasless QR", ParagraphStyle("m6", fontName="Helvetica", fontSize=8.5, leading=11))
    ]
]
t_meta = Table(meta_table_data, colWidths=[180, 180, 180])
t_meta.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
]))
story.append(t_meta)
story.append(Spacer(1, 14))

# Executive instructions paragraph
exec_p = Paragraph(
    "<b>HOW TO USE THIS DEFENSE DOSSIER:</b> Judges frequently interrogate individual team members to find who is a mere spectator versus a true engineering author. This manual provides each of the 6 team members with 30 rigorous questions covering their exact sub-system. For every question, the student is provided with the <b>Jury Trap</b>, the exact <b>Clean Word Presentation Script</b>, and explicit <b>Cross-Counter Explanations</b> for every technical term, chip, protocol, and algorithm mentioned. When the jury asks follow-up questions, look up the bracketed term definitions below to defend your answer flawlessly.",
    ParagraphStyle("ExecGuide", fontName="Helvetica", fontSize=8.5, leading=12, textColor=colors.HexColor("#1E293B"))
)
story.append(exec_p)
story.append(Spacer(1, 14))

# ITERATE OVER 6 MEMBERS
for m_idx, (m_info, q_list) in enumerate(ALL_MEMBERS_DATA, 1):
    # Member Section Banner
    banner_data = [
        [
            Paragraph(f"<b>MEMBER {m_idx}: {m_info['role'].upper()}</b>", member_banner_style),
        ],
        [
            Paragraph(f"<b>Focus:</b> {m_info['focus']}<br/><b>Key Repository Files:</b> {m_info['key_files']}", member_meta_style)
        ]
    ]
    t_banner = Table(banner_data, colWidths=[540])
    t_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    
    # Don't break page on the very first member right after cover, but break on members 2-6
    if m_idx > 1:
        story.append(PageBreak())
    
    story.append(t_banner)
    story.append(Spacer(1, 10))
    
    for q in q_list:
        q_elements = []
        
        # 1. Question Title & Judge
        q_header = Paragraph(f"<b>Q{q['num']}. {q['question']}</b>", q_title_style)
        judge_p = Paragraph(f"<b>Judge:</b> {q['judge']} · <i><b>Jury Trap:</b> {q['trap']}</i>", judge_style)
        
        # 2. Presentation Script Box
        script_content = [
            [Paragraph("<b>🎙️ What You Say (Word-for-Word Defense Script):</b>", script_label_style)],
            [Paragraph(f"\"{q['script']}\"", script_body_style)]
        ]
        t_script = Table(script_content, colWidths=[532])
        t_script.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#93C5FD")),
            ('LINEBEFORE', (0,0), (0,-1), 3, colors.HexColor("#2563EB")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        
        # 3. Technical Terms Table
        term_rows = [
            [Paragraph("<b>Term / Gateway Component</b>", ParagraphStyle("th1", fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=colors.HexColor("#0F172A"))),
             Paragraph("<b>Cross-Counter Explanation (If Jury Interrupts to Test Your Knowledge)</b>", ParagraphStyle("th2", fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=colors.HexColor("#0F172A")))]
        ]
        for term, explanation in q['terms']:
            term_rows.append([
                Paragraph(f"<b>[{term}]</b>", term_title_style),
                Paragraph(explanation, term_desc_style)
            ])
            
        t_terms = Table(term_rows, colWidths=[160, 372])
        t_terms.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        
        q_elements.append(q_header)
        q_elements.append(Spacer(1, 3))
        q_elements.append(judge_p)
        q_elements.append(Spacer(1, 4))
        q_elements.append(t_script)
        q_elements.append(Spacer(1, 4))
        q_elements.append(t_terms)
        q_elements.append(Spacer(1, 10))
        q_elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
        
        story.append(KeepTogether(q_elements))

print("Building PDF document with ReportLab...")
doc.build(story, canvasmaker=NumberedCanvas)
print(f"PDF successfully built at: {pdf_output_path} ({os.path.getsize(pdf_output_path)} bytes)")

# -------------------------------------------------------------
# 3. COPY TO BRAIN ARTIFACTS DIRECTORY
# -------------------------------------------------------------
brain_dir = r"C:\Users\25beevdt047\.gemini\antigravity-ide\brain\1741650a-26de-4fc4-a265-0f556b0d6bff"
if os.path.exists(brain_dir):
    dest_pdf = os.path.join(brain_dir, "HoneyChain_180_Jury_Questions_Master_Defense.pdf")
    shutil.copyfile(pdf_output_path, dest_pdf)
    dest_md = os.path.join(brain_dir, "HONEYCHAIN_180_JURY_QUESTIONS_MASTER_DEFENSE.md")
    shutil.copyfile(md_output_path, dest_md)
    print(f"Copied artifacts to brain: {dest_pdf} & {dest_md}")

print("\nAll tasks completed cleanly! 180 questions generated and verified.")
