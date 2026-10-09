import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CashFlowPage from './pages/CashFlowPage';
import CreditScorePage from './pages/CreditScorePage';
import ComingSoon from './pages/ComingSoon';
import {
  IconAnomalyGuard,
  IconTaxAssistant,
  IconScenarioPlanner,
  IconProcureAi,
  IconInventory,
  IconPricingAdvisor,
  IconNegotiation,
  IconAccountantPortal,
  IconCfoChat,
  IconScanInvoice,
} from './components/Icons';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Public Landing Page */}
          <Route index element={<LandingPage />} />

          {/* 1. Morning Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* 2 & 3. Cash Flow Forecaster & Credit Readiness Score */}
          <Route path="cash-flow" element={<CashFlowPage />} />
          <Route path="credit-score" element={<CreditScorePage />} />

          {/* 4. Anomaly & Fraud Guard */}
          <Route
            path="anomaly-guard"
            element={
              <ComingSoon
                title="Anomaly & Fraud Guard"
                icon={<IconAnomalyGuard className="size-10 text-primary" />}
                assignee="Compliance & Risk"
              />
            }
          />

          {/* 5. Tax & Compliance Assistant */}
          <Route
            path="tax-assistant"
            element={
              <ComingSoon
                title="Tax & Compliance Assistant"
                icon={<IconTaxAssistant className="size-10 text-primary" />}
                assignee="Tax Intelligence"
              />
            }
          />

          {/* 6. Scenario Planner */}
          <Route
            path="scenario-planner"
            element={
              <ComingSoon
                title="Scenario Planner"
                icon={<IconScenarioPlanner className="size-10 text-primary" />}
                assignee="Monte Carlo Modeling"
              />
            }
          />

          {/* 7. ProcureAI */}
          <Route
            path="procure-ai"
            element={
              <ComingSoon
                title="ProcureAI"
                icon={<IconProcureAi className="size-10 text-primary" />}
                assignee="Procurement Intelligence"
              />
            }
          />

          {/* 8. Inventory Alerts */}
          <Route
            path="inventory"
            element={
              <ComingSoon
                title="Inventory Alerts"
                icon={<IconInventory className="size-10 text-primary" />}
                assignee="Supply Chain Intelligence"
              />
            }
          />

          {/* 9. Pricing Advisor */}
          <Route
            path="pricing-advisor"
            element={
              <ComingSoon
                title="Pricing Advisor"
                icon={<IconPricingAdvisor className="size-10 text-primary" />}
                assignee="Revenue Optimization"
              />
            }
          />

          {/* 10. Negotiation Copilot */}
          <Route
            path="negotiation-copilot"
            element={
              <ComingSoon
                title="Negotiation Copilot"
                icon={<IconNegotiation className="size-10 text-primary" />}
                assignee="Supplier Strategy"
              />
            }
          />

          {/* 11. Accountant & Lender Portal */}
          <Route
            path="accountant-portal"
            element={
              <ComingSoon
                title="Accountant & Lender Portal"
                icon={<IconAccountantPortal className="size-10 text-primary" />}
                assignee="Reporting & Audit"
              />
            }
          />

          {/* 12. AI CFO Chat */}
          <Route
            path="cfo-chat"
            element={
              <ComingSoon
                title="AI CFO Chat"
                icon={<IconCfoChat className="size-10 text-primary" />}
                assignee="Conversational Intelligence"
              />
            }
          />

          {/* 13. Invoice & Receipt Scanner */}
          <Route
            path="invoice-scanner"
            element={
              <ComingSoon
                title="Invoice & Receipt Scanner"
                icon={<IconScanInvoice className="size-10 text-primary" />}
                assignee="OCR Vision Ingestion"
              />
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <ComingSoon
                title="Page Not Found"
                icon={<span className="text-2xl font-bold font-secondary text-primary">404</span>}
                assignee="Navigation"
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
