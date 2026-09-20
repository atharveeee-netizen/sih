import fitz

svg1 = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>'
svg2 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100"><a xlink:href="http://example.com"><rect width="100" height="100" fill="red"/></a></svg>'

doc1 = fitz.open(stream=svg1.encode(), filetype='svg')
doc2 = fitz.open(stream=svg2.encode(), filetype='svg')

pix1 = doc1[0].get_pixmap()
pix2 = doc2[0].get_pixmap()
print('pix1 pixel (0,0):', list(pix1.samples[:3]))
print('pix2 pixel (0,0):', list(pix2.samples[:3]))
