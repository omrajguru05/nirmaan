from PIL import Image
from pathlib import Path
import shutil

root = Path('.')
src_png = root / 'nirmaan-logo-mark.png'
src_svg = root / 'nirmaan-logo-mark.svg'
src = Image.open(src_png).convert('RGBA')

# Full-mark SVG copies (app chrome / brand)
svg_targets = [
	'src/vs/workbench/browser/media/code-icon.svg',
	'extensions/github-authentication/media/code-icon.svg',
	'extensions/npm/images/code.svg',
	'resources/brand/nirmaan-logo-mark.svg',
]
for t in svg_targets:
	Path(t).parent.mkdir(parents=True, exist_ok=True)
	shutil.copyfile(src_svg, t)
	print('svg ->', t)

shutil.copyfile(src_png, 'resources/brand/nirmaan-logo-mark.png')

# Letterpress: transparent bg watermarks derived from mark paths
letterpress_dark = '''<svg width="251" height="251" viewBox="0 0 251 251" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.35">
<path d="M48 202.091V92.1818C48 76.6818 60.6818 64 76.1818 64H93.0909V202.091H48Z" fill="#F5F5F5"/>
<path d="M93.0909 64H135.364V78.0909H157.909V92.1818H180.455V106.273H203V202.091H157.909V120.364C157.909 104.864 145.227 92.1818 129.727 92.1818H93.0909V64Z" fill="#F5F5F5"/>
<path d="M93.0909 202.091V137.273C93.0909 123.182 104.364 111.909 118.455 111.909H132.545C146.636 111.909 157.909 123.182 157.909 137.273V202.091H93.0909Z" fill="#0a0a0a"/>
<path d="M198.773 33H184.682C182.347 33 180.455 34.8926 180.455 37.2273V51.3182C180.455 53.6528 182.347 55.5455 184.682 55.5455H198.773C201.107 55.5455 203 53.6528 203 51.3182V37.2273C203 34.8926 201.107 33 198.773 33Z" fill="#C9782D"/>
<path opacity="0.45" d="M200.182 213.364H50.8182C49.2617 213.364 48 214.625 48 216.182C48 217.738 49.2617 219 50.8182 219H200.182C201.738 219 203 217.738 203 216.182C203 214.625 201.738 213.364 200.182 213.364Z" fill="#A3A3A3"/>
</svg>
'''
letterpress_light = '''<svg width="251" height="251" viewBox="0 0 251 251" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.3">
<path d="M48 202.091V92.1818C48 76.6818 60.6818 64 76.1818 64H93.0909V202.091H48Z" fill="#111111"/>
<path d="M93.0909 64H135.364V78.0909H157.909V92.1818H180.455V106.273H203V202.091H157.909V120.364C157.909 104.864 145.227 92.1818 129.727 92.1818H93.0909V64Z" fill="#111111"/>
<path d="M93.0909 202.091V137.273C93.0909 123.182 104.364 111.909 118.455 111.909H132.545C146.636 111.909 157.909 123.182 157.909 137.273V202.091H93.0909Z" fill="#ffffff"/>
<path d="M198.773 33H184.682C182.347 33 180.455 34.8926 180.455 37.2273V51.3182C180.455 53.6528 182.347 55.5455 184.682 55.5455H198.773C201.107 55.5455 203 53.6528 203 51.3182V37.2273C203 34.8926 201.107 33 198.773 33Z" fill="#C9782D"/>
<path opacity="0.45" d="M200.182 213.364H50.8182C49.2617 213.364 48 214.625 48 216.182C48 217.738 49.2617 219 50.8182 219H200.182C201.738 219 203 217.738 203 216.182C203 214.625 201.738 213.364 200.182 213.364Z" fill="#555555"/>
</svg>
'''
for name, content in [
	('letterpress-dark.svg', letterpress_dark),
	('letterpress-hcDark.svg', letterpress_dark),
	('letterpress-light.svg', letterpress_light),
	('letterpress-hcLight.svg', letterpress_light),
]:
	path = Path('src/vs/workbench/browser/parts/editor/media') / name
	path.write_text(content, encoding='utf-8')
	print('letterpress ->', path)

# App icons from root PNG
src.resize((150, 150), Image.Resampling.LANCZOS).save('resources/win32/code_150x150.png')
src.resize((70, 70), Image.Resampling.LANCZOS).save('resources/win32/code_70x70.png')
src.resize((512, 512), Image.Resampling.LANCZOS).save('resources/linux/code.png')

master = src.resize((256, 256), Image.Resampling.LANCZOS)
master.save('resources/win32/code.ico', format='ICO', sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('ico', Path('resources/win32/code.ico').stat().st_size)

icns_sizes = [16, 32, 64, 128, 256, 512, 1024]
icns_images = [src.resize((s, s), Image.Resampling.LANCZOS) for s in icns_sizes]
try:
	icns_images[-1].save('resources/darwin/code.icns', format='ICNS', append_images=icns_images[:-1])
	print('icns', Path('resources/darwin/code.icns').stat().st_size)
except Exception as e:
	print('icns warn:', e)

print('done — all assets refreshed from repo root')
