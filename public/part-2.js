
(function(){
'use strict';
const svg=document.getElementById('graph'),scroller=document.getElementById('scroller'),insp=document.getElementById('inspector'),control=document.getElementById('presets'),stat=document.getElementById('live-status');
const NS='http://www.w3.org/2000/svg';
const colors={raw:'#9aa8b5',el:'#2865ce',heat:'#d87829',h2:'#088a80',nh3:'#8751bb',co2:'#687889'};
const X=[34,289,549,814,1092],NW=193,NH=59;
const n=(id,col,y,icon,name,short,description,exo,endo)=>({id,col,x:X[col],y,icon,name,short,description,exo,endo});
const nodes=[
 n('wind',0,134,'🌬️','Wind','Primärenergie','Bewegungsenergie der Luft. Die räumlichen und stündlichen Windprofile bestimmen das Erzeugungspotenzial.','Windprofile, regionale Potenziale, Landnutzung.','Ressource selbst nicht optimierbar.'),
 n('sun',0,220,'☀️','Sonnenstrahlung','Primärenergie','Sonnenlicht ist eine Primärenergiequelle für Photovoltaikanlagen.','Einstrahlungsprofile, Flächenpotenziale.','Ressource selbst nicht optimierbar.'),
 n('river',0,306,'💧','Wassergefälle','Primärenergie','Zufluss und Fallhöhe bestimmen das theoretische Wasserkraftpotenzial.','Zuflussdaten, Wasserkraftpotenziale.','Ressource selbst nicht optimierbar.'),
 n('uranium',0,392,'⚛️','Uran','Kernbrennstoff','Uran ist ein Brennstoff für Kernspaltungsreaktoren.','Preise, Import-/Versorgungsgrenzen, Zulässigkeit.','Brennstoffeinsatz aus Kraftwerksbetrieb.'),
 n('gas',0,478,'🔥','Erdgas','Fossiler Brennstoff','Erdgas ist ein fossiler Energieträger für Gas- und GuD-Kraftwerke. Die Verbrennung erzeugt CO₂.','Preise, Verfügbarkeit, Emissionsfaktor, Importgrenzen.','Gasverbrauch als Folge des Dispatchs.'),
 n('biomass',0,564,'🌱','Biomasse','Biogener Brennstoff','Biogene Brennstoffe können Strom und Wärme in KWK-Anlagen bereitstellen.','Nachhaltige Biomassepotenziale und Kosten.','Einsatz aus Anlagenfahrweise.'),
 n('water',0,739,'🚰','Wasser (H₂O)','Rohstoff','Wasser wird bei der Elektrolyse in Wasserstoff und Sauerstoff gespalten.','Wasserzugang und Aufbereitungskosten.','Verbrauch abhängig von Wasserstoffproduktion.'),
 n('ambient',0,885,'🍃','Umweltwärme','Thermische Quelle','Die Wärmepumpe entzieht der Außenluft, dem Boden oder Wasser Umweltwärme. Daher kann Nutzwärme größer als der Strominput sein.','Temperaturprofil, Quellenpotenzial.','Genutzte Umweltwärme aus Wärmepumpeneinsatz.'),
 n('nitrogen',0,1080,'💨','Stickstoff (N₂)','Rohstoff','Stickstoff wird aus der Luft bereitgestellt und bei Haber-Bosch zur Ammoniaksynthese benötigt.','Aufwand und Kosten der Luftzerlegung.','N₂-Einsatz entsprechend NH₃-Produktion.'),
 n('windp',1,134,'🌪️','Windkraftwerk','Wind → Strom','Generator erzeugt elektrischen Strom aus Wind; stündlich durch Windverfügbarkeit begrenzt.','Kosten, Lebensdauer, Verfügbarkeit, Flächenregeln.','Installierte MW, Einspeisung, Abregelung.'),
 n('pv',1,220,'🔆','Photovoltaik','Sonne → Strom','Photovoltaikmodule wandeln solare Strahlung in elektrischen Strom um.','Einstrahlung, Kosten und PV-Potenziale.','Installierte Leistung und Einspeisung.'),
 n('hydrop',1,306,'🌊','Wasserkraftwerk','Wasser → Strom','Wasserturbine erzeugt Strom aus hydraulischer Energie.','Zufluss, Kosten, Standorte.','Einsatz und ggf. Kraftwerkskapazität.'),
 n('nuclear',1,392,'⚛️','Kernkraftwerk','Kernspaltung → Strom','Wärme aus Kernspaltung betreibt Dampfkreislauf und Generator; Standort- und Gefährdungsrisiken beachten.','Brennstoff, CAPEX, Verfügbarkeit, Genehmigung.','Bei Zulässigkeit installierte Leistung und Dispatch.'),
 n('gasp',1,478,'🏭','Gas-/GuD-Kraftwerk','Gas → Strom + CO₂','Gasturbine/GuD erzeugt Strom. CO₂ entsteht als getrennter Abgasstrom. KWK-Varianten können Wärme auskoppeln.','Brennstoffkosten, Wirkungsgrad, Emissionsfaktor.','Anlagenkapazität, Fahrweise, Emissionen.'),
 n('biop',1,564,'🌿','Biomasse-KWK','Biomasse → Strom/Wärme','Kraft-Wärme-Kopplung erzeugt Strom und nutzbare Wärme. Bei geeigneter Auslegung ist CO₂-Abscheidung denkbar.','Biomassepotenzial, Kosten und Wirkungsgrade.','Strom- und Wärmeerzeugung, Ausbau.'),
 n('grid',2,355,'⚡','Stromnetz','Elektrische Bilanz','Regionaler Strombilanzknoten. In jeder Stunde müssen Einspeisung, Nachfrage, Speicherladung, Umwandlungsverbräuche und Verluste zusammenpassen.','Exogene Stromnachfrage, Korridore, Leitungskosten, Netzverluste.','Kraftwerksdispatch, Leitungsausbau und Stromflüsse.'),
 n('h2',2,713,'🟢','Wasserstoff (H₂)','Chemischer Energieträger','Wasserstoff kann gespeichert, rückverstromt, chemisch genutzt oder zu Ammoniak synthetisiert werden.','Gegebenenfalls exogene Wasserstoffnachfrage.','Produktion, Stoffflüsse und Einspeicherung.'),
 n('thermal',2,917,'♨️','Nutzwärme','Thermische Bilanz','Wärme kann direkt zum Verbraucher gelangen oder zeitlich zwischengespeichert werden.','Gebäude-/Industriewärmelast und Temperaturniveau.','Erzeugung, Wärmespeicherung und Bereitstellung.'),
 n('ammonia',2,1111,'🧫','Ammoniak (NH₃)','Chemischer Energieträger','Ammoniak ist sowohl industrieller Rohstoff als auch optionaler Energiespeicher, H₂-Transportträger oder Kraftstoff.','NH₃-Nachfrage und Prozesskosten, soweit modelliert.','Synthese, Lagerung und stoffliche bzw. energetische Nutzung.'),
 n('co2',2,1354,'☁️','CO₂-Abgas','Kohlenstoffstrom','CO₂ entsteht bei Verbrennung und kann teilweise aus geeigneten Abgasen abgeschieden werden. Nicht abgeschiedene Anteile gelten als Emissionen.','Emissionen pro Brennstoff und zulässige Abscheideraten.','Tatsächliche CO₂-Entstehung, Abscheidung und Restemissionen.'),
 n('battery',3,130,'🔋','Batteriespeicher','Strom ↔ Strom','Batterie speichert elektrische Energie elektrochemisch und gibt sie nach zeitlicher Verschiebung mit Verlusten zurück.','Kosten in €/MW und €/MWh, Wirkungsgrade, Alterung.','Batteriegröße, Lade-/Entladeleistung, Füllstand.'),
 n('pumped',3,216,'🏞️','Pumpspeicher','Strom ↔ Lageenergie','Strom pumpt Wasser in einen höher gelegenen Speicher; eine Turbine wandelt Höhenenergie später zurück in Strom.','Standorte, Reservoirvolumen, Wirkungsgrade, Kosten.','Pump-, Turbinen- und Speicherkapazität.'),
 n('ely',3,338,'⚙️','Elektrolyseur','Strom + H₂O → H₂','Elektrolyseur stellt Wasserstoff aus Wasser und Strom her; die stoffliche Umwandlung erzeugt Verluste.','Wirkungsgrad, Investitionskosten und Wasserverfügbarkeit.','Leistung, Fahrweise, H₂-Produktion.'),
 n('saltcavern',3,481,'🧂','Salzkaverne (H₂)','Geologischer H₂-Speicher','Optionale geologische Wasserstoffspeicherung in geeigneten Salzkavernen; geologische Eignung und Standortverfügbarkeit begrenzen das Ausbaupotenzial. Noch nicht Bestandteil der bestätigten Baseline.','Salzstrukturen, zulässige Standorte, Kosten, Verdichtung, Verluste und geologische Speicherpotenziale.','Bei Zulassung Kavernenkapazität sowie Ein-/Ausspeicherung und Füllstand.'),
 n('h2store',3,585,'🧯','H₂-Druckspeicher','H₂ ↔ H₂','Wasserstoffspeicherung in Druckbehältern. Verdichtung benötigt zusätzliche Energie. Geologische Salzkavernen sind eine separate optionale Speichertechnologie.','Kosten, Verluste, Druckniveau und Standortbedingungen.','Kapazität, Ein-/Ausspeicherung, Füllstand.'),
 n('fuelcell',3,695,'🔌','Brennstoffzelle','H₂ → Strom','Brennstoffzelle erzeugt aus Wasserstoff mit Sauerstoff Strom und Wärme; die Rückverstromung verursacht Verluste.','Wirkungsgrad, Kosten, Lebensdauer.','Leistung und Wasserstoffverbrauch.'),
 n('heatpump',3,824,'🌡️','Wärmepumpe','Strom + Umweltwärme → Wärme','Die Wärmepumpe verbindet elektrischen Strom mit Umweltwärme. Bei COP 3 ergeben 1 kWh Strom + 2 kWh Umweltwärme etwa 3 kWh Nutzwärme.','COP, Außentemperatur, Wärmelast, Kosten.','Wärmepumpenleistung, Betrieb und Stromaufnahme.'),
 n('heatstore',3,922,'♨️','Wärmespeicher','Wärme ↔ Wärme','Wärme wird in Wasser, Salz, Feststoffen oder Phasenwechselmedien gespeichert und später als Wärme entnommen.','Wärmeverluste, Temperaturbereich, Kosten.','Speicherkapazität, Ein-/Ausspeisung.'),
 n('haber',3,1035,'🧬','Haber–Bosch','H₂ + N₂ → NH₃','Chemische Synthese von Ammoniak aus Wasserstoff und Stickstoff. Sie ist ein Umwandlungsprozess, nicht selbst ein Speicher.','Synthesekosten, Prozesswärme und Regelbarkeit.','NH₃-Produktionskapazität und Fahrweise.'),
 n('nhstore',3,1122,'🛢️','NH₃-Lager','Lagerung / Transport','Ammoniak wird in Tanks gelagert oder über längere Distanzen transportiert.','Transportenergie, Lagerverluste, Tankkosten.','Speichergröße, transportierte und entnommene Menge.'),
 n('cracker',3,1209,'🔁','NH₃-Cracker','NH₃ → H₂ + N₂','Cracking spaltet Ammoniak unter Energiezufuhr wieder zu Wasserstoff und Stickstoff; H₂-Reinigung kann nötig sein.','Crackingkosten, Wärmebedarf, H₂-Reinheit.','Cracker-Leistung, H₂-Rückgewinnung.'),
 n('nhmotor',3,1296,'🚢','NH₃-Motor','NH₃ → Antriebsarbeit','Geeignete Ammoniakmotoren können NH₃ direkt für den Schiffsantrieb einsetzen, ohne vorheriges vollständiges Cracking. NOₓ/N₂O beachten.','Brennstoff- und Motorkosten, Emissionsauflagen.','Motorleistung und Brennstoffverbrauch.'),
 n('ccs',3,1390,'🪨','CO₂-Abscheidung','Capture / Transport','CCS scheidet einen Teil des CO₂ aus geeigneten Abgasströmen ab; der Prozess benötigt zusätzlich Energie.','Abscheiderate, Wärme-/Strombedarf, Speicherpotenziale.','Abscheidekapazität und eingespeicherte CO₂-Menge.'),
 n('home',4,143,'🏠','Haushaltsstrom','Endverbrauch · Strom','Geräte, Beleuchtung und sonstige elektrische Verbrauchsgeräte in privaten Haushalten.','Stündliche Nachfrage und Entwicklungsszenarien.','Lastdeckung und mögliche Fehlmengen.'),
 n('data',4,229,'🖥️','Rechenzentren','Endverbrauch · Strom','Rechenzentren benötigen Strom für IT und Kühlung. Zukünftige Rechenzentrengrößen werden exogen prognostiziert.','Anzahl, Standorte und Lastprofile.','Versorgung der Last; keine automatische Preisfeedback-Schleife.'),
 n('ev',4,315,'🚗','E-Mobilität','Endverbrauch · Strom','Elektrofahrzeuge nutzen Strom zum Laden. Flexible Ladung erfordert eine eigene explizite Nebenbedingung.','Flotte, Fahrleistung, Ladestrombedarf.','Versorgung und ggf. zeitliche Verschiebung innerhalb fester Grenzen.'),
 n('industry',4,401,'🏭','Industrie (Strom)','Endverbrauch · Strom','Elektrischer Bedarf der Industrie, einschließlich möglicher Elektrifizierung bestehender Prozesse.','Prozesslastprofile und Szenarien zur Industrieentwicklung.','Stromversorgung der exogenen Last.'),
 n('h2industry',4,712,'🏗️','Industrie (H₂)','Endverbrauch · H₂','Wasserstoff wird als Reduktionsmittel, chemischer Rohstoff oder Energieträger in der Industrie genutzt.','Exogene H₂-Nachfrage, falls im Modell berücksichtigt.','Bedarfsdeckung durch Produktions- und Speicherentscheidungen.'),
 n('househeat',4,824,'🏡','Haushaltswärme','Endverbrauch · Wärme','Nutzwärme für Raumheizung und Warmwasser. Direkter Endpunkt des Wärmeflusses aus Wärmepumpen oder Wärmespeichern.','Stündliche Wärmebedarfsprofile, Gebäudeszenarien.','Wärmebereitstellung durch zulässige Technologien.'),
 n('indheat',4,924,'🏭','Industriewärme','Endverbrauch · Wärme','Prozesswärme mit technologisch verschiedenen Temperaturniveaus.','Industriewärmebedarf und Temperaturanforderungen.','Bereitstellung von Prozesswärme, falls enthalten.'),
 n('fertilizer',4,1055,'🌾','Chemie & Dünger','Stofflicher NH₃-Verbrauch','Ammoniak wird direkt chemisch genutzt, besonders für Düngemittel; eine Rückverstromung ist hier nicht erforderlich.','Exogene stoffliche NH₃-Nachfrage.','Bereitstellung des Rohstoffs.'),
 n('ship',4,1295,'⚓','Schiffsantrieb','Energetischer Endnutzen','Ein dafür ausgelegter NH₃-Motor kann mechanische Antriebsarbeit bereitstellen.','Exogene Transportleistung und technische Vorgaben.','Antriebsleistung und NH₃-Verbrauch.'),
 n('geostore',4,1390,'⛰️','CO₂-Endlager','Geologische Stoffsenke','Abgeschiedenes CO₂ wird geologisch gespeichert; dies ist kein Stromspeicher.','Speicherkapazität, Injektionsrate und Lagerkosten.','Dauerhaft eingebrachte CO₂-Menge.')
];
const by=Object.fromEntries(nodes.map(x=>[x.id,x]));
const edgeList=[];function e(a,b,type){edgeList.push({a,b,type,id:a+'>'+b})}
[['wind','windp'],['sun','pv'],['river','hydrop'],['uranium','nuclear'],['gas','gasp'],['biomass','biop']].forEach(pair=>e(pair[0],pair[1],'raw'));
['windp','pv','hydrop','nuclear','gasp','biop'].forEach(id=>e(id,'grid','el'));
['home','data','ev','industry'].forEach(id=>e('grid',id,'el'));
['battery','pumped'].forEach(id=>{e('grid',id,'el');e(id,'grid','el')});
e('grid','ely','el');e('water','ely','raw');e('ely','h2','h2');e('h2','saltcavern','h2');e('saltcavern','h2','h2');e('h2','h2store','h2');e('h2store','h2','h2');e('h2','fuelcell','h2');e('fuelcell','grid','el');e('h2','h2industry','h2');
e('grid','heatpump','el');e('ambient','heatpump','heat');e('heatpump','thermal','heat');e('heatpump','househeat','heat');e('thermal','househeat','heat');e('thermal','indheat','heat');e('thermal','heatstore','heat');e('heatstore','thermal','heat');e('biop','thermal','heat');e('gasp','thermal','heat');
e('h2','haber','h2');e('nitrogen','haber','raw');e('haber','ammonia','nh3');e('ammonia','nhstore','nh3');e('nhstore','ammonia','nh3');e('ammonia','fertilizer','nh3');e('ammonia','cracker','nh3');e('cracker','h2','h2');e('ammonia','nhmotor','nh3');e('nhmotor','ship','heat');
e('gasp','co2','co2');e('biop','co2','co2');e('co2','ccs','co2');e('ccs','geostore','co2');e('grid','ccs','el');
const paths=[
 {id:'all',title:'Gesamtsystem',ids:null,color:'raw'},
 {id:'power',title:'Direkter Strom',ids:['wind>windp','windp>grid','grid>home','grid>data','grid>industry'],color:'el'},
 {id:'heat',title:'Wärmepumpe → Haushalt',ids:['sun>pv','pv>grid','grid>heatpump','ambient>heatpump','heatpump>househeat','heatpump>thermal','thermal>househeat'],color:'heat'},
 {id:'battery',title:'Batteriespeicher',ids:['sun>pv','pv>grid','grid>battery','battery>grid','grid>home'],color:'el'},
 {id:'hydrogen',title:'Wasserstoff → Strom',ids:['wind>windp','windp>grid','grid>ely','water>ely','ely>h2','h2>saltcavern','saltcavern>h2','h2>h2store','h2store>h2','h2>fuelcell','fuelcell>grid','grid>home'],color:'h2'},
 {id:'ammonia',title:'Ammoniak → Strom',ids:['grid>ely','water>ely','ely>h2','h2>haber','nitrogen>haber','haber>ammonia','ammonia>nhstore','nhstore>ammonia','ammonia>cracker','cracker>h2','h2>fuelcell','fuelcell>grid','grid>home'],color:'nh3'},
 {id:'fertilizer',title:'NH₃ → Dünger',ids:['grid>ely','ely>h2','h2>haber','nitrogen>haber','haber>ammonia','ammonia>fertilizer'],color:'nh3'},
 {id:'ccs',title:'CO₂ / CCS',ids:['gas>gasp','gasp>co2','co2>ccs','grid>ccs','ccs>geostore'],color:'co2'}
];
let current='all',selected='grid',searchTerm='';
const originalNodes=Object.fromEntries(nodes.map(o=>[o.id,{...o}]));
const originalPaths=Object.fromEntries(paths.map(p=>[p.id,p.title]));
const T=(de,en)=>window.AtlasI18n?.t(de,en)??de;
const englishPaths={all:'Entire system',power:'Direct electricity',heat:'Heat pump → homes',battery:'Battery storage',hydrogen:'Hydrogen → power',ammonia:'Ammonia → power',fertilizer:'NH₃ → fertiliser',ccs:'CO₂ / CCS'};
const englishStages=[['01 / SOURCES','Primary energy and feedstocks'],['02 / GENERATION','Power plants and generators'],['03 / CARRIERS','Power, heat and material flows'],['04 / STORAGE & CONVERSION','Sector coupling and reconversion'],['05 / DEMAND','Final demand and carbon sinks']];

const sv=(tag,attrs={},parent=svg)=>{const z=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))z.setAttribute(k,v);parent.appendChild(z);return z};
const defs=sv('defs');for(const[type,c]of Object.entries(colors)){const m=sv('marker',{id:'arrow-'+type,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'},defs);sv('path',{d:'M1 1 L9 5 L1 9 Z',fill:c},m)}
const stages=[['01 / QUELLEN','Primärenergie und Rohstoffe'],['02 / ERZEUGER','Kraftwerke und Generatoren'],['03 / ENERGIETRÄGER','Strom, Wärme und Stoffströme'],['04 / SPEICHER & WANDLER','Sektorkopplung und Rückumwandlung'],['05 / VERBRAUCH','Endnachfrage und Stoffsenken']];
const widths=[226,228,232,243,222];
stages.forEach((st,i)=>{sv('rect',{x:X[i]-12,y:75,width:widths[i],height:1418,rx:13,class:'column'});let a=sv('text',{x:X[i],y:32,class:'coltitle'});a.textContent=st[0];let b=sv('text',{x:X[i],y:51,class:'colsub'});b.textContent=st[1]});
const edgesGroup=sv('g',{'aria-hidden':'true'}),nodesGroup=sv('g');const edgeEl={};
const route=(a,b,idx)=>{let ax,ay,bx,by;
 if(a.col===b.col){ax=a.x+NW/2;bx=b.x+NW/2;ay=a.y+NH;by=b.y;const bend=25+idx%3*10;return `M ${ax} ${ay} C ${ax+bend} ${ay+18}, ${bx+bend} ${by-20}, ${bx} ${by}`}
 const right=b.x>a.x;ax=right?a.x+NW:a.x;bx=right?b.x:b.x+NW;ay=a.y+NH/2;by=b.y+NH/2;
 const span=Math.abs(bx-ax),curve=Math.max(30,Math.min(148,span*.43));
 const offset=(idx%3-1)*5;
 return `M ${ax} ${ay+offset} C ${ax+(right?curve:-curve)} ${ay+offset}, ${bx-(right?curve:-curve)} ${by-offset}, ${bx} ${by-offset}`};
edgeList.forEach((edge,i)=>{edgeEl[edge.id]=sv('path',{d:route(by[edge.a],by[edge.b],i),stroke:colors[edge.type],class:'edge',opacity:'.16','stroke-width':2,'marker-end':'url(#arrow-'+edge.type+')'},edgesGroup)});
const nodeEl={};nodes.forEach(o=>{const g=sv('g',{transform:`translate(${o.x} ${o.y})`,class:'node',tabindex:'0',role:'button','aria-label':o.name},nodesGroup);sv('rect',{width:NW,height:NH,rx:10},g);sv('rect',{x:0,y:7,width:3,height:45,rx:1.5,fill:['#9aa8b5','#2865ce','#088a80','#8751bb','#8091a0'][o.col]},g);const icon=sv('text',{x:11,y:36,class:'ni'},g);icon.textContent=o.icon;const label=sv('text',{x:39,y:25,class:'nt'},g);label.textContent=o.name;const short=sv('text',{x:39,y:43,class:'ns'},g);short.textContent=o.short.length>27?o.short.slice(0,26)+'…':o.short;const title=sv('title',{},g);title.textContent=o.description;const click=()=>{selected=o.id;update(false)};g.addEventListener('click',click);g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();click()}});nodeEl[o.id]=g});
function text(tag,cls,content,parent){const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;(parent||insp).appendChild(el);return el}
function field(heading,body,cls){const box=text('div','detailbox '+(cls||''));text('h4','',heading,box);text('p','',body,box)}
function update(scroll){
 const p=paths.find(p=>p.id===current)||paths[0],active=new Set(p.ids||[]),related=new Set([selected]),touching=new Set();edgeList.forEach(e=>{if(e.a===selected||e.b===selected){related.add(e.a);related.add(e.b);touching.add(e.id)}});
 const inPath=new Set();edgeList.forEach(e=>{if(active.has(e.id)){inPath.add(e.a);inPath.add(e.b)}});
 edgeList.forEach(e=>{const on=active.has(e.id),hit=touching.has(e.id);let opacity,width;
 if(current==='all'){opacity=hit?.95:.15;width=hit?4.1:1.85}else{opacity=on?.96:.018;width=on?(hit?4.3:3.45):1.2}if(searchTerm && (by[e.a].name.toLowerCase().includes(searchTerm)||by[e.b].name.toLowerCase().includes(searchTerm)))opacity=Math.max(opacity,.65);
 edgeEl[e.id].setAttribute('opacity',opacity);edgeEl[e.id].setAttribute('stroke-width',width)});
 nodes.forEach(o=>{const activeNode=o.id===selected;nodeEl[o.id].classList.toggle('active',activeNode);let opacity=current==='all'?(related.has(o.id)?1:.72):(inPath.has(o.id)?1:.19);if(searchTerm&&o.name.toLowerCase().includes(searchTerm))opacity=1;if(activeNode)opacity=1;nodeEl[o.id].setAttribute('opacity',opacity)});
 control.replaceChildren();paths.forEach(p=>{const b=document.createElement('button');b.className='pill'+(p.id===current?' selected':'');b.type='button';if(p.id!=='all'){const dot=document.createElement('span');dot.className='dot';dot.style.setProperty('--c',colors[p.color]);b.appendChild(dot)}b.appendChild(document.createTextNode(p.title));b.onclick=()=>{current=p.id;selected={all:'grid',power:'grid',heat:'heatpump',battery:'battery',hydrogen:'h2store',ammonia:'cracker',fertilizer:'haber',ccs:'ccs'}[p.id];searchTerm='';document.getElementById('search').value='';update(true);setUrl()};control.appendChild(b)});
 insp.replaceChildren();const o=by[selected];text('div','tiny',T('Technologie-Inspector','Technology inspector'));const hr=text('div','headrow');text('div','large-icon',o.icon,hr);const hh=text('div','');text('h3','',o.name,hh);text('div','type',o.short,hh);hr.appendChild(hh);text('p','copy',o.description);
 field(T('Exogen / Eingangsparameter','Exogenous inputs'),o.exo,'exo');field(T('Endogen / Modellentscheidung','Endogenous decision'),o.endo,'endo');
 const box=text('div','detailbox connections');text('h4','',T('Direkt verbundene Technologien','Direct connections'),box);const con=text('div','conn','',box);const relatedEdges=edgeList.filter(e=>e.a===selected||e.b===selected);const neighbor=[...new Set(relatedEdges.map(e=>e.a===selected?e.b:e.a))];neighbor.forEach(id=>{const b=text('button','',by[id].name,con);b.type='button';b.onclick=()=>{selected=id;update(true)}});
 const hint=text('p','copy',T('Für den vollständigen Modellfluss beachte auch Nebenverbräuche, Umwandlungsverluste und bei H₂/NH₃ die Stoffbilanz.','For complete system modelling, include auxiliary consumption, conversion losses and material balances for H₂/NH₃.'));hint.style.fontSize='11px';hint.style.color='#788a98';
 if(scroll){const zoom=Number(document.getElementById('zoom').value)/100;const targetX=(o.x+NW/2)*zoom,targetY=(o.y+NH/2)*zoom;scroller.scrollTo({left:Math.max(0,targetX-scroller.clientWidth/2),top:Math.max(0,targetY-scroller.clientHeight/2),behavior:'smooth'})}
}
function setUrl(){const params=new URLSearchParams(location.search);params.delete('path');if(current!=='all')params.set('path',current);const url=location.pathname+(params.toString()?'?'+params.toString():'')+location.hash;try{history.replaceState({},'',url)}catch{}}
function applyLanguage(){
 const en=window.AtlasI18n?.lang==='en',dictionary=window.AtlasI18n?.graph||{};
 nodes.forEach(o=>{
   Object.assign(o,originalNodes[o.id]);
   const tr=dictionary[o.id];
   if(en&&tr)Object.assign(o,{name:tr[0],short:tr[1],description:tr[2],exo:tr[3],endo:tr[4]});
   const g=nodeEl[o.id];g.setAttribute('aria-label',o.name);g.querySelector('.nt').textContent=o.name;g.querySelector('.ns').textContent=o.short.length>27?o.short.slice(0,26)+'…':o.short;g.querySelector('title').textContent=o.description;
 });
 paths.forEach(p=>p.title=en?englishPaths[p.id]:originalPaths[p.id]);
 const titleEls=svg.querySelectorAll('.coltitle'),subEls=svg.querySelectorAll('.colsub');
 stages.forEach((st,i)=>{titleEls[i].textContent=en?englishStages[i][0]:st[0];subEls[i].textContent=en?englishStages[i][1]:st[1]});
 searchTerm='';const search=document.getElementById('search');if(search)search.value='';
 update(false);
}
window.addEventListener('atlas:language',applyLanguage);
const q=new URLSearchParams(location.search).get('path');if(paths.some(x=>x.id===q)){current=q;selected={power:'grid',heat:'heatpump',battery:'battery',hydrogen:'h2store',ammonia:'cracker',fertilizer:'haber',ccs:'ccs'}[q]||'grid'}
update(false);
document.getElementById('search').addEventListener('input',ev=>{searchTerm=ev.target.value.trim().toLowerCase();if(searchTerm){const first=nodes.find(n=>n.name.toLowerCase().includes(searchTerm));if(first){selected=first.id;update(true)}else{stat.textContent=T('Keine Technologie gefunden','No matching technology')}}else{stat.textContent='';update(false)}});
document.getElementById('reset').addEventListener('click',()=>{current='all';selected='grid';searchTerm='';document.getElementById('search').value='';applyZoom(100,false);update(false);scroller.scrollTo({left:210,top:180,behavior:'smooth'});setUrl()});
document.getElementById('share').addEventListener('click',async()=>{const link=location.href;try{await navigator.clipboard.writeText(link);stat.textContent=T('Link kopiert ✓','Link copied ✓');setTimeout(()=>stat.textContent='',3500)}catch{const inp=document.createElement('input');inp.value=link;document.body.appendChild(inp);inp.select();document.execCommand('copy');inp.remove();stat.textContent='Link kopiert ✓';setTimeout(()=>stat.textContent='',3500)}});
const zoomSlider=document.getElementById('zoom');
const zoomLabel=document.getElementById('zoomnumber');
const BASE_W=1338,BASE_H=1530;
let currentZoom=100;

