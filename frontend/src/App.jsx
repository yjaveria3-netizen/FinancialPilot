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
import { ProcurePage, InventoryPage, PricingPage, NegotiationPage, CfoChatPage } from './pages/BPages';
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
          <Route path="procure-ai" element={<ProcurePage />} />

          {/* 8. Inventory Alerts */}
          <Route path="inventory" element={<InventoryPage />} />

          {/* 9. Pricing Advisor */}
          <Route path="pricing-advisor" element={<PricingPage />} />

          {/* 10. Negotiation Copilot */}
          <Route path="negotiation-copilot" element={<NegotiationPage />} />

          {/* 11. Accountant & Lender Portal */}
          <Route path="accountant-portal" element={<AccountantPortal />} />

          {/* 12. WhatsApp Automated Collection Agent */}
          <Route path="whatsapp-collector" element={<WhatsAppCollector />} />
          <Route path="whatsapp-agent" element={<WhatsAppCollector />} />

          {/* 12. AI CFO Chat */}
          <Route path="cfo-chat" element={<CfoChatPage />} />

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
  </LanguageProvider>
  );
}
