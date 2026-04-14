import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api";

// --- Design Tokens ---
const theme = {
  bg: "#0F1117",
  surface: "#1A1D27",
  surfaceAlt: "#232733",
  border: "#2E3345",
  borderLight: "#3A3F52",
  text: "#E8EAF0",
  textMuted: "#8B90A0",
  textDim: "#5C6178",
  accent: "#6C8EEF",
  accentDim: "rgba(108,142,239,0.12)",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.12)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.12)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.12)",
  purple: "#A78BFA",
  purpleDim: "rgba(167,139,250,0.12)",
  cyan: "#22D3EE",
  cyanDim: "rgba(34,211,238,0.12)",
};

const statusColors = {
  PENDING: { bg: theme.amberDim, text: theme.amber, label: "Pending" },
  APPROVED: { bg: theme.accentDim, text: theme.accent, label: "Approved" },
  REJECTED: { bg: theme.redDim, text: theme.red, label: "Rejected" },
  PAID: { bg: theme.greenDim, text: theme.green, label: "Paid" },
  PARTIALLY_PAID: { bg: theme.purpleDim, text: theme.purple, label: "Partial" },
  ACTIVE: { bg: theme.greenDim, text: theme.green, label: "Active" },
  INACTIVE: { bg: theme.redDim, text: theme.red, label: "Inactive" },
};

