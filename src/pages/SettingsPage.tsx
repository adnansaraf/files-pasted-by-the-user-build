import React from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Layers,
  Database,
  Radio,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData, division } = useApp();

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">SYSTEM CONFIGURATION & SCORING RULES</div>
          <h1 className="page-title">Settings & Engine Parameters</h1>
          <p className="page-subtitle">
            Configure multi-criteria optimization weights, departmental compatibility rules, and simulated integration feeds
          </p>
        </div>

        <button
          className="btn-danger-outline"
          onClick={() => {
            if (confirm('Reset all demo state to standard Palakkad Division values?')) {
              resetAllDemoData();
            }
          }}
        >
          <RotateCcw size={15} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <div className="settings-grid">
        {/* Card 1: Multi-Criteria Optimization Weight Configuration */}
        <div className="settings-card">
          <div className="card-header-icon">
            <Sliders size={20} className="text-maroon" />
            <div>
              <h3>Priority & Optimization Weight Configuration</h3>
              <p className="text-muted text-xs">
                Tune the multi-objective scoring engine weights (Prototype configurable rules)
              </p>
            </div>
          </div>

          <div className="weight-sliders-list">
            <div className="slider-item">
              <div className="slider-header-row">
                <label>Safety Risk & Track Defect Severity Weight</label>
                <strong>{settings.weightSafety}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={settings.weightSafety}
                onChange={e => updateSettings({ weightSafety: Number(e.target.value) })}
              />
              <small className="text-muted">High weighting prioritizes USFD rail fractures and bridge stability.</small>
            </div>

            <div className="slider-item">
              <div className="slider-header-row">
                <label>Asset Criticality & Section Density Weight</label>
                <strong>{settings.weightAssetCriticality}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={settings.weightAssetCriticality}
                onChange={e => updateSettings({ weightAssetCriticality: Number(e.target.value) })}
              />
              <small className="text-muted">Accounts for mainline vs loop line asset classification.</small>
            </div>

            <div className="slider-item">
              <div className="slider-header-row">
                <label>Operational Urgency & Target Deadline Weight</label>
                <strong>{settings.weightUrgency}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={settings.weightUrgency}
                onChange={e => updateSettings({ weightUrgency: Number(e.target.value) })}
              />
              <small className="text-muted">Prioritizes jobs approaching mandatory inspection cutoffs.</small>
            </div>

            <div className="slider-item">
              <div className="slider-header-row">
                <label>Train Punctuality Preservation Weight</label>
                <strong>{settings.weightTrainPunctuality}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={settings.weightTrainPunctuality}
                onChange={e => updateSettings({ weightTrainPunctuality: Number(e.target.value) })}
              />
              <small className="text-muted">Minimizes detention to Rajdhani, Vande Bharat, and Superfast express trains.</small>
            </div>
          </div>
        </div>

        {/* Card 2: Multi-Department Joint Possessions Compatibility Rules */}
        <div className="settings-card">
          <div className="card-header-icon">
            <Layers size={20} className="text-navy" />
            <div>
              <h3>Departmental Compatibility Matrix</h3>
              <p className="text-muted text-xs">
                Defines which maintenance activities can be safely bundled into a single corridor possession
              </p>
            </div>
          </div>

          <div className="rules-toggle-list">
            <div className="rule-toggle-item">
              <div>
                <strong>Engineering (Tamping) + TRD (OHE De-energization)</strong>
                <p className="text-xs text-muted">
                  Allow tamping machines under isolated 25kV catenary with grounding rods attached.
                </p>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.allowSimultaneousTrackAndOHE}
                  onChange={e => updateSettings({ allowSimultaneousTrackAndOHE: e.target.checked })}
                />
                <span className="slider-round" />
              </label>
            </div>

            <div className="rule-toggle-item">
              <div>
                <strong>Engineering (Track Renewal) + S&T (Point / Relays)</strong>
                <p className="text-xs text-muted">
                  Allow point machine overhaul co-terminus with turnout packing and tamping.
                </p>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.allowSimultaneousTrackAndSignalling}
                  onChange={e => updateSettings({ allowSimultaneousTrackAndSignalling: e.target.checked })}
                />
                <span className="slider-round" />
              </label>
            </div>

            <div className="rule-toggle-item">
              <div>
                <strong>Minimum Operational Headway Buffer</strong>
                <p className="text-xs text-muted">
                  Safety separation time between block clearance and first approaching train.
                </p>
              </div>
              <select
                className="select-compact"
                value={settings.minHeadwayMinutes}
                onChange={e => updateSettings({ minHeadwayMinutes: Number(e.target.value) })}
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes (Standard IR Rule)</option>
                <option value={20}>20 Minutes (Monsoon Caution)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Simulated Data Integration Layer */}
        <div className="settings-card full-span">
          <div className="card-header-icon">
            <Database size={20} className="text-success" />
            <div>
              <h3>Simulated Data Integration Layer (CRIS Information Systems Architecture)</h3>
              <p className="text-muted text-xs">
                SolveX operates as an intelligent decision-support layer above existing railway systems
              </p>
            </div>
          </div>

          <div className="integration-systems-grid">
            <div className="system-status-box">
              <div className="sys-top">
                <strong>TMS</strong>
                <span className="badge-online">CONNECTED</span>
              </div>
              <div className="sys-name">Track Management System</div>
              <small className="text-muted">Feed: Track geometry recordings & USFD rail flaw reports</small>
            </div>

            <div className="system-status-box">
              <div className="sys-top">
                <strong>COA</strong>
                <span className="badge-online">CONNECTED</span>
              </div>
              <div className="sys-name">Control Office Application</div>
              <small className="text-muted">Feed: Real-time train positions, delays, & timetable headway</small>
            </div>

            <div className="system-status-box">
              <div className="sys-top">
                <strong>SMMS</strong>
                <span className="badge-online">CONNECTED</span>
              </div>
              <div className="sys-name">Signalling Maintenance System</div>
              <small className="text-muted">Feed: Relay room logs, axle counter health, & point testing</small>
            </div>

            <div className="system-status-box">
              <div className="sys-top">
                <strong>TDMS</strong>
                <span className="badge-online">CONNECTED</span>
              </div>
              <div className="sys-name">Traction Distribution System</div>
              <small className="text-muted">Feed: 25kV OHE catenary condition, tower wagons & TSS feeds</small>
            </div>

            <div className="system-status-box">
              <div className="sys-top">
                <strong>RBPMS</strong>
                <span className="badge-online">CONNECTED</span>
              </div>
              <div className="sys-name">Rolling Stock & Block Planning</div>
              <small className="text-muted">Feed: Track machine availability (Duomatic, BCM, CSM rakes)</small>
            </div>
          </div>

          <div className="integration-footer-note">
            <Info size={15} className="text-muted flex-shrink-0" />
            <span>
              <strong>Note on System Boundary:</strong> For this SIH 2026 prototype, all telemetry and external data
              are simulated via realistic operational feeds reflecting Palakkad Division (PGT) Southern Railway operations.
              The architecture is structured with standard adapters to support live API integration in future development.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
