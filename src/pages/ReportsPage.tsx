import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Clock,
  Wrench,
  Shield,
  Info,
  Download,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">OPERATIONAL INTELLIGENCE REPORTS</div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">
            Quantitative benchmarks comparing conventional uncoordinated scheduling versus SolveX AI optimization
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => alert('Exporting Official Divisional Maintenance Report (PDF/Excel)...')}
        >
          <Download size={15} />
          <span>Export Divisional Report</span>
        </button>
      </div>

      {/* Hero Benchmark: Before vs After Optimization */}
      <div className="reports-hero-card">
        <div className="reports-hero-header">
          <div>
            <span className="badge-comparison">CORRIDOR PERFORMANCE BENCHMARK</span>
            <h2>Conventional Manual Planning vs SolveX Optimized Coordination</h2>
            <p className="text-muted text-sm">
              Simulated weekly aggregate for Palakkad Division (PGT–OTP–SRR–TIR–CLT mainlines)
            </p>
          </div>
        </div>

        <div className="impact-table-wrapper">
          <table className="impact-table">
            <thead>
              <tr>
                <th>Operational Metric</th>
                <th>Conventional Manual Planning</th>
                <th>SolveX AI Optimized Plan</th>
                <th>Net Efficiency Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Total Track Block Hours Imposed</strong></td>
                <td><span className="val-bad">18.5 Hours</span></td>
                <td><span className="val-good">13.0 Hours</span></td>
                <td><strong className="text-success">↓ 5.5 Hours Saved (-29.7%)</strong></td>
              </tr>
              <tr>
                <td><strong>Maintenance Jobs Completed</strong></td>
                <td><span className="val-bad">16 Jobs</span></td>
                <td><span className="val-good">21 Jobs</span></td>
                <td><strong className="text-success">↑ +5 Jobs (+31.2% Throughput)</strong></td>
              </tr>
              <tr>
                <td><strong>Train Path Conflicts Encountered</strong></td>
                <td><span className="val-bad">11 Conflicts</span></td>
                <td><span className="val-good">4 Conflicts</span></td>
                <td><strong className="text-success">↓ 7 Conflicts Resolved (-63.6%)</strong></td>
              </tr>
              <tr>
                <td><strong>Estimated Train Detention / Delays</strong></td>
                <td><span className="val-bad">68 Minutes</span></td>
                <td><span className="val-good">31 Minutes</span></td>
                <td><strong className="text-success">↓ 37 Min Saved (-54.4%)</strong></td>
              </tr>
              <tr>
                <td><strong>Overall Section Asset Availability</strong></td>
                <td><span className="val-bad">88.2%</span></td>
                <td><span className="val-good">92.4%</span></td>
                <td><strong className="text-success">↑ +4.2% Availability</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Analytics Visual Cards */}
      <div className="dashboard-grid-two">
        {/* Chart 1: Conflicts Before vs After */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Conflicts Before vs After Optimization</h4>
            <span className="text-xs text-muted">Weekly incident count</span>
          </div>

          <div className="chart-bars-container">
            <div className="bar-group">
              <div className="bar-column bg-danger" style={{ height: '170px' }}>
                <span className="bar-val">11</span>
              </div>
              <span className="bar-lbl">Conventional (Manual)</span>
            </div>

            <div className="bar-group">
              <div className="bar-column bg-success" style={{ height: '62px' }}>
                <span className="bar-val">4</span>
              </div>
              <span className="bar-lbl">SolveX AI Optimized</span>
            </div>
          </div>
          <div className="text-center text-xs text-muted mt-2">
            63.6% reduction in operational train overlaps achieved via multi-department coordination
          </div>
        </div>

        {/* Chart 2: Block Utilization by Department */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Block Time Utilization by Department</h4>
            <span className="text-xs text-muted">Possession hour efficiency</span>
          </div>

          <div className="donut-chart-box">
            <div className="donut-visual">
              <div className="donut-center">
                <strong>74%</strong>
                <small>Average</small>
              </div>
            </div>

            <div className="chart-legend-list">
              <div className="legend-row">
                <span className="color-box bg-maroon" />
                <span>Engineering (P-Way): <strong>82%</strong></span>
              </div>
              <div className="legend-row">
                <span className="color-box bg-amber" />
                <span>TRD (Traction OHE): <strong>71%</strong></span>
              </div>
              <div className="legend-row">
                <span className="color-box bg-blue" />
                <span>S&T (Signalling): <strong>65%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Planned vs Actual Duration Overrun Variance */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Planned vs Actual Execution Variance (Histograms)</h4>
            <span className="text-xs text-muted">Historical sample jobs</span>
          </div>

          <div className="variance-hist-list">
            <div className="hist-item">
              <div className="hist-labels">
                <span>Track Deep Tamping (BCM / 09-3X)</span>
                <strong>Avg +24 min (+13%)</strong>
              </div>
              <div className="hist-track">
                <div className="hist-bar bg-warning" style={{ width: '63%' }} />
              </div>
            </div>

            <div className="hist-item">
              <div className="hist-labels">
                <span>OHE Tower Wagon Catenary Overhaul</span>
                <strong>Avg +12 min (+9%)</strong>
              </div>
              <div className="hist-track">
                <div className="hist-bar bg-info" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="hist-item">
              <div className="hist-labels">
                <span>Thermit Rail Weld Renewal</span>
                <strong>Avg +18 min (+12%)</strong>
              </div>
              <div className="hist-track">
                <div className="hist-bar bg-warning" style={{ width: '55%' }} />
              </div>
            </div>

            <div className="hist-item">
              <div className="hist-labels">
                <span>Axle Counter / Interlocking Calibration</span>
                <strong className="text-success">Avg +4 min (+4%)</strong>
              </div>
              <div className="hist-track">
                <div className="hist-bar bg-success" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Asset Availability 30-Day Trend */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Sectional Asset Availability 30-Day Trend</h4>
            <span className="text-xs text-muted">Palakkad Division trunk</span>
          </div>

          <div className="trend-svg-box">
            <svg viewBox="0 0 400 130" className="trend-svg">
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                points="10,95 60,88 120,92 180,75 240,78 300,55 360,40 390,32"
              />
              {/* Dots */}
              {[[10,95],[60,88],[120,92],[180,75],[240,78],[300,55],[360,40],[390,32]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              ))}
              <text x="10" y="115" fill="#64748b" fontSize="10">Day 1 (88%)</text>
              <text x="200" y="115" fill="#64748b" fontSize="10">Day 15 (90%)</text>
              <text x="360" y="115" fill="#047857" fontSize="10" fontWeight="bold">Day 30 (92.4%)</text>
            </svg>
          </div>
          <div className="text-center text-xs text-muted mt-1">
            Upward availability trend driven by coordinated bundling of TRD and Engineering track possessions
          </div>
        </div>
      </div>
    </div>
  );
};
