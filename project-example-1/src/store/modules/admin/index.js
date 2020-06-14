import moduleAnalytics from './modules/analytics';
import moduleClients from './modules/clients';
import moduleRedirects from './modules/redirects';
import moduleFinances from './modules/finances';
import moduleCarousel from './modules/carousel';
import moduleTariff from './modules/tariff';
import moduleMarketingIndicators from './modules/marketing-indicators';
import subscribeToFirestore from './subscribe-to-firestore';
import moduleAdminClientsPlugin from './modules/clients/subscribe-to-firestore';
import moduleAdminFinancesPlugin from './modules/finances/subscribe-to-firestore';
import moduleAdminTariffPlugin from './modules/tariff/subscribe-to-firestore';

export default {
  namespaced: true,
  modules: {
    analytics: moduleAnalytics,
    clients: moduleClients,
    redirects: moduleRedirects,
    finances: moduleFinances,
    carousel: moduleCarousel,
    tariff: moduleTariff,
    'marketing-indicators': moduleMarketingIndicators,
  },
  plugins: [
    subscribeToFirestore,
    moduleAdminClientsPlugin,
    moduleAdminFinancesPlugin,
    moduleAdminTariffPlugin,
  ],
};
