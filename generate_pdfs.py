#!/usr/bin/env python3
"""
PDF Generator for Pursuit Cycle 3 Storage Data Documents
=========================================================
Run this anytime to regenerate all PDFs from the markdown files.

Usage:
    python3 generate_pdfs.py

If fpdf2 is not installed:
    pip3 install fpdf2

This script is SELF-CONTAINED. RRC does not need to be running.
Just run it from terminal whenever you need fresh PDFs.
"""

import os
import sys

# Check for fpdf2
try:
    from fpdf import FPDF
except ImportError:
    print("fpdf2 not installed. Installing...")
    os.system(f"{sys.executable} -m pip install fpdf2")
    from fpdf import FPDF

BASE = os.path.dirname(os.path.abspath(__file__))

def md_to_pdf(md_path, pdf_path):
    """Convert a markdown file to PDF. Handles tables, headers, bullets, bold."""
    
    pdf = FPDF(orientation='P', unit='mm', format='Letter')
    # Letter = 215.9 x 279.4mm. With 10mm margins = 195.9mm usable width.
    pdf.set_left_margin(10)
    pdf.set_right_margin(10)
    pdf.set_top_margin(10)
    pdf.set_auto_page_break(auto=True, margin=10)
    pdf.add_page()
    
    with open(md_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    
    # Replace any smart quotes or special chars that fpdf2 can't handle
    for old, new in [('\u2018', "'"), ('\u2019', "'"), ('\u201c', '"'), 
                     ('\u201d', '"'), ('\u2013', '--'), ('\u2014', '---'),
                     ('\u2026', '...'), ('\u00a0', ' ')]:
        raw = raw.replace(old, new)
    
    lines = raw.split('\n')
    
    for line in lines:
        line = line.rstrip()
        
        if not line.strip():
            pdf.ln(2)
            continue
        
        # Strip markdown bold for display
        display = line.replace('**', '')
        
        # Ensure only ASCII/latin1 chars (fpdf2 default font limitation)
        display = display.encode('latin-1', errors='replace').decode('latin-1')
        
        try:
            if line.startswith('# ') and not line.startswith('## '):
                pdf.set_font('Helvetica', 'B', 13)
                pdf.cell(0, 7, txt=display[2:], new_x="LMARGIN", new_y="NEXT")
                pdf.ln(2)
            elif line.startswith('## '):
                pdf.set_font('Helvetica', 'B', 11)
                pdf.cell(0, 6, txt=display[3:], new_x="LMARGIN", new_y="NEXT")
                pdf.ln(1)
            elif line.startswith('### '):
                pdf.set_font('Helvetica', 'B', 9)
                pdf.cell(0, 5, txt=display[4:], new_x="LMARGIN", new_y="NEXT")
                pdf.ln(1)
            elif line.startswith('---'):
                pdf.ln(2)
                pdf.set_draw_color(180, 180, 180)
                y = pdf.get_y()
                pdf.line(10, y, 205, y)
                pdf.ln(2)
            elif line.startswith('|'):
                # Table rows - use tiny monospace font to fit wide tables
                pdf.set_font('Courier', '', 5)
                # Truncate if still too long
                if len(display) > 160:
                    display = display[:157] + '...'
                pdf.cell(0, 3, txt=display, new_x="LMARGIN", new_y="NEXT")
            elif display.lstrip().startswith('- '):
                pdf.set_font('Helvetica', '', 8)
                text = display.lstrip(' -').strip()
                if text:
                    pdf.cell(0, 4, txt='  - ' + text, new_x="LMARGIN", new_y="NEXT")
            elif line.startswith('Source:'):
                pdf.set_font('Helvetica', 'I', 7)
                pdf.cell(0, 4, txt=display, new_x="LMARGIN", new_y="NEXT")
                pdf.ln(1)
            else:
                pdf.set_font('Helvetica', '', 8)
                stripped = display.strip()
                if stripped:
                    # Use multi_cell for long text that needs wrapping
                    if len(stripped) > 100:
                        pdf.multi_cell(0, 4, txt=stripped)
                    else:
                        pdf.cell(0, 4, txt=stripped, new_x="LMARGIN", new_y="NEXT")
        except Exception as e:
            # If any line fails, skip it rather than crashing
            pdf.set_font('Helvetica', '', 7)
            safe = ''.join(c if 32 <= ord(c) < 127 else '?' for c in display)
            try:
                pdf.cell(0, 3, txt=safe[:120], new_x="LMARGIN", new_y="NEXT")
            except:
                pass  # truly skip if nothing works
    
    pdf.output(pdf_path)
    return os.path.getsize(pdf_path), pdf.page_no()


def main():
    print("=" * 50)
    print("PDF Generator - Pursuit Cycle 3 Storage Data")
    print("=" * 50)
    print(f"Working directory: {BASE}")
    print()
    
    # Find all .md files in the directory
    md_files = sorted([f for f in os.listdir(BASE) if f.endswith('.md')])
    
    if not md_files:
        print("No .md files found!")
        return
    
    print(f"Found {len(md_files)} markdown files:")
    for f in md_files:
        size = os.path.getsize(os.path.join(BASE, f))
        print(f"  {f} ({size:,} bytes)")
    print()
    
    # Generate PDFs for each
    results = []
    for md_name in md_files:
        pdf_name = md_name.replace('.md', '.pdf')
        md_path = os.path.join(BASE, md_name)
        pdf_path = os.path.join(BASE, pdf_name)
        
        try:
            size, pages = md_to_pdf(md_path, pdf_path)
            results.append((pdf_name, size, pages, 'OK'))
            print(f"  [OK] {pdf_name} ({size:,} bytes, {pages} pages)")
        except Exception as e:
            results.append((pdf_name, 0, 0, str(e)))
            print(f"  [FAIL] {pdf_name}: {e}")
    
    print()
    print("=" * 50)
    print("SUMMARY")
    print("=" * 50)
    ok = sum(1 for r in results if r[3] == 'OK')
    fail = len(results) - ok
    print(f"  Generated: {ok}")
    print(f"  Failed: {fail}")
    if fail > 0:
        print()
        print("  Failed files:")
        for name, _, _, err in results:
            if err != 'OK':
                print(f"    {name}: {err}")
    print()
    print("Done! PDFs are in:")
    print(f"  {BASE}")


if __name__ == '__main__':
    main()
