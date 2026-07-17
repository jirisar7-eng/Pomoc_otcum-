/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  MapPin, 
  Mail, 
  Globe, 
  Star, 
  Filter, 
  Clock, 
  Send, 
  CheckCircle2, 
  Scale, 
  Search 
} from 'lucide-react';
import { SupportContact } from '../types';
import { INITIAL_CONTACTS } from '../initialState';

interface ContactsSectionProps {
  searchQuery: string;
}

export default function ContactsSection({ searchQuery: globalSearchQuery }: ContactsSectionProps) {
  const [selectedType, setSelectedType] = useState<string>('Vše');
  const [localSearch, setLocalSearch] = useState('');
  const [bookingContact, setBookingContact] = useState<SupportContact | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form states for consultation booking
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [formError, setFormError] = useState('');

  const filterQuery = globalSearchQuery || localSearch;

  const filteredContacts = useMemo(() => {
    return INITIAL_CONTACTS.filter(contact => {
      // Type matching
      if (selectedType !== 'Vše' && contact.type !== selectedType) {
        return false;
      }
      // Query matching
      const q = filterQuery.toLowerCase();
      if (q) {
        return (
          contact.name.toLowerCase().includes(q) ||
          contact.city.toLowerCase().includes(q) ||
          contact.region.toLowerCase().includes(q) ||
          contact.description.toLowerCase().includes(q) ||
          contact.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedType, filterQuery]);

  const handleOpenBooking = (contact: SupportContact) => {
    setBookingContact(contact);
    setBookingSuccess(false);
    setFormError('');
  };

  const handleCloseBooking = () => {
    setBookingContact(null);
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setBookingNote('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!parentName.trim() || !parentPhone.trim() || !parentEmail.trim()) {
      setFormError('Prosím vyplňte všechna povinná pole.');
      return;
    }

    // Simulate successful request queue
    setBookingSuccess(true);
    setTimeout(() => {
      handleCloseBooking();
      alert('Požadavek na bezplatnou nezávaznou konzultaci byl odeslán vybranému odborníkovi.');
    }, 1500);
  };

  return (
    <div className="space-y-8" id="contacts-section-container">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Databáze pomoci</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Kontakty na odbornou pomoc</h2>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="contacts-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Vyhledat město, jméno, firmu..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Složité rodinné spory málokdy vyřešíte sami. Níže naleznete prověřené kontakty na rodinné advokáty, certifikované mediátory, dětské psychoterapie a neziskové organizace podporující rodiny. Všichni tito specialisté sdílejí náš princip: <strong>prioritou je zájem dítěte</strong>.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4" id="contacts-filter-tabs">
        {['Vše', 'právník', 'mediátor', 'psycholog', 'organizace'].map((type) => (
          <button
            id={`filter-contact-type-${type}`}
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all cursor-pointer ${
              selectedType === type
                ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            {type === 'Vše' ? 'Všechny profese' : type + 'i'}
          </button>
        ))}
      </div>

      {/* Booking Consultation Modal Drawer */}
      {bookingContact && (
        <div id="booking-modal-overlay" className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-md w-full shadow-xl space-y-4 relative">
            <button
              onClick={handleCloseBooking}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              ×
            </button>
            
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Clock className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Poptat nezávaznou konzultaci</h3>
                <span className="text-[10px] text-slate-400 block -mt-0.5">{bookingContact.name}</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-3" id="booking-success-state">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Požadavek bezpečně zaznamenán</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Specialistovi byl odeslán e-mail s vašimi kontaktními údaji. Ozve se vám v nejbližším možném termínu (zpravidla do 24 hodin).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-3" id="booking-form">
                {formError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg">
                    {formError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Vaše jméno a příjmení</label>
                  <input
                    id="booking-input-name"
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Např. Mgr. Jana Nováková"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Telefonní číslo</label>
                    <input
                      id="booking-input-phone"
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+420 777 123 456"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">E-mailová adresa</label>
                    <input
                      id="booking-input-email"
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="jana.novakova@email.cz"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Poznámka pro specialistu (stručný popis problému)</label>
                  <textarea
                    id="booking-input-note"
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="Např. Potřebuji zkonzultovat dohodu o střídavé péči..."
                    rows={3}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="w-1/2 py-2 text-slate-500 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Zrušit
                  </button>
                  <button
                    id="booking-submit-btn"
                    type="submit"
                    className="w-1/2 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-teal-200" />
                    Odeslat poptávku
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Grid of Specialists cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" id="contacts-cards-grid">
        {filteredContacts.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs italic">
            Žádní specialisté neodpovídají zadaným kritériím vyhledávání.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-100 hover:shadow-sm transition-all flex flex-col justify-between" id={`contact-card-${contact.id}`}>
              <div className="space-y-3">
                
                {/* Specialty tag & rating */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                    contact.type === 'právník' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/35' :
                    contact.type === 'mediátor' ? 'bg-teal-50 text-teal-700 border border-teal-100/35' :
                    contact.type === 'psycholog' ? 'bg-amber-50 text-amber-700 border border-amber-100/35' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-100/35'
                  }`}>
                    {contact.type}
                  </span>
                  
                  <div className="flex items-center gap-1 bg-amber-50/50 border border-amber-100 px-2 py-0.5 rounded-lg text-amber-700 font-mono text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{contact.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Name & description */}
                <div>
                  <h3 className="font-bold text-slate-800 text-sm font-display">{contact.name}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{contact.description}</p>
                </div>

                {/* Details layout */}
                <div className="space-y-1.5 pt-2 font-mono text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{contact.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{contact.website}</span>
                  </div>
                </div>

              </div>

              {/* Consultation trigger CTA */}
              <div className="border-t border-slate-50 pt-4 mt-5">
                <button
                  id={`consultation-request-${contact.id}`}
                  onClick={() => handleOpenBooking(contact)}
                  className="w-full py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Požádat o nezávazný kontakt
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
