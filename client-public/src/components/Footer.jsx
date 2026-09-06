import React, { useState, useEffect } from 'react';
import { Anchor, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer({ navigate }) {
  const [company, setCompany] = useState({
    address: 'Port Road, Colombo 01, Sri Lanka',
    phone: '+94 11 258 4930 / +94 77 123 4567',
    email: 'export@accio-ceylon.com',
    tagline: 'Colombo’s premier exporter of solar & low-temperature precision dehydrated tropical fruits, authentic spices, and Ayurvedic botanical infusions.'
  });

  useEffect(() => {
    fetch('/api/company')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setCompany({
            address: data.settings.address || 'Port Road, Colombo 01, Sri Lanka',
            phone: data.settings.phone ? `${data.settings.phone} / ${data.settings.whatsapp}` : '+94 11 258 4930 / +94 77 123 4567',
            email: data.settings.email || 'export@accio-ceylon.com',
            tagline: data.settings.tagline || 'Colombo’s premier exporter of solar & low-temperature precision dehydrated tropical fruits, authentic spices, and Ayurvedic botanical infusions.'
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', marginTop: '5rem', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Col 1: Brand & Colombo HQ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 6 C8 10 7 15 12 18 C17 15 16 10 12 6 Z" fill="#FDFBF7" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800 }}>ACCIO EXPORT</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {company.tagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--primary)" />
                <span>{company.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--primary)" />
                <span>{company.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--primary)" />
                <span>{company.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Export Products */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Export Catalog</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><a href="#mango" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ transition: 'color 0.2s' }}>Ceylon Dehydrated Mango Slices</a></li>
              <li><a href="#beli" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Dehydrated Beli (Bael) Fruit</a></li>
              <li><a href="#pineapple" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Mauritius Pineapple Flower Rings</a></li>
              <li><a href="#jackfruit" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Waraka Ripe Jackfruit Crisps</a></li>
              <li><a href="#cinnamon" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Pure Ceylon Cinnamon Alba Grade</a></li>
              <li><a href="#moringa" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Organic Moringa Leaf Infusion</a></li>
            </ul>
          </div>

          {/* Col 3: Export Logistics & Ports */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Logistics & Incoterms</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Anchor size={14} color="#047857" /> <span>FOB Port of Colombo</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="#047857" /> <span>CIF Rotterdam & London Gateway</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="#047857" /> <span>CIF Jebel Ali (Dubai) & Singapore</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="#047857" /> <span>Air Cargo via Colombo BIA (CMB)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={14} color="#D97706" /> <span>Phytosanitary & Lab COA Issued</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Export Standards */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Export Standards</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="badge badge-green">100% Pure Ceylon</span>
              <span className="badge badge-green">Sub-48°C Dehydrated</span>
              <span className="badge badge-amber">Zero Added Sugar</span>
              <span className="badge badge-green">Zero Preservatives</span>
              <span className="badge badge-amber">Direct Farm Sourced</span>
              <span className="badge badge-green">Export Grade A</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Registered with the Sri Lanka Export Development Board (EDB) & Department of Agriculture.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} Accio Ceylon (Pvt) Ltd. All Rights Reserved. Exporting Pure Ceylon Goodness Globally.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Export Terms & Conditions</a>
            <a href="#lab" onClick={(e) => e.preventDefault()}>Lab Specifications</a>
            <a href="#customs" onClick={(e) => e.preventDefault()}>Customs & HS Codes</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
