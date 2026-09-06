import React from 'react';
import { Anchor, Ship, Globe, ShieldCheck, Clock, ArrowRight, PackageCheck, FileText } from 'lucide-react';

export default function PortExportPage({ navigate }) {
  const routes = [
    { destination: 'London Gateway (GB LGP)', country: 'United Kingdom', transit: '14 - 16 Days', carrier: 'MSC / CMA CGM', type: 'FCL & LCL' },
    { destination: 'Hamburg Port (DE HAM)', country: 'Germany', transit: '16 - 18 Days', carrier: 'Hapag-Lloyd', type: 'FCL & LCL' },
    { destination: 'Rotterdam (NL RTM)', country: 'Netherlands', transit: '15 - 17 Days', carrier: 'Maersk Line', type: 'FCL & LCL' },
    { destination: 'Jebel Ali (AE JEA)', country: 'United Arab Emirates', transit: '4 - 5 Days', carrier: 'ONE / Feeder', type: 'FCL & LCL' },
    { destination: 'Port Botany, Sydney (AU SYD)', country: 'Australia', transit: '12 - 14 Days', carrier: 'MSC Oceania', type: 'FCL & LCL' },
    { destination: 'Port of Los Angeles (US LAX)', country: 'United States', transit: '22 - 24 Days', carrier: 'CMA CGM Express', type: 'FCL & Air' },
    { destination: 'Yokohama Port (JP YOK)', country: 'Japan', transit: '11 - 13 Days', carrier: 'Ocean Network Express', type: 'FCL' }
  ];

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Indian Ocean Maritime Gateway</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            Port of Colombo Export Logistics & Incoterms
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Strategically positioned on the primary East-West shipping line, offering swift transit times, weekly container feeder connections, and full export documentation.
          </p>
        </div>

        {/* Global Transit Table */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '4rem', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ship size={20} color="var(--primary)" /> Scheduled Ocean Transit Times from Port of Colombo (LK CMB)
            </h3>
            <span className="badge badge-green">Weekly Direct Sailings</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Destination Port</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Country</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Average Ocean Transit</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Primary Carriers</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Service Type</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{r.destination}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{r.country}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#047857' }}>{r.transit}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{r.carrier}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>{r.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoterms & Export Packaging Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Standard Incoterms Offered
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>FOB Colombo (Recommended):</strong> Seller covers packing, inland transit, Colombo port loading, and Sri Lanka customs clearance.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>CIF Destination Port:</strong> Accio arranges ocean freight & marine insurance up to the buyer’s discharge port.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>DDP Air Courier (Samples):</strong> Door-to-door delivery via DHL Express with all import duties prepaid for swift sample evaluation.
              </li>
            </ul>
          </div>

          <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PackageCheck size={20} color="#047857" /> Export Palletization Standards
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              All shipments utilize ISPM-15 heat-treated export wood pallets or heavy-duty plastic slip sheets, wrapped in UV-resistant stretch film with food-grade silica gel desiccants.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green">ISPM-15 Heat Treated</span>
              <span className="badge badge-amber">Desiccant Moisture Control</span>
              <span className="badge badge-green">Nitrogen Flushing Option</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
