import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Edit2, Check, Download, Printer, Eye, X, RefreshCw, AlertTriangle, ChevronRight } from 'lucide-react';
import EsbirkaFormValidator from './EsbirkaFormValidator';

interface Template {
  id: string;
  title: string;
  category: 'petitions' | 'appeals' | 'complaints';
  desc: string;
  defaultText: string;
}

const FORM_TEMPLATES: Template[] = [
  {
    id: 'template-1',
    title: 'Návrh na svěření nezletilého do střídavé péče rodičů',
    category: 'petitions',
    desc: 'Základní vzor žaloby k opatrovnickému soudu o úpravu poměrů pro střídavou péči. Obsahuje doporučenou právní argumentaci a odkaz na nález Ústavního soudu.',
    defaultText: `Okresnímu soudu v [CITY]
[COURT_ADDRESS]

Žalobce (Otec): [FATHER_NAME], nar. [FATHER_BIRTH], bytem [FATHER_ADDRESS]
Žalovaná (Matka): [MOTHER_NAME], nar. [MOTHER_BIRTH], bytem [MOTHER_ADDRESS]

Nezletilé děti: [CHILDREN_NAMES]

NÁVRH OTCE NA ÚPRAVU PÉČE A SVĚŘENÍ NEZLETILÝCH DO STŘÍDAVÉ PÉČE RODIČŮ

I.
Rodiče nezletilých dětí uzavřeli manželství, které bylo rozvedeno / žili ve společné domácnosti. Z jejich vztahu se narodily nezletilé děti: [CHILDREN_NAMES]. Rodiče se po rozpadu vztahu nedohodli na dalším uspořádání péče o děti.

II.
Otec má plné rodičovské kompetence, doložitelnou materiální i psychologickou připravenost a zájem o rovnocenný podíl na výchově. Bytové podmínky otce jsou nadstandardní, děti mají k dispozici vlastní zařízené pokoje. Bydliště obou rodičů se nachází v rozumné vzdálenosti, což umožňuje bezproblémové pokračování školní docházky.

III.
V souladu s konstantní judikaturou Ústavního soudu ČR je střídavá péče prioritním modelem uspořádání, pokud jsou oba rodiče způsobilí. Svěření dětí pouze do výhradní péče jednoho z rodičů by znamenalo porušení ústavního práva dětí na péči obou rodičů.

Proto navrhuji, aby soud po provedeném dokazování vydal tento

R O Z S U D E K :

1. Nezletilé děti [CHILDREN_NAMES] se svěřují do střídavé péče obou rodičů, a to v pravidelném intervalu střídání po 7 dnech, s předáváním každé pondělí v 8:00 hod v prostorách školy/školky.
2. Výživné se stanovuje s přihlédnutím k poměrům obou rodičů.

V [CITY] dne [DATE]

........................................
[FATHER_NAME] (Otec)`
  },
  {
    id: 'template-2',
    title: 'Vyjádření otce k návrhu matky na výhradní péči',
    category: 'appeals',
    desc: 'Nesouhlasné stanovisko s výhradní péčí matky. Navrhuje střídavou péči jako jedinou ústavně konformní alternativu chránící zájem dítěte.',
    defaultText: `Okresnímu soudu v [CITY]
K sp. zn.: [CASE_NUMBER]

Žalobce (Otec): [FATHER_NAME], bytem [FATHER_ADDRESS]
Žalovaná (Matka): [MOTHER_NAME], bytem [MOTHER_ADDRESS]

VYJÁDŘENÍ OTCE K NÁVRHU MATKY NA SVĚŘENÍ DĚTÍ DO JEJÍ VÝHRADNÍ PÉČE

K výzvě soudu se tímto vyjadřuji k návrhu matky na svěření dětí do její výhradní péče. S návrhem matky zásadně nesouhlasím.

Vztah dětí k otci je velmi silný a vřelý. Otec se o děti aktivně staral od jejich narození a neexistuje žádný objektivní důvod, proč by měl být jeho kontakt s dětmi degradován na pouhý víkendový styk. Návrh matky považuji za účelovou snahu o vytěsnění otce ze života dětí.

Navrhuji proto, aby soud návrh matky zamítl a rozhodl o svěření nezletilých dětí [CHILDREN_NAMES] do střídavé péče obou rodičů.

V [CITY] dne [DATE]

........................................
[FATHER_NAME] (Otec)`
  },
  {
    id: 'template-3',
    title: 'Stížnost na neprofesionální postup kolizního opatrovníka (OSPOD)',
    category: 'complaints',
    desc: 'Formální stížnost vedoucímu odboru sociálních věcí na podjatost, ignorování důkazů nebo genderově stereotypní přístup sociální pracovnice.',
    defaultText: `Městskému úřadu v [CITY]
Vedoucímu odboru sociálně-právní ochrany dětí

Stěžovatel: [FATHER_NAME], bytem [FATHER_ADDRESS]
Spisová značka dítka: [CASE_NUMBER]

STÍŽNOST NA NEPROFESIONÁLNÍ A PODJATÝ POSTUP SOCIÁLNÍ PRACOVNICE [OFFICER_NAME]

Tímto podávám formální stížnost na postup jmenované sociální pracovnice, která vykonává funkci kolizního opatrovníka pro mé nezletilé děti: [CHILDREN_NAMES].

Důvody stížnosti:
1. Pracovnice vykazuje zjevnou podjatost vůči mé osobě, ignoruje předložené důkazy o mých rodičovských kompetencích a bezvýhradně přejímá neověřená tvrzení matky.
2. Při domácím šetření jednala nátlakově a činila na děti sugestivní dotazy s cílem získat negativní vyjádření o otci.
3. Odmítá zařadit mé vyjádření do spisové dokumentace.

Žádám o prověření postupu jmenované pracovnice, zjednání nápravy a případné přidělení spisu jinému nezávislému pracovníkovi OSPOD.

V [CITY] dne [DATE]

........................................
[FATHER_NAME]`
  }
];

