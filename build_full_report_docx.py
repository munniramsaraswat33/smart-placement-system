import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT = "Smart_Placement_System_Project_Report.docx"
ASSETS_DIR = "report_assets"

# Color Palette Constants
NAVY = RGBColor(16, 42, 67)       # #102a43
BLUE = RGBColor(37, 99, 235)      # #2563eb
DARK_GRAY = RGBColor(51, 65, 85)  # #334155
LIGHT_BG = "F8FAFC"
HEADER_BG = "102A43"
ZEBRA_BG = "F1F5F9"
BORDER_COLOR = "CBD5E1"

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_borders(cell, top="CCCCCC", bottom="CCCCCC", left="none", right="none"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for b_name, b_val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        if b_val != "none":
            b_el = parse_xml(f'<w:{b_name.split(":")[1]} {nsdecls("w")} w:val="single" w:sz="4" w:space="0" w:color="{b_val}"/>')
        else:
            b_el = parse_xml(f'<w:{b_name.split(":")[1]} {nsdecls("w")} w:val="none"/>')
        tcBorders.append(b_el)
    tcPr.append(tcBorders)

def add_header_footer(doc):
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)
        
        # Header
        hdr = s.header
        hp = hdr.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Smart Placement & Career Management System | B.Tech Project Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        # Footer
        ftr = s.footer
        fp = ftr.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Department of Computer Science & Engineering • Academic Session 2025-2026")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

def add_title_page(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(36)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run("A MAJOR PROJECT REPORT\nON")
    run.font.name = "Calibri"
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = DARK_GRAY

    # Project Title
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_before = Pt(12)
    p2.paragraph_format.space_after = Pt(18)
    run2 = p2.add_run("SMART PLACEMENT & CAREER\nMANAGEMENT SYSTEM")
    run2.font.name = "Calibri"
    run2.font.size = Pt(26)
    run2.font.bold = True
    run2.font.color.rgb = NAVY

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(36)
    r_sub = p_sub.add_run("An Enterprise-Grade, Full-Stack Automated Platform for Campus Recruitment Drives,\nPlacement Eligibility Verification, ATS Resume Intelligence & Pipeline Tracking")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Degree Fulfillment
    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_after = Pt(48)
    run3 = p3.add_run("Submitted in partial fulfillment of the requirements\nfor the award of the degree of\n\nBACHELOR OF TECHNOLOGY\nin\nCOMPUTER SCIENCE & ENGINEERING")
    run3.font.name = "Calibri"
    run3.font.size = Pt(12)
    run3.font.bold = True
    run3.font.color.rgb = DARK_GRAY

    # Authors & Supervisor table
    tbl = doc.add_table(rows=1, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(3.2)
    tbl.columns[1].width = Inches(3.2)

    cell_l = tbl.cell(0, 0)
    p_l = cell_l.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_l1 = p_l.add_run("SUBMITTED BY:\n")
    r_l1.font.bold = True
    r_l1.font.size = Pt(11)
    r_l1.font.color.rgb = NAVY
    r_l2 = p_l.add_run("Munniram Saraswat\nRoll No: 2021-CSE-084\nB.Tech Final Year (8th Semester)\nDepartment of CSE")
    r_l2.font.size = Pt(10.5)
    r_l2.font.color.rgb = DARK_GRAY

    cell_r = tbl.cell(0, 1)
    p_r = cell_r.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_r1 = p_r.add_run("UNDER THE GUIDANCE OF:\n")
    r_r1.font.bold = True
    r_r1.font.size = Pt(11)
    r_r1.font.color.rgb = NAVY
    r_r2 = p_r.add_run("Head of Department / Project Guide\nTraining & Placement Cell\nFaculty of Engineering & Technology\nAcademic Session: 2025-2026")
    r_r2.font.size = Pt(10.5)
    r_r2.font.color.rgb = DARK_GRAY

    doc.add_page_break()

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = NAVY
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = BLUE
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = DARK_GRAY
    return p

def add_paragraph(doc, text, bold_prefix=None, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(space_after)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = NAVY
        
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
    run.font.color.rgb = DARK_GRAY
    return p

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(3)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = NAVY
        
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
    run.font.color.rgb = DARK_GRAY
    return p

def add_styled_table(doc, headers, data, col_widths=None):
    tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    # Header Row
    hdr_row = tbl.rows[0]
    for idx, header_text in enumerate(headers):
        cell = hdr_row.cells[idx]
        set_cell_shading(cell, HEADER_BG)
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(header_text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, row_data in enumerate(data):
        row = tbl.rows[row_idx + 1]
        bg = ZEBRA_BG if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, cell_value in enumerate(row_data):
            cell = row.cells[col_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_borders(cell, top="E2E8F0", bottom="E2E8F0")
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(str(cell_value))
            run.font.name = "Calibri"
            run.font.size = Pt(9)
            run.font.color.rgb = DARK_GRAY

    if col_widths:
        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_after = Pt(6)

def add_figure(doc, img_name, caption):
    img_path = os.path.join(ASSETS_DIR, img_name)
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(14)
        p_cap.paragraph_format.keep_with_next = True
        r_cap = p_cap.add_run(caption)
        r_cap.font.name = "Calibri"
        r_cap.font.size = Pt(9.5)
        r_cap.font.bold = True
        r_cap.font.italic = True
        r_cap.font.color.rgb = NAVY

def add_callout(doc, text, title="ACADEMIC NOTE & ENGINEERING HIGHLIGHT"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)

    cell = tbl.cell(0, 0)
    set_cell_shading(cell, "F1F5F9")
    set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left="2563EB", right="CBD5E1")
    set_cell_margins(cell, top=100, bottom=100, left=160, right=160)

    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r_title = p.add_run(f"📌 {title}: ")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(10)
    r_title.font.bold = True
    r_title.font.color.rgb = BLUE

    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = DARK_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

print("Helper definitions loaded successfully.")