function applyZoom(percent,keepCentre=true){
 const next=Math.max(+zoomSlider.min,Math.min(+zoomSlider.max,Number(percent)||100));
 const scale=next/100;
 let anchorX=BASE_W/2,anchorY=BASE_H/2;
 if(keepCentre){
  const beforeSvg=svg.getBoundingClientRect(),beforeScroller=scroller.getBoundingClientRect();
  anchorX=(beforeScroller.left+scroller.clientWidth/2-beforeSvg.left)/(currentZoom/100);
  anchorY=(beforeScroller.top+scroller.clientHeight/2-beforeSvg.top)/(currentZoom/100);
 }
 svg.setAttribute('width',String(Math.round(BASE_W*scale)));
 svg.setAttribute('height',String(Math.round(BASE_H*scale)));
 currentZoom=next;
 zoomSlider.value=String(next);
 zoomLabel.textContent=next+' %';
 if(keepCentre){
  const svgRect=svg.getBoundingClientRect(),paneRect=scroller.getBoundingClientRect();
  scroller.scrollLeft+=svgRect.left+anchorX*scale-(paneRect.left+scroller.clientWidth/2);
  scroller.scrollTop+=svgRect.top+anchorY*scale-(paneRect.top+scroller.clientHeight/2);
 }
}
function fitZoom(){
 const ideal=100*Math.min((scroller.clientWidth-24)/BASE_W,(scroller.clientHeight-24)/BASE_H);
 const value=Math.max(+zoomSlider.min,Math.min(+zoomSlider.max,Math.floor(ideal/5)*5));
 applyZoom(value,false);
 scroller.scrollLeft=Math.max(0,(scroller.scrollWidth-scroller.clientWidth)/2);
 scroller.scrollTop=Math.max(0,(scroller.scrollHeight-scroller.clientHeight)/2);
}
zoomSlider.addEventListener('input',ev=>applyZoom(ev.target.value));
document.getElementById('zoom-out').addEventListener('click',()=>applyZoom(currentZoom-20));
document.getElementById('zoom-in').addEventListener('click',()=>applyZoom(currentZoom+20));
document.getElementById('zoom-fit').addEventListener('click',fitZoom);
scroller.scrollLeft=180;scroller.scrollTop=185;
})();