export default function CentrumFormularu() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editorTemplate, setEditorTemplate] = useState<Template | null>(null);

  // Dynamic Form Compilation State
  const [inputs, setInputs] = useState({
    city: 'Praze',
    courtAddress: 'Okresní soud Praha-východ, Karlovo nám. 10, Praha',
    fatherName: 'Jiří Novák',
    fatherBirth: '15. 5. 1985',
    fatherAddress: 'U Lesa 14, Praha 9',
    motherName: 'Kateřina Nováková',
    motherBirth: '20. 8. 1988',
    motherAddress: 'Polní 5, Praha 9',
    childrenNames: 'Tomáš Novák (nar. 2018), Elen Nováková (nar. 2021)',
    caseNumber: '12 P 124/2026',
    officerName: 'Bc. Marie Krátká',
    date: new Date().toLocaleDateString('cs-CZ'),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const getCompiledText = (template: Template) => {
    let text = template.defaultText;
    text = text.replace(/\[CITY\]/g, inputs.city);
    text = text.replace(/\[COURT_ADDRESS\]/g, inputs.courtAddress);
    text = text.replace(/\[FATHER_NAME\]/g, inputs.fatherName);
    text = text.replace(/\[FATHER_BIRTH\]/g, inputs.fatherBirth);
    text = text.replace(/\[FATHER_ADDRESS\]/g, inputs.fatherAddress);
    text = text.replace(/\[MOTHER_NAME\]/g, inputs.motherName);
    text = text.replace(/\[MOTHER_BIRTH\]/g, inputs.motherBirth);
    text = text.replace(/\[MOTHER_ADDRESS\]/g, inputs.motherAddress);
    text = text.replace(/\[CHILDREN_NAMES\]/g, inputs.childrenNames);
    text = text.replace(/\[CASE_NUMBER\]/g, inputs.caseNumber);
    text = text.replace(/\[OFFICER_NAME\]/g, inputs.officerName);
    text = text.replace(/\[DATE\]/g, inputs.date);
    return text;
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = FORM_TEMPLATES.filter(tpl => {
    const matchesSearch = tpl.title.toLowerCase().includes(search.toLowerCase()) ||
                          tpl.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn" id="centrum-formularu-document-generator">
      
      {/* Forms Center Header */}
      <div className="bg-gradient-to-tr from-indigo-900 via-slate-905 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-indigo-500/20 print:hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/25 border border-teal-400/30 rounded-full text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold">
            <FileText className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Interaktivní generátor soudních podání
          </div>
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-tight">
            Centrum Formulářů & Vzorů
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Nekupujte drahé vzory. Vyberte si profesionální právní šablonu, vyplňte základní údaje ve formuláři a vygenerujte si bezvadné soudní podání nebo odvolání přímo na míru v reálném čase.
          </p>
        </div>
      </div>

      {/* Main Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Left List of Templates - Col span 4 */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono">
              Vyberte vzor podání
            </h3>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Vyhledat šablonu..."
                className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Buttons vertical stack */}
            <div className="flex flex-col gap-1 pt-1">
              {[
                { id: 'all', label: 'Všechny formuláře' },
                { id: 'petitions', label: 'Žaloby & Návrhy' },
                { id: 'appeals', label: 'Vyjádření & Odvolání' },
                { id: 'complaints', label: 'Stížnosti na úřady' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-50 text-indigo-800 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick list of matches */}
          <div className="space-y-2">
            {filtered.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setEditorTemplate(tpl)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex gap-3 ${
                  editorTemplate?.id === tpl.id
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${editorTemplate?.id === tpl.id ? 'text-teal-300' : 'text-indigo-500'}`} />
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs leading-snug">
                    {tpl.title}
                  </h4>
                  <p className={`text-[10px] leading-relaxed line-clamp-2 ${editorTemplate?.id === tpl.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {tpl.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Area: Interactive Editor & Preview Compiler - Col span 8 */}
        <div className="lg:col-span-8 print:col-span-12">
          {editorTemplate ? (
            <div className="space-y-6 print:space-y-0">
              
              {/* Compiler Controls (Hidden during print) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4 print:hidden">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase">Aktivní šablona:</span>
                    <h3 className="font-extrabold text-xs md:text-sm text-slate-800">
                      {editorTemplate.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> Vytisknout / PDF
                    </button>
                    <button
                      onClick={() => setEditorTemplate(null)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg"
                      title="Zavřít šablonu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Input Fields Generator based on template needs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Město podání:</label>
                    <input
                      type="text"
                      name="city"
                      value={inputs.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  {editorTemplate.category === 'petitions' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Adresa soudu:</label>
                      <input
                        type="text"
                        name="courtAddress"
                        value={inputs.courtAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Jméno otce:</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={inputs.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Adresa otce:</label>
                    <input
                      type="text"
                      name="fatherAddress"
                      value={inputs.fatherAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Jméno matky:</label>
                    <input
                      type="text"
                      name="motherName"
                      value={inputs.motherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Adresa matky:</label>
                    <input
                      type="text"
                      name="motherAddress"
                      value={inputs.motherAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Jména a data narození dětí:</label>
                    <input
                      type="text"
                      name="childrenNames"
                      value={inputs.childrenNames}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                    />
                  </div>

                  {editorTemplate.category !== 'petitions' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Spisová značka soudu:</label>
                      <input
                        type="text"
                        name="caseNumber"
                        value={inputs.caseNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                      />
                    </div>
                  )}

                  {editorTemplate.category === 'complaints' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Jméno pracovnice OSPOD:</label>
                      <input
                        type="text"
                        name="officerName"
                        value={inputs.officerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Live e-Sbírka Validation Bar */}
              <div className="print:hidden">
                <EsbirkaFormValidator
                  formId={editorTemplate.id}
                  formTitle={editorTemplate.title}
                  formData={{
                    ...inputs,
                    fullText: getCompiledText(editorTemplate)
                  }}
                />
              </div>

              {/* Dynamic Live Print Preview Paper (A4 size formatted) */}
              <div className="bg-white border-2 border-slate-300 p-8 md:p-12 shadow-md rounded-2xl font-serif max-w-2xl mx-auto text-slate-900 select-text leading-relaxed text-xs relative overflow-hidden print:border-0 print:p-0 print:shadow-none">
                
                {/* Simulated punch hole marker for office binder */}
                <div className="absolute left-3 top-1/2 w-3 h-3 border border-slate-200 rounded-full print:hidden" />
                <div className="absolute left-3 top-[30%] w-3 h-3 border border-slate-200 rounded-full print:hidden" />

                {/* Compiled Document Content */}
                <div className="whitespace-pre-wrap">
                  {getCompiledText(editorTemplate)}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 bg-white border border-slate-100 rounded-3xl">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4 animate-bounce" />
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                Žádný formulář není vybrán
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Chcete-li sestavit své podání nebo odvolání, vyberte si jednu z právních šablon v levém seznamu a ihned začněte upravovat její detaily.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
