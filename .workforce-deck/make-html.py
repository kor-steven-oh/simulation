import json,html
from pathlib import Path
root=Path('/Users/steven/Projects/simulation')
data=json.loads((root/'.workforce-deck/html-data.json').read_text())
esc=html.escape
slides=[]
for i,s in enumerate(data):
 parts=[]
 texts=[q.get('text',{}).get('value','') for q in s['shapes']['items'] if q.get('text')]
 title=texts[1] if i==0 else texts[0]
 for q in s['shapes']['items']:
  pos=q['position']; css=';'.join(f'{k}:{pos[key]}px' for k,key in [('left','left'),('top','top'),('width','width'),('height','height')])
  t=q.get('text')
  if t:
   sty=t['style']; css+=f";font-size:{sty['fontSize']}px;font-weight:{700 if sty.get('bold') else 400};color:{sty['color']}"
   tag='h1' if i==0 and t['value']==title else ('h2' if i>0 and t['value']==title else 'p')
   parts.append(f'<{tag} class="text" style="{css}">{esc(t["value"])}</{tag}>')
  else:
   parts.append(f'<div aria-hidden="true" class="shape" style="{css};background:{q["fill"]}"></div>')
 slides.append(f'<section class="slide" id="slide-{i+1}" aria-label="{i+1}. {esc(title)}"><div class="canvas">'+''.join(parts)+'</div></section>')
options=''.join(f'<option value="{i}">{i+1:02d} · {esc(([q["text"]["value"] for q in s["shapes"]["items"] if q.get("text")])[1 if i==0 else 0].replace(chr(10)," "))}</option>' for i,s in enumerate(data))
page='''<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>전략적 인력운영 인텔리전스 플랫폼 · 리더 보고</title>
<style>
*{box-sizing:border-box}html,body{margin:0}body{background:#eceef1;color:#141414;font-family:"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",Arial,sans-serif}main{padding:24px 16px 100px}.slide{position:relative;width:min(1280px,100%);aspect-ratio:16/9;margin:0 auto 24px;background:white;overflow:hidden;box-shadow:0 8px 36px #15233412}.canvas{width:1280px;height:720px;position:absolute;transform-origin:top left}.text,.shape{position:absolute;margin:0}.text{white-space:pre-wrap;line-height:1.2;overflow-wrap:normal;letter-spacing:-.025em}.text{font-family:inherit}.controls{display:none;position:fixed;bottom:0;left:0;right:0;min-height:72px;padding:12px 24px;gap:12px;align-items:center;justify-content:center;background:#fff;border-top:1px solid #ddd}.js .controls{display:flex}.js main{height:calc(100dvh - 76px);padding:16px;display:flex;align-items:center;justify-content:center}.js .slide{display:none;margin:0;width:min(1280px,calc(100vw - 32px),calc((100dvh - 108px)*16/9))}.js .slide.active{display:block}button,select{font:inherit;font-size:15px;min-height:42px;border:1px solid #cbd0d7;border-radius:6px;background:white;padding:8px 12px;color:#222}button{cursor:pointer}button:hover{background:#edf3fc}button:disabled{opacity:.35;cursor:default}button:focus-visible,select:focus-visible{outline:3px solid #1764c0;outline-offset:2px}select{max-width:440px;min-width:0}#counter{font-variant-numeric:tabular-nums;white-space:nowrap}.hint{font-size:13px;color:#626975}@media(max-width:700px){.controls{gap:6px;padding:10px 8px;flex-wrap:wrap}.hint{display:none}select{max-width:160px}button,select{font-size:13px;padding:6px 8px}#counter{font-size:13px}}@page{size:landscape;margin:0}@media print{body{background:white}main,.js main{display:block;height:auto;padding:0}.controls,.js .controls{display:none}.slide,.js .slide{display:block!important;break-after:page;page-break-after:always;width:100vw;height:100vh;aspect-ratio:auto;margin:0;box-shadow:none}.slide:last-child{break-after:auto;page-break-after:auto}.canvas{transform:none!important;width:100%;height:100%}.text,.shape{left:calc(var(--x)*100%/1280)!important;top:calc(var(--y)*100%/720)!important;width:calc(var(--w)*100%/1280)!important;height:calc(var(--h)*100%/720)!important}.text{font-size:calc(var(--fs)*100vw/1280)!important}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><main aria-label="리더 보고 슬라이드">'''+''.join(slides)+'''</main><nav class="controls" aria-label="슬라이드 탐색"><button id="prev" aria-label="이전 슬라이드">← 이전</button><span id="counter" role="status" aria-live="polite"></span><button id="next" aria-label="다음 슬라이드">다음 →</button><select id="jump" aria-label="슬라이드 선택">'''+options+'''</select><button id="print">인쇄 / PDF</button><span class="hint">← → 이동 · Home / End</span></nav>
<script>
const slides=[...document.querySelectorAll('.slide')],prev=document.getElementById('prev'),next=document.getElementById('next'),jump=document.getElementById('jump'),counter=document.getElementById('counter');
let current=0;
for(const el of document.querySelectorAll('.text,.shape')){for(const [key,prop] of [['x','left'],['y','top'],['w','width'],['h','height'],['fs','fontSize']])el.style.setProperty('--'+key,parseFloat(el.style[prop])||0);}
function resize(){for(const slide of slides)if(slide.clientWidth)slide.firstElementChild.style.transform=`scale(${slide.clientWidth/1280})`;}
function go(index,update=true){current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((s,i)=>{s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',String(i!==current));});prev.disabled=current===0;next.disabled=current===slides.length-1;jump.value=current;counter.textContent=`${current+1} / ${slides.length}`;if(update)history.replaceState(null,'','#slide-'+(current+1));resize();}
function fromHash(){const n=Number(location.hash.replace('#slide-',''));go(Number.isInteger(n)&&n>0?n-1:0,false);}
document.documentElement.classList.add('js');prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));jump.addEventListener('change',()=>go(Number(jump.value)));document.getElementById('print').addEventListener('click',()=>window.print());
window.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||event.target.matches('select,input,textarea,button'))return;let n=current;if(['ArrowRight','ArrowDown','PageDown',' '].includes(event.key))n++;else if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key))n--;else if(event.key==='Home')n=0;else if(event.key==='End')n=slides.length-1;else return;event.preventDefault();go(n);});
window.addEventListener('resize',resize);window.addEventListener('hashchange',fromHash);window.addEventListener('beforeprint',()=>slides.forEach(s=>s.removeAttribute('aria-hidden')));window.addEventListener('afterprint',()=>go(current,false));fromHash();
</script></body></html>'''
# Print variables also work without JavaScript.
import re
page=re.sub(r'style="([^"]+)"',lambda m:'style="'+m[1]+''.join(';--'+k+':'+v for k,prop in [('x','left'),('y','top'),('w','width'),('h','height'),('fs','font-size')] for v in re.findall(r'(?:^|;)'+prop+r':([\d.]+)px',m[1]))+'"',page)
(root/'briefing.html').write_text(page)
print('Created HTML,',len(slides),'slides,',len(page.encode()),'bytes')
