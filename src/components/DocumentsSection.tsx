/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Copy, 
  Search, 
  Sparkles, 
  Check, 
  FileSignature, 
  RotateCcw, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { DocumentTemplate } from '../types';
import { INITIAL_DOCUMENTS } from '../mockData';
import AiGuideModal from './AiGuideModal';

interface DocumentsSectionProps {
  searchQuery: string;
}

export default function DocumentsSection({ searchQuery: globalSearchQuery }: DocumentsSectionProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentTemplate | null>(INITIAL_DOCUMENTS[0]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Initialize form with placeholder values when document changes
  React.useEffect(() => {
    if (selectedDoc) {
      const initialForm: Record<string, string> = {};
      selectedDoc.formFields.forEach(field => {
        initialForm[field.name] = '';
      });
      setFormData(initialForm);
      setCopied(false);
      setDownloaded(false);
    }
  }, [selectedDoc]);

  // Combine global search from navigation and local search
  const effectiveQuery = globalSearchQuery || localSearch;

  const filteredDocs = useMemo(() => {
    return INITIAL_DOCUMENTS.filter(doc => {
      const q = effectiveQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      );
    });
  }, [effectiveQuery]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Generate the live document text by replacing placeholders
  const generatedDocumentText = useMemo(() => {
    if (!selectedDoc) return '';
    let text = selectedDoc.fileContent;
    
    // Replace standard template mappings based on filled values
    selectedDoc.formFields.forEach(field => {
      const value = formData[field.name] || `[${field.placeholder}]`;
      
      // We map the user input fields directly into the matching template brackets
      if (field.name === 'sud') {
        text = text.replace(/\[Město soudu\]/g, value);
        text = text.replace(/\[Okresní soud\]/g, value);
      } else if (field.name === 'matka_jmeno') {
        text = text.replace(/\[Jméno a příjmení matky\]/g, value);
        text = text.replace(/\[Jméno matky\]/g, value);
      } else if (field.name === 'matka_narozeni') {
        text = text.replace(/\[Datum narození matky\]/g, value);
      } else if (field.name === 'matka_adresa') {
        text = text.replace(/\[Adresa matky\]/g, value);
      } else if (field.name === 'otec_jmeno') {
        text = text.replace(/\[Jméno a příjmení otce\]/g, value);
        text = text.replace(/\[Jméno otce\]/g, value);
      } else if (field.name === 'otec_narozeni') {
        text = text.replace(/\[Datum narození otce\]/g, value);
      } else if (field.name === 'otec_adresa') {
        text = text.replace(/\[Adresa otce\]/g, value);
      } else if (field.name === 'dite_jmeno') {
        text = text.replace(/\[Jméno a příjmení dítěte\]/g, value);
        text = text.replace(/\[Jméno dítěte\]/g, value);
      } else if (field.name === 'dite_narozeni') {
        text = text.replace(/\[Datum narození dítěte\]/g, value);
      } else if (field.name === 'typ_pece' || field.name === 'navrhovana_pece') {
        text = text.replace(/\[Typ péče - např\. střídavé péče obou rodičů\]/g, value);
        text = text.replace(/\[Typ péče\]/g, value);
        text = text.replace(/\[Navrhovaný typ péče\]/g, value);
      } else if (field.name === 'vyzivne_otec') {
        text = text.replace(/\[Výživné otec\]/g, value);
      } else if (field.name === 'vyzivne_matka') {
        text = text.replace(/\[Výživné matka\]/g, value);
      } else if (field.name === 'navrhovatel_jmeno') {
        text = text.replace(/\[Jméno navrhovatele\]/g, value);
      } else if (field.name === 'navrhovatel_narozeni') {
        text = text.replace(/\[Datum narození navrhovatele\]/g, value);
      } else if (field.name === 'navrhovatel_adresa') {
        text = text.replace(/\[Adresa navrhovatele\]/g, value);
      } else if (field.name === 'odpovedny_jmeno') {
        text = text.replace(/\[Jméno druhého rodiče\]/g, value);
      } else if (field.name === 'odpovedny_narozeni') {
        text = text.replace(/\[Datum nar\. druhého rodiče\]/g, value);
      } else if (field.name === 'odpovedny_adresa') {
        text = text.replace(/\[Adresa druhého rodiče\]/g, value);
      }
    });

    // Replace static general items like date
    const today = new Date().toLocaleDateString('cs-CZ');
    text = text.replace(/\[Dnešní datum\]/g, today);
    text = text.replace(/\[Datum dohody\]/g, today);
    text = text.replace(/\[Město\]/g, formData['sud']?.replace('Okresní soud v ', '') || 'Město');

    return text;
  }, [selectedDoc, formData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocumentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDocumentText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedDoc?.title || 'dokument'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleResetForm = () => {
    if (selectedDoc) {
      const initialForm: Record<string, string> = {};
      selectedDoc.formFields.forEach(field => {
        initialForm[field.name] = '';
      });
      setFormData(initialForm);
    }
  };

  return (
    <div className="space-y-8" id="documents-section-container">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Interaktivní Generátor</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Právní vzory a generátor dokumentů</h2>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="doc-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Hledat ve vzorech..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Vyberte si ze schválených vzorů podání. Vyplňte formulář vlevo a vpravo uvidíte živý náhled hotového dokumentu k soudu. Můžete jej přímo zkopírovat nebo stáhnout jako textový soubor připravený pro Word či tisk.
        </p>

        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="font-bold text-xs text-slate-800 font-display">Chcete stažený dokument dokonale přizpůsobit pomocí AI?</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Využijte nástroje jako <strong>NotebookLM</strong> jako svůj právní mozek. Ukážeme vám, jak psát neprůstřelná zadání (prompty) a vyhnout se nebezpečným chybám.
              </p>
            </div>
          </div>
          <button
            onClick={() => setGuideOpen(true)}
            className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-3xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Jak na to s AI (NotebookLM)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Template list and Fill Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* List of Templates */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3 pl-1">Dostupné vzory dokumentů:</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id="template-list-scroll">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">Žádné šablony neodpovídají vyhledávání.</div>
              ) : (
                filteredDocs.map((doc) => (
                  <button
                    id={`doc-template-select-${doc.id}`}
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      selectedDoc?.id === doc.id
                        ? 'bg-teal-50/50 border-teal-300 text-teal-900 shadow-2xs'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                    }`}
                  >
                    <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${selectedDoc?.id === doc.id ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="font-bold text-xs leading-tight">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs truncate">{doc.description}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Form to fill values */}
          {selectedDoc && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4" id="document-generator-form-card">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-800 font-display">Údaje pro generování</h3>
                </div>
                <button
                  id="doc-form-reset"
                  onClick={handleResetForm}
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[10px] font-medium transition-colors"
                  title="Vymazat hodnoty"
                >
                  <RotateCcw className="w-3 h-3" />
                  Resetovat
                </button>
              </div>

              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {selectedDoc.formFields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">{field.label}</label>
                    <input
                      id={`doc-input-${field.name}`}
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-[10px] text-slate-500 leading-relaxed">
                  Zadané údaje jsou zpracovávány výhradně lokálně ve vašem prohlížeči a nikam se neodesílají. Vaše soukromí je 100% chráněno.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Realtime document paper preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden" id="document-preview-card">
              
              {/* Preview Action Header */}
              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">Náhled a akce</span>
                  <h3 className="font-bold text-xs text-slate-700 mt-1 truncate max-w-[250px] md:max-w-md">{selectedDoc.title}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    id="doc-action-copy"
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      copied 
                        ? 'bg-teal-50 border-teal-300 text-teal-700' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Zkopírováno' : 'Kopírovat'}
                  </button>
                  <button
                    id="doc-action-download"
                    onClick={handleDownload}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {downloaded ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" /> : <Download className="w-3.5 h-3.5 text-teal-300" />}
                    {downloaded ? 'Staženo' : 'Stáhnout vzor'}
                  </button>
                </div>
              </div>

              {/* Paper Document Layout */}
              <div className="p-6 md:p-8 bg-slate-100/50 flex-1 overflow-y-auto max-h-[500px]">
                <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6 md:p-10 min-h-[600px] font-mono text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap select-text selection:bg-teal-100" id="generated-document-paper-output">
                  {generatedDocumentText}
                </div>
              </div>

              {/* Footer status */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Po stažení otevřete v textovém editoru (MS Word, LibreOffice) a upravte detaily dle své potřeby.
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 shadow-2xs flex-1 flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm">Vyberte šablonu z levého menu pro spuštění generátoru.</p>
            </div>
          )}
        </div>

      </div>

      <AiGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

    </div>
  );
}
