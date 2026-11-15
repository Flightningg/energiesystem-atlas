
(function(){
'use strict';
const TRANSLATIONS={
  de:{
    eyebrow:'MASTERARBEIT · MODELLARCHITEKTUR · ZIELJAHR 2060',
    heading:'Wie greifen Daten, Forecasting und Optimierung ineinander?',
    intro:'Die links gesammelten Daten fließen teilweise direkt als Randbedingungen in den Optimierer und teilweise vorher in ein Forecasting-Modell. Der Optimierer findet den kostenminimalen Energiemix für 2060. Die oben ausgewählten Learning-by-Doing-Technologien erscheinen automatisch im Forecasting-Block.',
    inputKicker:'01 · INPUTS / DATEN', inputTitle:'Datenbasis & exogene Annahmen',
    inputDesc:'Historische Daten und Rahmenbedingungen, die wir für Deutschland und Japan sammeln.',
    input1:'Historische Stromlast, Lastprofile und sektorale Nachfrageindikatoren',
    input2:'Stündliche Wetterdaten sowie Wind- und Solarressourcen',
    input3:'Technologieparameter: CAPEX, OPEX, Wirkungsgrad, Lebensdauer',
    input4:'Flächen-, Netz-, Speicher- und Rohstoffpotenziale',
    input5:'Politische Vorgaben, CO₂-Grenzen und Genehmigungsregeln',
    input6:'Resilienz-, Ausfall- und Risikoszenarien',
    inputNote:'Ein Teil der Inputdaten geht direkt in den Optimierer (z. B. technische Restriktionen). Andere Größen werden zuerst für 2060 prognostiziert.',
    arrowForecast:'Für Forecasts', arrowDirect:'Direkt als Input',
    forecastKicker:'02 · FORECASTING-METHODE',forecastTitle:'Exogene Zukunftspfade für 2060',
    forecastDesc:'Forecasting bzw. Szenarioannahmen liefern die Größen, die vor der Optimierung feststehen.',
    forecast1:'Stromnachfrage 2060, z. B. Elektrifizierung und Rechenzentren',
    forecast2:'Wetter- und Verfügbarkeitsprofile für das Zieljahr / repräsentative Wetterjahre',
    forecast3:'Technologiekosten 2060: Learning-by-Doing für ausgewählte Kandidaten',
    forecast4:'Politische und resilienzbezogene Szenarioparameter',
    selectedTitle:'Für Learning-by-Doing-Forecast ausgewählt',selectedHint:'Häkchen in der Tabelle oben setzen oder entfernen: Diese Liste ändert sich sofort.',
    loading:'Lade Auswahl …',empty:'Keine Technologien für Learning-by-Doing ausgewählt',
    arrowDown:'Exogene Forecasts',arrowOutput:'Optimales System',
    optimizerKicker:'03 · GREENFIELD-OPTIMIERER',optimizerTitle:'Optimierung des Zieljahres 2060',
    optimizerDesc:'Der Optimierer erhält Forecasts und weitere feste Inputs. Er sucht die zulässige Technologiekombination und minimiert die Kosten des Energiesystems im Jahr 2060.',
    opt1:'Endogen: Kapazitäten für Wind, PV, Speicher, Konverter und ggf. Netzausbau',
    opt2:'Endogen: stündlicher Dispatch, Speicherbetrieb und Energieflüsse',
    opt3:'Restriktionen: Nachfrage, CO₂-Budget, technische Grenzen, Resilienz',
    opt4:'Zielfunktion: minimale jährliche Systemkosten 2060 (annualisierte Investitions- und Betriebskosten)',
    optimizerNote:'Auch eine rot markierte Technologie kann im Optimierer berücksichtigt werden. Rot heißt nur: kein separater Learning-by-Doing-Forecast vorgesehen.',
    outputKicker:'04 · OUTPUT / FORSCHUNGSERGEBNIS',outputTitle:'Kostenoptimales Energiesystem',
    resultPrimary:'Optimale Renewable Penetration Rate 2060',
    resultSubtitle:'EE-Anteil des kostenminimalen Systems unter den gewählten Szenarioannahmen',
    output1:'Minimale jährliche Gesamtsystemkosten im Zieljahr 2060',
    output2:'Optimaler Technologie-, Speicher- und Kapazitätsmix',
    output3:'Emissionen, Resilienz und Sensitivitäten',
    output4:'Vergleich der Fallstudien Deutschland und Japan',
    outputNote:'Nicht minimiert werden die kumulierten Kosten von heute bis 2060. Bewertet wird das System im Zieljahr.',
    principleLabel:'Methodisches Prinzip:',
    principle:'Eine Technologie per Checkbox zum Learning-by-Doing-Forecast hinzuzufügen bedeutet, dass für sie ein exogener Kostenpfad für 2060 erarbeitet werden soll. Der Optimierer entscheidet anschließend selbst, ob und wie viel dieser Technologie im kostenminimalen System eingesetzt wird. Für nicht ausgewählte Technologien können weiterhin Kostenannahmen aus Studien und Szenarien gelten.',
    footExo:'Exogen:',footExoText:'Nachfrage, Wetter-/Ressourcenprofile, Kostenszenarien, Politiken',
    footEndo:'Endogen:',footEndoText:'Ausbaukapazitäten, Dispatch, Energieströme und EE-Anteil',
    footYear:'Ziel:',footYearText:'Kostenminimum ausschließlich für das Jahr 2060',
    backToSelection:'↑ Learning-by-Doing-Auswahl bearbeiten',
    selectedUnit:'ausgewählt'
  },
  en:{
    eyebrow:'MASTER’S THESIS · MODEL ARCHITECTURE · TARGET YEAR 2060',
    heading:'How do data, forecasting and optimisation fit together?',
    intro:'Data collected on the left either enter the optimiser directly as fixed inputs and constraints or first pass through forecasting. The optimiser finds the least-cost energy system for 2060. Learning-by-doing technologies selected above automatically appear in the forecasting block.',
    inputKicker:'01 · INPUT DATA',inputTitle:'Data foundation & exogenous assumptions',
    inputDesc:'Historical data and external constraints collected for Germany and Japan.',
    input1:'Historical electricity demand, load curves and sectoral demand drivers',
    input2:'Hourly weather series and wind/solar resource data',
    input3:'Technology parameters: CAPEX, OPEX, efficiency and lifetime',
    input4:'Land, network, storage and resource potentials',
    input5:'Policy targets, CO₂ limits and permitting constraints',
    input6:'Resilience, failure and hazard scenarios',
    inputNote:'Some data are used directly in the optimiser (e.g. technical constraints); others first become 2060 forecasts.',
    arrowForecast:'For forecasting',arrowDirect:'Direct input',
    forecastKicker:'02 · FORECASTING METHOD',forecastTitle:'Exogenous pathways for 2060',
    forecastDesc:'Forecasts and scenarios establish parameters before the optimisation run.',
    forecast1:'Electricity demand in 2060, including electrification and data centres',
    forecast2:'Resource availability and representative weather-year profiles',
    forecast3:'Technology costs in 2060: learning-by-doing for selected candidates',
    forecast4:'Exogenous policy and resilience scenario parameters',
    selectedTitle:'Selected for learning-by-doing forecast',selectedHint:'Tick or untick technologies in the table above. This selection updates immediately.',
    loading:'Loading selection …',empty:'No technologies selected for learning-by-doing',
    arrowDown:'Exogenous forecasts',arrowOutput:'Optimal system',
    optimizerKicker:'03 · GREENFIELD OPTIMISER',optimizerTitle:'Target-year 2060 optimisation',
    optimizerDesc:'The optimiser receives forecasts and other fixed inputs. It searches for the feasible technology mix with the lowest system cost in 2060.',
    opt1:'Endogenous: installed wind, PV, storage, converter and network capacity',
    opt2:'Endogenous: hourly dispatch, storage operation and energy flows',
    opt3:'Constraints: demand coverage, CO₂ limits, technical rules and resilience',
    opt4:'Objective: minimum annual system cost in 2060 (annualised investment and operating costs)',
    optimizerNote:'A technology marked red may still be considered by the optimiser. Red only means no dedicated learning-by-doing forecast is planned.',
    outputKicker:'04 · RESEARCH OUTPUT',outputTitle:'Least-cost energy system',
    resultPrimary:'Optimal renewable penetration rate in 2060',
    resultSubtitle:'Renewable electricity share of the least-cost feasible system under the selected assumptions',
    output1:'Minimum annual system cost in the target year 2060',
    output2:'Optimal generation, storage, conversion and capacity mix',
    output3:'Emissions, resilience and sensitivity results',
    output4:'Case-study comparison: Germany versus Japan',
    outputNote:'This objective does not minimise cumulative costs from today through 2060. Only the target-year system is evaluated.',
    principleLabel:'Methodological principle:',
    principle:'Ticking a technology for a learning-by-doing forecast means planning an exogenous cost pathway for 2060. The optimiser then decides independently whether and how much of that technology to install in the least-cost system. Excluded technologies can still receive cost assumptions from studies or scenarios.',
    footExo:'Exogenous:',footExoText:'Demand, resource profiles, cost scenarios and policies',
    footEndo:'Endogenous:',footEndoText:'Capacities, dispatch, energy flows and renewable share',
    footYear:'Objective:',footYearText:'Minimise costs for 2060 only',
    backToSelection:'↑ Edit the learning-by-doing selection',
    selectedUnit:'selected'
  }
};
const section=document.getElementById('model-logic');
if(!section)return;
function lang(){return window.AtlasI18n?.lang==='en'?'en':'de'}
function translate(){
  const copy=TRANSLATIONS[lang()];
  section.querySelectorAll('[data-model-text]').forEach(el=>{
    const k=el.getAttribute('data-model-text');
    if(Object.prototype.hasOwnProperty.call(copy,k))el.textContent=copy[k];
  });
  const flow=section.querySelector('.model-flow');
  if(flow)flow.setAttribute('aria-label',lang()==='en'?'Inputs feed the forecasting method or directly enter the optimiser; forecasts feed the optimiser, which produces the least-cost 2060 system.':'Inputdaten gehen in die Forecasting-Methode oder direkt in den Optimierer; Forecasts gehen in den Optimierer, aus dem das kostenminimale System 2060 hervorgeht.');
}
function renderSelected(entries){
  const list=section.querySelector('#model-selected-techs'),count=section.querySelector('#model-selected-count');
  if(!list||!count)return;
  const selected=(entries||[]).filter(x=>x.included);
  const copy=TRANSLATIONS[lang()];
  count.textContent=selected.length+' '+copy.selectedUnit;
  list.replaceChildren();
  if(!selected.length){
    const empty=document.createElement('span');
    empty.className='model-chip-empty';empty.textContent=copy.empty;list.appendChild(empty);return;
  }
  const dictionary=window.AtlasI18n?.learning||{};
  for(const item of selected){
    const chip=document.createElement('span');
    chip.className='model-chip';
    chip.textContent=lang()==='en'?(dictionary[item.name]?.[0]||item.displayName||item.name):item.name;
    chip.title=(lang()==='en'?'Priority ':'Priorität ')+(item.priority||'');
    list.appendChild(chip);
  }
}
function refresh(){
  translate();
  renderSelected(window.AtlasForecastState);
}
window.addEventListener('atlas:forecast-selection',event=>{window.AtlasForecastState=event.detail?.entries||[];renderSelected(window.AtlasForecastState)});
window.addEventListener('atlas:language',refresh);
refresh();
})();
