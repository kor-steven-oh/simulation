import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
const dir='/Users/steven/Projects/simulation/.workforce-deck';
const output='/Users/steven/Projects/simulation/briefing.pptx';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={ink:'#141414',muted:'#555B64',blue:'#1764C0',gray:'#EDEDED',rule:'#B8BCC4'};
const boxes=[];
function tx(s,text,x,y,w,h,size=28,bold=false,color=C.ink){const q=s.shapes.add({name:`text-${boxes.length}`,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=text;q.text.style={fontFamily:'Apple SD Gothic Neo',typeface:'Apple SD Gothic Neo',fontSize:size,bold,color,autoFit:'none',verticalAlignment:'top',insets:{left:0,right:0,top:0,bottom:0}};boxes.push({slide:p.slides.items.length,text,x,y,w,h});return q;}
function rect(s,x,y,w,h,fill=C.gray){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function line(s,x,y,w){rect(s,x,y,w,1,C.rule);}
function slide(title,section,source,extra=''){let s=p.slides.add();s.background.fill='#FFFFFF';tx(s,title,42,40,1196,82,48,true);tx(s,section,42,663,1100,29,22,false,C.muted);tx(s,String(p.slides.items.length).padStart(2,'0'),1180,660,58,32,22,false,C.muted);s.speakerNotes.textFrame.setText(`${extra}\n[Sources]\ndesign.md — ${source}\n[/Sources]`);return s;}
function pair(s,x,y,w,heading,body){tx(s,heading,x,y,w,48,34,true);tx(s,body,x,y+67,w,140,28,false,C.muted);}
function cols(title,section,items,source,intro=''){let s=slide(title,section,source);if(intro)tx(s,intro,42,158,1196,105,32,false,C.muted);items.forEach((a,i)=>pair(s,42+i*411,335,374,a[0],a[1]));return s;}
function two(title,section,a,b,source){let s=slide(title,section,source);pair(s,42,222,568,...a);pair(s,658,222,580,...b);return s;}
function rows(title,section,items,source,foot=''){let s=slide(title,section,source);items.forEach((r,i)=>{let y=190+i*82;line(s,42,y,1196);tx(s,r[0],52,y+20,264,48,29,true);tx(s,r[1],337,y+20,884,55,27,false,C.muted);});if(foot)tx(s,foot,42,602,1196,42,23,false,C.blue);return s;}
// Codex Grid: cover / slide-01 composition.
{
let s=p.slides.add();s.background.fill='#FFFFFF';tx(s,'리더 보고 · 시스템 구축 구상',42,42,1196,50,32);
tx(s,'전략적 인력운영\n인텔리전스 플랫폼',42,185,1196,230,76,true);
tx(s,'사람·업무·사업계획을 연결하는\n전사 인력 의사결정 체계',42,498,1196,112,36,false,C.muted);
s.speakerNotes.textFrame.setText('[Sources]\ndesign.md — 0, 1, 21\n[/Sources]');
}
cols('인력 의사결정에 필요한 근거를 연결합니다','01  추진 목적',[
['현재를 이해','어디에 누가 배치되어\n어떤 일을 수행하는지\n동일한 기준으로 파악'],
['미래를 준비','사업·과제 계획에 따른\n역량과 Man month 수요를\n가용 공급과 비교'],
['대안을 비교','내부 재배치와 채용의\n일정·원가·사업 영향을\n함께 검토']], '0–2, 6, 21','핵심 질문: 앞으로 어떤 인력이 필요하며, 어디에 배치해야 하는가?');
// Overall architecture: a single native diagram, connectors behind nodes.
{
let s=slide('데이터에서 의사결정까지 하나로 연결합니다','02  전체 시스템 구조','3, 13, 20','개념 구조이며 실제 연계 주기와 기술 구성은 상세 설계에서 확정한다.');
const yy=[163,259,355,451,547];
for(let i=0;i<4;i++)tx(s,'↑',1000,yy[i]+63,60,32,27,false,C.blue);
const rr=[['의사결정 접점','Workforce Command Center  ·  Ask Workforce AI'],['분석·추론·시뮬레이션','현황·변화 분석  /  원인 설명  /  예측·대안 비교'],['Workforce Semantic Layer','사람·조직·직무·역량·과제·시간의 관계와 지표 표준화'],['People Data Platform','데이터 통합  ·  품질 검증  ·  기준정보  ·  시점 이력'],['원천 시스템','HR  ·  근태  ·  과제  ·  역량  ·  채용  ·  원가  ·  사업계획']];
rr.forEach((r,i)=>{rect(s,42,yy[i],1196,65,i===2?'#E7F0FB':C.gray);tx(s,r[0],61,yy[i]+17,422,43,27,true);tx(s,r[1],492,yy[i]+18,725,41,24);});
}
// Grid 13: four flat topic regions.
{
let s=slide('공통 기준과 시점 이력이 분석의 기반입니다','03  데이터 기반','2.3, 4, 11, 15');
pair(s,42,210,568,'기준 시스템 지정','인력·조직은 HR, 과제는 PM\n원가는 Finance 등 기준 출처 확정');
pair(s,658,210,580,'공통 식별자 연결','사번·조직·과제 ID를 연결하고\n명칭 및 분류 체계를 표준화');
pair(s,42,428,568,'변경 이력 보존','조직개편·이동·배치 기간을 기록해\n과거 시점과 변화 원인을 재현');
pair(s,658,428,580,'품질과 갱신 관리','누락·중복·투입률을 검증하고\n데이터별 갱신 기준과 책임자 지정');
}
two('사람과 과제의 관계를 공통 언어로 정의합니다','04  Semantic Layer',
['사람을 중심으로 연결','소속 조직 · 직무 · 거점\n보유 역량 · 경력 · 근태\n참여 과제 · 투입 기간 · 원가'],
['과제를 중심으로 연결','제품 · 사업 우선순위 · 일정\n필요 역량 · 필요 Man month\n배치 인력 · 투입 계획 · 종료 시점'],'5, 11, 15');
{
let s=slide('투입 규모는 기간별 Man month로 관리합니다','05  인력 투입 기준','2.2, 11, 15; 사용자 용어 지침','Man month는 기간 누적 투입량이다. 아래는 설명용 예시이며 회사의 월 기준시간, 부분월, 휴가·초과근무 반영 정책은 별도 확정한다. 계획값과 실적값은 구분한다.');
tx(s,'1 Man month = 1명이 1개월 동안 전담 투입하는 업무량',42,161,1196,63,34,true,C.blue);
pair(s,42,277,568,'산정 방식','계획: 월별 개인 투입률의 합\n실적: 월별 과제 투입시간 ÷ 월 기준시간\n같은 기간의 수요·공급·실적을 비교');
pair(s,658,277,580,'예시 · 동일 인력 1명, 3개월','과제 A   50% × 3개월 = 1.5 Man month\n과제 B   30% × 3개월 = 0.9 Man month\n공통업무 20% × 3개월 = 0.6 Man month');
tx(s,'인원수 1명  /  3개월 총 투입량 3.0 Man month',42,563,1196,59,34,true);
}
rows('분석 역량은 현황에서 배치 최적화로 확장합니다','06  분석·추론 체계',[
['01  현황 파악','조직·직무·거점별 인원과 과제별 Man month 확인'],
['02  변화 분석','채용·퇴사·내부 이동 및 업무량 변화 추적'],
['03  원인 진단','과제 확대·일정 변경·조직 이동의 기여도 설명'],
['04  수요 예측','사업계획과 과제별 수요를 가용 공급과 비교'],
['05  배치 최적화','역량·시기·거점 등 제약을 고려한 재배치 대안 제시']],'6–8');
{
let s=slide('AI는 승인된 지표로 조회하고 근거를 설명합니다','07  Workforce AI','7, 13, 14','원인 설명은 검증 가능한 이동·투입 기록에 기반한다. 상관관계만으로 인과를 단정하지 않고 추정과 확인된 사실을 구분한다.');
tx(s,'“최근 6개월 인력이 가장 많이 늘어난 조직과 이유는?”',42,165,1196,68,35,true,C.blue);
const steps=[['질문 해석','지표·기간·조직 범위 확정'],['권한 내 조회','공통 지표와 허용된 쿼리 사용'],['계산과 설명','증감·기여도 계산 후 근거 제시']];
steps.forEach((a,i)=>pair(s,42+i*411,315,374,...a));
tx(s,'답변에 기준 시점 · 지표 정의 · 데이터 출처 · 추정 가정을 함께 표시',42,580,1196,50,27,false,C.muted);
}
cols('시나리오별 사업 영향과 실행 대안을 비교합니다','08  시뮬레이션',[
['인력 규모 조정','인원 3% 감소 시\n기간별 공급 감소와\n과제 일정 위험 비교'],
['AI 과제 확대','AI 과제 30% 확대 시\n역량별 필요 Man month와\n충원 방식 비교'],
['과제 일정 지연','과제 3개월 지연 시\n후속 투입·재배치·원가에\n미치는 영향 확인']], '8','입력: 규모·일정·우선순위  →  산출: 역량별 부족량·원가·일정 위험');
{
let s=slide('종료 과제의 여력을 신규 과제와 연결합니다','09  활용 사례 · 설명용 가정','5.1, 6, 8; 기간 명시를 위해 재구성한 설명용 예시','아래 수치는 회사 실적이 아닌 설명용 가정이다. 같은 3개월 기간에 기존 과제 추가 투입 의무가 없고 역량·일정 매칭을 통과한다는 조건이다. 인원과 Man month는 직접 대체되지 않는다.');
tx(s,'분석 기간: 2027년 7–9월 · 역량: RTL · 계획 투입량',42,154,1196,54,30,false,C.muted);
const v=[['72','Man month 가용','종료 과제 인력 24명\n× 3개월 × 가용률 100%'],['54','Man month 필요','신규 과제 인력 18명\n× 3개월 × 투입률 100%'],['42','Man month 매칭','역량·일정 적합 인력 14명\n× 3개월 × 투입률 100%']];
v.forEach((a,i)=>{const x=42+i*411;tx(s,a[0],x,256,374,115,92,true,i===2?C.blue:C.ink);tx(s,a[1],x,384,374,48,31,true);tx(s,a[2],x,449,374,91,25,false,C.muted);});
tx(s,'남은 수요 12 Man month → 추가 내부 매칭·교육·채용 대안 검토',42,585,1196,50,30,true);
}
rows('화면은 리더의 질문과 의사결정 흐름에 맞춥니다','10  핵심 사용자 경험',[
['전사 현황','Command Center: 인원·투입량·근로시간·채용 현황'],
['조직·역량 탐색','Organization Explorer / Workforce Map / Skill Map'],
['과제·이동 분석','Project Workforce / Workforce Flow: 투입·종료·이동'],
['미래 계획','Forecast / Scenario Planning: 수요·공급·대안 비교'],
['자연어 질의','Ask Workforce AI: 질문 → 근거 확인 → 추가 분석']],'9');
{
let s=slide('권한·지표·추천 근거를 일관되게 통제합니다','11  보안 및 운영 원칙','13–15; 승인·추적 원칙은 실행 설계 제안');
pair(s,42,210,568,'권한은 조직과 역할 기준','경영진·사업부장·팀장·HR별 범위 적용\n조회와 AI 응답에 같은 권한 반영');
pair(s,658,210,580,'민감정보 활용 제한','조직·직군·역량군 집계를 기본으로\n개인 평가·보상 등 직접 노출 제한');
pair(s,42,428,568,'지표 정의와 책임 통일','인원·Man month·이동·퇴사 정의 확정\n데이터 소유 부서가 품질과 변경 관리');
pair(s,658,428,580,'판단은 리더가 승인','추천의 근거·가정·제약을 확인하고\n인력 배치 실행은 책임자가 결정');
}
rows('MVP부터 검증하며 기능과 데이터를 확장합니다','12  단계별 구축',[
['1  현황 기반','인력·조직·직무·근태·시점 이력 구축  |  원안 예시 3–4개월'],
['2  과제 연결','과제·배치·Man month 연결  |  역량 데이터 확장'],
['3  지능화','자연어 질의·추세·원인·이동·역량 분석'],
['4  미래 계획','사업계획·역량 수요·인력 수급 예측'],
['5  최적화','시나리오 비교·역량 매칭·재배치 대안 제시']],'16, 17','MVP 권장: 6개 핵심 데이터 + 시점 이력 / 일정은 연계 가능성과 품질 확인 후 확정');
cols('착수 범위와 성공 기준을 먼저 확정합니다','13  리더 검토 사항',[
['우선 의사결정','시범 조직·과제를 선정하고\n인력배치·충원·재배치 중\n우선 검증 질문을 확정'],
['데이터와 책임','HR·사업부·PM·IT의\n역할과 데이터 접근 범위,\nMan month 산정 기준 합의'],
['MVP 검증 기준','집계 일치도·조회 소요시간·\n투입계획 충실도·추천 검토율로\n확장 여부 판단']], '17–19, 22; 검증 지표는 제안','요청: MVP 상세 설계 착수  ·  범위·데이터 품질 확인 후 일정과 예산 산정');
await fs.mkdir(dir+'/renders',{recursive:true});
await fs.writeFile(dir+'/source-notes.txt','Source: /Users/steven/Projects/simulation/design.md\nNo external claims/assets. Examples explicitly hypothetical. Man month requires defined period.\nVisual reference: Codex Grid 01,03,05,06,13,15,17; native architecture diagram adapted to full-width evidence region.');
await fs.writeFile(dir+'/boxes.json',JSON.stringify(boxes,null,2));
const deck=await PresentationFile.exportPptx(p);await deck.save(output);
for(let i=0;i<p.slides.items.length;i++){const s=p.slides.items[i];await fs.writeFile(`${dir}/renders/slide-${String(i+1).padStart(2,'0')}.png`,new Uint8Array(await (await p.export({slide:s,format:'png',scale:1})).arrayBuffer()));await fs.writeFile(`${dir}/renders/slide-${i+1}.json`,await (await s.export({format:'layout'})).text());console.log('rendered',i+1);}
console.log(output);
