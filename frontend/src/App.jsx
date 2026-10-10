import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CashFlowPage from './pages/CashFlowPage';
import CreditScorePage from './pages/CreditScorePage';
import AnomalyGuard from './components/AnomalyGuard';
import TaxAssistant from './components/TaxAssistant';
import ScenarioPlanner from './components/ScenarioPlanner';
import AccountantPortal from './components/AccountantPortal';
import WhatsAppCollector from './components/WhatsAppCollector';
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
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
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
          <Route path="anomaly-guard" element={<AnomalyGuard />} />

          {/* 5. Tax & Compliance Assistant */}
          <Route path="tax-assistant" element={<TaxAssistant />} />

          {/* 6. Scenario Planner */}
          <Route path="scenario-planner" element={<ScenarioPlanner />} />

          {/* 7. ProcureAI */}
          <Route
            path="procure-ai"
            element={
              <ComingSoon
                title="ProcureAI"
                icon={<IconProcureAi className="size-10 text-secondary-light" />}
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
                icon={<IconInventory className="size-10 text-secondary-light" />}
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
                icon={<IconPricingAdvisor className="size-10 text-secondary-light" />}
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
                icon={<IconNegotiation className="size-10 text-secondary-light" />}
                assignee="Supplier Strategy"
              />
            }
          />

          {/* 11. Accountant & Lender Portal */}
          <Route path="accountant-portal" element={<AccountantPortal />} />

          {/* 12. WhatsApp Automated Collection Agent */}
          <Route path="whatsapp-collector" element={<WhatsAppCollector />} />
          <Route path="whatsapp-agent" element={<WhatsAppCollector />} />

          {/* 12. AI CFO Chat */}
          <Route
            path="cfo-chat"
            element={
              <ComingSoon
                title="AI CFO Chat"
                icon={<IconCfoChat className="size-10 text-secondary-light" />}
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
                icon={<IconScanInvoice className="size-10 text-secondary-light" />}
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
                icon={<span className="text-2xl font-bold font-secondary text-secondary-light">404</span>}
                assignee="Navigation"
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
  );
}
