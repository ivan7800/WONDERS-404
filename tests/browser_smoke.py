"""Offline DOM and WebGL smoke tests without network navigation.

Chromium in this environment blocks HTTP navigation by policy. HTML and script bytes
are injected into about:blank, so these checks cannot validate actual file serving.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SCENES={'taj':('taj-mahal','tajMahal'),'colosseum':('colosseum','colosseum'),'giza':('giza','giza'),'machu':('machu','machu'),'petra':('petra','petra'),'angkor':('angkor','angkor'),'sagrada':('sagrada','sagrada')}

def script(path):
    return (ROOT/path).read_text(encoding='utf-8')

def css(page,path):
    page.add_style_tag(content=script(path))

def load(page,path):
    page.add_script_tag(content=script(path))

def test_atlas(browser):
    p=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.set_content(script('index.html'),wait_until='domcontentloaded')
    css(p,'styles.css');load(p,'app.js')
    assert p.locator('.card').count()==8, 'catálogo no carga'
    assert p.locator('.card-enter').count()==8
    p.locator('#search').fill('Taj')
    assert p.locator('.card').count()==1
    p.locator('#search').fill('')
    p.locator('.filter[data-region="europa"]').click()
    assert p.locator('.card').count()==3
    p.locator('.filter[data-region="todos"]').click()
    p.locator('.card[data-id="taj"] .favorite').click()
    assert p.locator('.card[data-id="taj"] .favorite').get_attribute('aria-pressed')=='true'
    p.locator('.filter[data-region="favoritos"]').click()
    assert p.locator('.card').count()==1
    p.locator('.filter[data-region="todos"]').click()
    p.locator('.card[data-id="taj"] .card-enter').click()
    assert p.locator('#scene').evaluate('(e)=>e.open')
    assert p.locator('#sceneTitle').inner_text().find('TAJ MAHAL')>=0
    assert p.locator('#badgeProgress').inner_text()=='1/8'
    p.locator('#closeScene').click()
    assert not p.locator('#scene').evaluate('(e)=>e.open')
    p.locator('#journalNav').click()
    assert p.locator('.journal-row').count()==8
    p.locator('#exportJournal').click()
    p.locator('#closeJournal').click()
    p.locator('#about').click()
    assert p.locator('#info').evaluate('(e)=>e.open')
    p.locator('#closeInfo').click()
    assert not errors,errors
    p.screenshot(path='/mnt/data/wonders-atlas-qa.png',full_page=True)
    p.close();return 'Catálogo, filtros, favoritos, diálogos, cuaderno, exportación: OK'

def test_scene(browser,which,model,fn):
    p=browser.new_page(viewport={'width':1365,'height':768})
    errors=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.set_content(script(f'scenes/{which}/index.html'),wait_until='domcontentloaded')
    css(p,f'scenes/{which}/scene.css');css(p,'js/core/experience.css')
    # DOM/interactions use a stub renderer: headless Chromium has WebGL disabled.
    # Native shader/rendering is NOT considered browser-verified by this test.
    renderer='function createRenderer(canvas,faces){if(!faces.length)throw Error(\"Modelo vacío\");window.__renderFaceCount=faces.length;return {draw(){window.__draws=(window.__draws||0)+1}}}'
    geometry=script(f'js/monuments/{model}.js').replace(f'export function {fn}',f'function {fn}')
    data=script(f'scenes/{which}/tour-data.js').replace('export const points=','const points=')
    scene=re.sub(r'^import .*?;\s*','',script(f'scenes/{which}/scene.js'),flags=re.M)
    ambient=script('js/core/ambient.js').replace('export class AmbientSound','class AmbientSound')
    experience=re.sub(r'^import .*?;\s*','',script('js/core/experience.js'),flags=re.M)
    p.add_script_tag(content='\n'.join([renderer,geometry,data,scene,ambient,experience]))
    p.wait_for_timeout(300)
    webgl_error=p.locator('#message').inner_text()
    assert 'WebGL' not in webgl_error,(which,webgl_error)
    assert p.evaluate('window.__renderFaceCount')>100
    assert p.locator('#poiButtons button').count()==4,(which,errors,p.locator('#message').inner_text(),p.locator('#poiButtons').inner_html())
    assert p.locator('#quality').input_value() in ('media','baja','alta')
    p.locator('#quality').select_option('baja')
    assert p.evaluate('window.__wondersQuality')=='baja'
    p.locator('#sunset').click()
    assert p.locator('#sunset').get_attribute('aria-pressed')=='true'
    p.locator('#night').click()
    assert p.locator('#night').get_attribute('aria-pressed')=='true'
    p.locator('#orbit').click()
    assert p.locator('#orbit').get_attribute('aria-pressed')=='true'
    p.locator('#orbit').click()
    p.locator('#poiButtons button').nth(2).click()
    assert p.locator('#discoveryCount').inner_text()=='1/4'
    assert p.locator('#poiDetails h2').inner_text()!=''
    p.locator('#tour').click()
    assert p.locator('#tour').get_attribute('aria-pressed')=='true'
    p.locator('#poiButtons button').nth(1).click()
    assert p.locator('#tour').get_attribute('aria-pressed')=='false', 'el tour debe detenerse al elegir otro punto'
    p.locator('#tour').click()
    assert p.locator('#tour').get_attribute('aria-pressed')=='true', 'el tour debe poder reiniciarse'
    p.locator('#tour').click()
    assert p.locator('#tour').get_attribute('aria-pressed')=='false'
    p.locator('#photo').click()
    assert p.locator('body').evaluate('(el)=>el.classList.contains("photo-mode")')
    p.locator('#exitPhoto').click()
    assert not p.locator('body').evaluate('(el)=>el.classList.contains("photo-mode")')
    p.locator('#capture').click()
    p.locator('#reset').click()
    if which=='taj':p.screenshot(path='/mnt/data/wonders-taj-dom-qa.png',full_page=True)
    assert not errors,(which,errors)
    p.close()
    return f'{which}: controles con renderizador simulado, 4 POI, luz, órbita, tour, foto, calidad y reset OK'

def test_mobile(browser):
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page.set_content(script('index.html'),wait_until='domcontentloaded')
    css(page,'styles.css');load(page,'app.js')
    assert page.locator('.card').count()==8
    assert page.locator('.card').first.bounding_box()['width']<385
    page.screenshot(path='/mnt/data/wonders-mobile-qa.png',full_page=True)
    page.close()

    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page.set_content(script('scenes/taj/index.html'),wait_until='domcontentloaded')
    css(page,'scenes/taj/scene.css');css(page,'js/core/experience.css')
    model=script('js/monuments/taj-mahal.js').replace('export function tajMahal','function tajMahal')
    points=script('scenes/taj/tour-data.js').replace('export const points=','const points=')
    scene=re.sub(r'^import .*?;\s*','',script('scenes/taj/scene.js'),flags=re.M)
    ambient=script('js/core/ambient.js').replace('export class AmbientSound','class AmbientSound')
    exp=re.sub(r'^import .*?;\s*','',script('js/core/experience.js'),flags=re.M)
    stub='function createRenderer(canvas,faces){return {draw(){}}}'
    page.add_script_tag(content='\n'.join([stub,model,points,scene,ambient,exp]))
    assert page.locator('#toggleControls').is_visible()
    assert not page.locator('aside').is_visible()
    page.locator('#toggleControls').click()
    assert page.locator('aside').is_visible()
    page.locator('#toggleHistory').click()
    assert page.locator('#heritage').is_visible()
    assert not page.locator('aside').is_visible()
    page.close()
    return '390px: catálogo y paneles plegables OK'

if __name__=='__main__':
 with sync_playwright() as pl:
  browser=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-web-security'])
  try:
   print(test_atlas(browser))
   for which,(model,fn) in SCENES.items():print(test_scene(browser,which,model,fn))
   print(test_mobile(browser))
  finally:browser.close()
