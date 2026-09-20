import fitz

svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect width="200" height="100" fill="red"/><text x="20" y="60" font-size="20" fill="white">Test SVG</text></svg>'
doc = fitz.open(stream=svg.encode('utf-8'), filetype='svg')
pix = doc[0].get_pixmap()
print('Pixmap rendered successfully:', pix.width, pix.height)