// --- Styles ---
const styles = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: theme.bg,
    color: theme.text,
    minHeight: "100vh",
    display: "flex",
  },
  sidebar: {
    width: 240,
    background: theme.surface,
    borderRight: `1px solid ${theme.border}`,
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    zIndex: 10,
  },
  logo: {
    padding: "0 24px 32px",
    borderBottom: `1px solid ${theme.border}`,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: theme.text,
  },
  logoSub: {
    fontSize: 11,
    color: theme.textDim,
    marginTop: 4,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? theme.accent : theme.textMuted,
    background: active ? theme.accentDim : "transparent",
    borderRight: active ? `2px solid ${theme.accent}` : "2px solid transparent",
    transition: "all 0.15s ease",
  }),
  main: {
    marginLeft: 240,
    flex: 1,
    padding: "32px 40px",
    maxWidth: 1200,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: theme.textDim,
    marginBottom: 32,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 32,
  },
  statCard: (accentColor, accentDim) => ({
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "20px 24px",
    position: "relative",
    overflow: "hidden",
  }),
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 500,
  },
  card: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: `1px solid ${theme.border}`,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 24px",
    fontSize: 11,
    fontWeight: 600,
    color: theme.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: `1px solid ${theme.border}`,
    background: theme.surfaceAlt,
  },
  td: {
    padding: "14px 24px",
    fontSize: 13,
    borderBottom: `1px solid ${theme.border}`,
    color: theme.text,
  },
  badge: (status) => {
    const s = statusColors[status] || { bg: theme.surfaceAlt, text: theme.textMuted };
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      background: s.bg,
      color: s.text,
      letterSpacing: "0.02em",
    };
  },
  btn: (variant = "primary") => {
    const base = {
      padding: "8px 16px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      transition: "all 0.15s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    };
    if (variant === "primary") return { ...base, background: theme.accent, color: "#fff" };
    if (variant === "success") return { ...base, background: theme.green, color: "#000" };
    if (variant === "danger") return { ...base, background: theme.red, color: "#fff" };
    if (variant === "ghost") return { ...base, background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}` };
    if (variant === "small-approve") return { ...base, background: theme.greenDim, color: theme.green, padding: "4px 10px", fontSize: 11 };
    if (variant === "small-reject") return { ...base, background: theme.redDim, color: theme.red, padding: "4px 10px", fontSize: 11 };
    if (variant === "small-pay") return { ...base, background: theme.accentDim, color: theme.accent, padding: "4px 10px", fontSize: 11 };
    return base;
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: theme.surfaceAlt,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    background: theme.surfaceAlt,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.textMuted,
    marginBottom: 6,
    display: "block",
  },
  formGroup: {
    marginBottom: 16,
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: 32,
    width: 460,
    maxHeight: "85vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 24,
    letterSpacing: "-0.02em",
  },
  searchBar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  filterRow: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    color: theme.textDim,
    fontSize: 14,
  },
  toast: (type) => ({
    position: "fixed",
    bottom: 24,
    right: 24,
    padding: "12px 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    zIndex: 200,
    background: type === "success" ? theme.green : theme.red,
    color: type === "success" ? "#000" : "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    animation: "slideIn 0.3s ease",
  }),
  progressBar: {
    width: "100%",
    height: 6,
    background: theme.surfaceAlt,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: (pct, color) => ({
    width: `${Math.min(pct, 100)}%`,
    height: "100%",
    background: color,
    borderRadius: 3,
    transition: "width 0.4s ease",
  }),
};

// --- Icons (inline SVG) ---
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  ),
  Vendor: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Invoice: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Payment: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Dollar: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
};

// --- Helpers ---
const fmt = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 })}` : "—";

const api = async (path, method = "GET", body = null) => {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

// --- Modal Component ---
const Modal = ({ title, onClose, children }) => (
  <div style={styles.modal} onClick={onClose}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={styles.modalTitle}>{title}</div>
        <button onClick={onClose} style={{ ...styles.btn("ghost"), padding: "6px 8px" }}>
          <Icons.X />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

// --- Toast ---
const Toast = ({ message, type }) => (
  message ? <div style={styles.toast(type)}>{message}</div> : null
);

// =============== MAIN APP ===============
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const [v, i, p] = await Promise.all([
        api("/vendors"), api("/invoices"), api("/payments"),
      ]);
      setVendors(v);
      setInvoices(i);
      setPayments(p);
    } catch (e) {
      showToast("Failed to load data. Is the server running?", "error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { id: "vendors", label: "Vendors", icon: Icons.Vendor },
    { id: "invoices", label: "Invoices", icon: Icons.Invoice },
    { id: "payments", label: "Payments", icon: Icons.Payment },
  ];

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        input:focus, select:focus { border-color: ${theme.accent} !important; }
        button:hover { opacity: 0.85; }
        tr:hover td { background: ${theme.surfaceAlt}; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>InvoiceTracker</div>
          <div style={styles.logoSub}>FinAuto Payables</div>
        </div>
        <div style={{ padding: "8px 0" }}>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navItem(page === item.id)} onClick={() => setPage(item.id)}>
              <item.icon /> {item.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 24px", borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 12, color: theme.textDim }}>Built by Atish</div>
          <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>Spring Boot + React</div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {page === "dashboard" && <DashboardPage vendors={vendors} invoices={invoices} payments={payments} setPage={setPage} />}
        {page === "vendors" && <VendorsPage vendors={vendors} invoices={invoices} reload={load} showToast={showToast} />}
        {page === "invoices" && <InvoicesPage invoices={invoices} vendors={vendors} payments={payments} reload={load} showToast={showToast} />}
        {page === "payments" && <PaymentsPage payments={payments} invoices={invoices} reload={load} showToast={showToast} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// =============== DASHBOARD ===============
function DashboardPage({ vendors, invoices, payments, setPage }) {
  const totalInvoiceAmt = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaidAmt = payments.reduce((s, p) => s + (p.paymentAmount || 0), 0);
  const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
  const approvedCount = invoices.filter((i) => i.status === "APPROVED").length;
  const paidCount = invoices.filter((i) => i.status === "PAID").length;
  const partialCount = invoices.filter((i) => i.status === "PARTIALLY_PAID").length;
  const rejectedCount = invoices.filter((i) => i.status === "REJECTED").length;

  const stats = [
    { label: "Total Invoiced", value: fmt(totalInvoiceAmt), color: theme.accent, dim: theme.accentDim },
    { label: "Total Paid", value: fmt(totalPaidAmt), color: theme.green, dim: theme.greenDim },
    { label: "Active Vendors", value: vendors.length, color: theme.cyan, dim: theme.cyanDim },
    { label: "Pending Approval", value: pendingCount, color: theme.amber, dim: theme.amberDim },
  ];

  const recentInvoices = [...invoices].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

  return (
    <div>
      <div style={styles.pageTitle}>Dashboard</div>
      <div style={styles.pageSubtitle}>Invoice Payment Tracker — Overview</div>

      <div style={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard(s.color, s.dim)}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: s.dim, borderRadius: "0 12px 0 80px" }} />
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Invoice Status Breakdown</div>
          </div>
          <div style={{ padding: 24 }}>
            {[
              { label: "Pending", count: pendingCount, color: theme.amber },
              { label: "Approved", count: approvedCount, color: theme.accent },
              { label: "Partially Paid", count: partialCount, color: theme.purple },
              { label: "Paid", count: paidCount, color: theme.green },
              { label: "Rejected", count: rejectedCount, color: theme.red },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: 13 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Recent Invoices</div>
            <button style={styles.btn("ghost")} onClick={() => setPage("invoices")}>View All</button>
          </div>
          {recentInvoices.length === 0 ? (
            <div style={styles.emptyState}>No invoices yet</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{inv.invoiceNumber}</td>
                    <td style={styles.td}>{fmt(inv.amount)}</td>
                    <td style={styles.td}><span style={styles.badge(inv.status)}>{statusColors[inv.status]?.label || inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// =============== VENDORS ===============
function VendorsPage({ vendors, invoices, reload, showToast }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = vendors.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", address: "", bankName: "", accountNumber: "", ifscCode: "" });
    setModal("create");
  };

  const openEdit = (v) => {
    setForm({ ...v });
    setModal("edit");
  };

  const save = async () => {
    try {
      if (modal === "create") {
        await api("/vendors", "POST", form);
        showToast("Vendor created");
      } else {
        await api(`/vendors/${form.id}`, "PUT", form);
        showToast("Vendor updated");
      }
      setModal(null);
      reload();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const remove = async (id) => {
    try {
      await api(`/vendors/${id}`, "DELETE");
      showToast("Vendor deleted");
      reload();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const vendorInvoiceCount = (vendorId) => invoices.filter((i) => i.vendor?.id === vendorId).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={styles.pageTitle}>Vendors</div>
          <div style={styles.pageSubtitle}>{vendors.length} registered vendors</div>
        </div>
        <button style={styles.btn("primary")} onClick={openCreate}><Icons.Plus /> Add Vendor</button>
      </div>

      <div style={styles.searchBar}>
        <div style={{ position: "relative", flex: 1 }}>
          <Icons.Search />
          <input
            style={{ ...styles.input, paddingLeft: 36 }}
            placeholder="Search vendors by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDim }}>
            <Icons.Search />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>No vendors found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Bank</th>
                <th style={styles.th}>Invoices</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{v.name}</td>
                  <td style={{ ...styles.td, color: theme.textMuted }}>{v.email || "—"}</td>
                  <td style={{ ...styles.td, color: theme.textMuted }}>{v.phone || "—"}</td>
                  <td style={{ ...styles.td, color: theme.textMuted }}>{v.bankName || "—"}</td>
                  <td style={styles.td}>{vendorInvoiceCount(v.id)}</td>
                  <td style={styles.td}><span style={styles.badge(v.status || "ACTIVE")}>{v.status || "Active"}</span></td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button style={styles.btn("ghost")} onClick={() => openEdit(v)}><Icons.Edit /></button>
                      <button style={styles.btn("ghost")} onClick={() => remove(v.id)}><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === "create" ? "New Vendor" : "Edit Vendor"} onClose={() => setModal(null)}>
          <FormField label="Name *">
            <input style={styles.input} value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <input style={styles.input} value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Phone">
              <input style={styles.input} value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <FormField label="Bank Name">
              <input style={styles.input} value={form.bankName || ""} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Account Number">
              <input style={styles.input} value={form.accountNumber || ""} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
            </FormField>
            <FormField label="IFSC Code">
              <input style={styles.input} value={form.ifscCode || ""} onChange={(e) => setForm({ ...form, ifscCode: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Address">
            <input style={styles.input} value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </FormField>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button style={styles.btn("ghost")} onClick={() => setModal(null)}>Cancel</button>
            <button style={styles.btn("primary")} onClick={save}>{modal === "create" ? "Create Vendor" : "Save Changes"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// =============== INVOICES ===============
function InvoicesPage({ invoices, vendors, payments, reload, showToast }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;
    if (search && !inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) &&
        !inv.vendor?.name?.toLowerCase().includes(search.toLowerCase()) &&
        !inv.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom && inv.dueDate < dateFrom) return false;
    if (dateTo && inv.dueDate > dateTo) return false;
    return true;
  });

  const getPaymentTotal = (invoiceId) =>
    payments.filter((p) => p.invoice?.id === invoiceId).reduce((s, p) => s + (p.paymentAmount || 0), 0);

  const openCreate = () => {
    setForm({ vendorId: vendors[0]?.id || "", invoiceNumber: "", description: "", amount: "", dueDate: "" });
    setModal("create");
  };

  const save = async () => {
    try {
      const body = { ...form, vendor: { id: Number(form.vendorId) }, amount: Number(form.amount) };
      delete body.vendorId;
      if (modal === "create") {
        await api("/invoices", "POST", body);
        showToast("Invoice created");
      } else {
        await api(`/invoices/${form.id}`, "PUT", body);
        showToast("Invoice updated");
      }
      setModal(null);
      reload();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const approve = async (id) => {
    try {
      await api(`/invoices/${id}/approve`, "PUT");
      showToast("Invoice approved");
      reload();
    } catch (e) { showToast(e.message, "error"); }
  };

  const reject = async (id) => {
    try {
      await api(`/invoices/${id}/reject`, "PUT");
      showToast("Invoice rejected");
      reload();
    } catch (e) { showToast(e.message, "error"); }
  };

  const remove = async (id) => {
    try {
      await api(`/invoices/${id}`, "DELETE");
      showToast("Invoice deleted");
      reload();
    } catch (e) { showToast(e.message, "error"); }
  };

  const statuses = ["ALL", "PENDING", "APPROVED", "PARTIALLY_PAID", "PAID", "REJECTED"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={styles.pageTitle}>Invoices</div>
          <div style={styles.pageSubtitle}>{invoices.length} total invoices</div>
        </div>
        <button style={styles.btn("primary")} onClick={openCreate}><Icons.Plus /> New Invoice</button>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <input
            style={{ ...styles.input, paddingLeft: 36 }}
            placeholder="Search by invoice #, vendor, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDim }}>
            <Icons.Search />
          </div>
        </div>
        <div>
          <label style={{ ...styles.label, marginBottom: 0 }}>From</label>
          <input type="date" style={{ ...styles.input, width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label style={{ ...styles.label, marginBottom: 0 }}>To</label>
          <input type="date" style={{ ...styles.input, width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: statusFilter === s ? (s === "ALL" ? theme.accentDim : (statusColors[s]?.bg || theme.surfaceAlt)) : "transparent",
              color: statusFilter === s ? (s === "ALL" ? theme.accent : (statusColors[s]?.text || theme.text)) : theme.textDim,
              transition: "all 0.15s ease",
            }}
          >
            {s === "ALL" ? "All" : statusColors[s]?.label || s}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>
              {s === "ALL" ? invoices.length : invoices.filter((i) => i.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>No invoices match your filters</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Paid</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const paid = getPaymentTotal(inv.id);
                const pct = inv.amount > 0 ? (paid / inv.amount) * 100 : 0;
                return (
                  <tr key={inv.id}>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500 }}>{inv.invoiceNumber}</td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{inv.vendor?.name || "—"}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{fmt(inv.amount)}</td>
                    <td style={styles.td}>
                      <div style={{ fontSize: 12 }}>{fmt(paid)} / {fmt(inv.amount)}</div>
                      <div style={styles.progressBar}>
                        <div style={styles.progressFill(pct, pct >= 100 ? theme.green : theme.accent)} />
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: theme.textMuted }}>{inv.dueDate || "—"}</td>
                    <td style={styles.td}><span style={styles.badge(inv.status)}>{statusColors[inv.status]?.label || inv.status}</span></td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {inv.status === "PENDING" && (
                          <>
                            <button style={styles.btn("small-approve")} onClick={() => approve(inv.id)}><Icons.Check /> Approve</button>
                            <button style={styles.btn("small-reject")} onClick={() => reject(inv.id)}><Icons.X /> Reject</button>
                          </>
                        )}
                        <button style={styles.btn("ghost")} onClick={() => remove(inv.id)}><Icons.Trash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title="New Invoice" onClose={() => setModal(null)}>
          <FormField label="Vendor *">
            <select style={styles.select} value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Invoice Number *">
              <input style={styles.input} value={form.invoiceNumber || ""} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
            </FormField>
            <FormField label="Amount *">
              <input style={styles.input} type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Description">
            <input style={styles.input} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Due Date">
            <input style={styles.input} type="date" value={form.dueDate || ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </FormField>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button style={styles.btn("ghost")} onClick={() => setModal(null)}>Cancel</button>
            <button style={styles.btn("primary")} onClick={save}>Create Invoice</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// =============== PAYMENTS ===============
function PaymentsPage({ payments, invoices, reload, showToast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");

  const payableInvoices = invoices.filter((i) => i.status === "APPROVED" || i.status === "PARTIALLY_PAID");

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const inv = p.invoice;
    return inv?.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
           p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
           p.paymentType?.toLowerCase().includes(search.toLowerCase());
  });

  const openCreate = () => {
    setForm({ invoiceId: payableInvoices[0]?.id || "", paymentAmount: "", paymentDate: "", paymentType: "BANK_TRANSFER", transactionId: "" });
    setModal("create");
  };

  const getInvoiceRemaining = (invoiceId) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return 0;
    const paid = payments.filter((p) => p.invoice?.id === invoiceId).reduce((s, p) => s + (p.paymentAmount || 0), 0);
    return inv.amount - paid;
  };

  const save = async () => {
    try {
      const body = { ...form, invoice: { id: Number(form.invoiceId) }, paymentAmount: Number(form.paymentAmount) };
      delete body.invoiceId;
      await api("/payments", "POST", body);
      showToast("Payment recorded");
      setModal(null);
      reload();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const remove = async (id) => {
    try {
      await api(`/payments/${id}`, "DELETE");
      showToast("Payment deleted");
      reload();
    } catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={styles.pageTitle}>Payments</div>
          <div style={styles.pageSubtitle}>{payments.length} total payments</div>
        </div>
        <button
          style={styles.btn(payableInvoices.length > 0 ? "primary" : "ghost")}
          onClick={payableInvoices.length > 0 ? openCreate : null}
          title={payableInvoices.length === 0 ? "No approved invoices to pay" : ""}
        >
          <Icons.Plus /> Record Payment
        </button>
      </div>

      <div style={styles.searchBar}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            style={{ ...styles.input, paddingLeft: 36 }}
            placeholder="Search by invoice #, transaction ID, or payment type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDim }}>
            <Icons.Search />
          </div>
        </div>
      </div>

      {/* Payable invoices summary */}
      {payableInvoices.length > 0 && (
        <div style={{ ...styles.card, marginBottom: 20 }}>
          <div style={{ ...styles.cardHeader, background: theme.surfaceAlt }}>
            <div style={styles.cardTitle}>Awaiting Payment</div>
            <span style={{ fontSize: 12, color: theme.textMuted }}>{payableInvoices.length} invoices</span>
          </div>
          <div style={{ display: "flex", gap: 12, padding: 16, overflowX: "auto" }}>
            {payableInvoices.map((inv) => {
              const remaining = getInvoiceRemaining(inv.id);
              return (
                <div key={inv.id} style={{
                  minWidth: 200, padding: 16, background: theme.surfaceAlt, borderRadius: 10,
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: theme.textMuted }}>{inv.invoiceNumber}</div>
                  <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>{inv.vendor?.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{fmt(remaining)}</div>
                  <div style={{ fontSize: 11, color: theme.textDim }}>remaining of {fmt(inv.amount)}</div>
                  <span style={{ ...styles.badge(inv.status), marginTop: 8 }}>{statusColors[inv.status]?.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>No payments recorded yet</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Transaction ID</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, color: theme.textDim }}>#{p.id}</td>
                  <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{p.invoice?.invoiceNumber || "—"}</td>
                  <td style={styles.td}>{p.invoice?.vendor?.name || "—"}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: theme.green }}>{fmt(p.paymentAmount)}</td>
                  <td style={{ ...styles.td, color: theme.textMuted }}>{p.paymentDate || "—"}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge("ACTIVE"), background: theme.cyanDim, color: theme.cyan }}>
                      {p.paymentType || "—"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.textMuted }}>{p.transactionId || "—"}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.btn("ghost")} onClick={() => remove(p.id)}><Icons.Trash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title="Record Payment" onClose={() => setModal(null)}>
          <FormField label="Invoice *">
            <select style={styles.select} value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}>
              {payableInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.vendor?.name} (Remaining: ₹{getInvoiceRemaining(inv.id).toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </FormField>
          {form.invoiceId && (
            <div style={{ padding: "10px 14px", background: theme.accentDim, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <span style={{ color: theme.textMuted }}>Remaining balance: </span>
              <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(getInvoiceRemaining(Number(form.invoiceId)))}</span>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Payment Amount *">
              <input style={styles.input} type="number" value={form.paymentAmount || ""} onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })} />
            </FormField>
            <FormField label="Payment Date">
              <input style={styles.input} type="date" value={form.paymentDate || ""} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Payment Type">
              <select style={styles.select} value={form.paymentType || ""} onChange={(e) => setForm({ ...form, paymentType: e.target.value })}>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
              </select>
            </FormField>
            <FormField label="Transaction ID">
              <input style={styles.input} value={form.transactionId || ""} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} />
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button style={styles.btn("ghost")} onClick={() => setModal(null)}>Cancel</button>
            <button style={styles.btn("success")} onClick={save}><Icons.Dollar /> Record Payment</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
