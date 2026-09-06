import React from 'react';
import { ShieldCheck, Sun, Award, Users, CheckCircle2, Factory, Leaf, ArrowRight } from 'lucide-react';

export default function FactoryStoryPage({ navigate }) {
  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Behind the Harvest</span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '1rem' }}>
            Our Colombo Dehydration Facility & Farmer Cooperatives
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Bridging pristine Sri Lankan smallholder agriculture with advanced German-engineered low-temperature solar dehydration technology.
          </p>
        </div>

        {/* Section 1: Facility & Technology */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Pioneering Facility</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Precision Low-Temperature Dehydration Under 48°C
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Located just 12 kilometers from the deep-water terminals of Colombo Harbor, our facility operates closed-loop dehumidifying drying chambers. Unlike conventional methods that bake fruits at 65°C-75°C, our sub-48°C airflow preserves natural enzymatic activity, vivid natural carotenoid coloration, and tropical scent.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#047857" />
                <span>HEPA Class 10,000 cleanroom packaging line</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#047857" />
                <span>Water Activity monitoring (aw &lt; 0.60 aw)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#047857" />
                <span>Zero added sulfur dioxide (SO2), sweeteners, or artificial colors</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
              alt="Accio Colombo Dehydration Plant"
              style={{ width: '100%', height: '380px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Section 2: Direct Farmer Cooperatives */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
              alt="Sri Lankan Smallholder Agro-Forestry"
              style={{ width: '100%', height: '380px', objectFit: 'cover' }}
            />
          </div>

          <div>
            <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Fair-Trade Sourcing</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Direct Partnerships with 320+ Sri Lankan Farmers
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Our Willard mangoes and Beli fruits are sourced directly from multigenerational farmer cooperatives in Kurunegala, Anuradhapura, and Matale. By cutting out speculative middlemen, we pay our growers 35% above market farmgate rates while implementing strict non-GMO and pesticide-free organic practices.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>320+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Partnered Farm Families</div>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Traceable to Agro-Zone</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Natural Quality & Processing Standards */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.75rem' }}>Authentic Natural Quality</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Pure Ceylon Goodness Ready for Global Markets
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 2rem' }}>
            Our export consignments are crafted with absolute purity — natural harvest, zero chemical preservatives, sub-48°C dehydration, and airtight export barrier packaging.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>100% Pure Ceylon Sourced</span>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Sub-48°C Nutrient-Preserved Dehydration</span>
            <span className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Zero Added Sugar & Preservative Free</span>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>EDB Export Compliant</span>
            <span className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Direct Farm Traceability</span>
          </div>
        </div>
      </div>
    </div>
  );
}
