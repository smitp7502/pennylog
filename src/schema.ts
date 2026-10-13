// JSON-LD (schema.org) objects shared by pages; passed to Base.astro's `schema` prop. See docs/seo.md.
// Only state facts that are true of the app today: no ratings, review counts or download numbers.
import { site } from './config';

const ctx = 'https://schema.org';

export const developer = { '@type': 'Person', name: site.developer, email: site.supportEmail };

const free = { '@type': 'Offer', price: '0', priceCurrency: 'INR' };

/** The Android app, on the home page. */
export function appSchema(origin: URL) {
  return {
    '@context': ctx,
    '@type': 'MobileApplication',
    name: site.name,
    alternateName: 'PennyLog Expense Tracker',
    description: site.description,
    url: new URL('/', origin).href,
    image: new URL('/icon.png', origin).href,
    screenshot: new URL('/og.png', origin).href,
    operatingSystem: 'Android',
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Expense tracker',
    installUrl: site.playUrl,
    downloadUrl: site.playUrl,
    offers: free,
    isAccessibleForFree: true,
    inLanguage: 'en',
    author: developer,
    publisher: developer,
    featureList: [
      'Offline expense tracking',
      'Expense, income and transfer records',
      'Multiple accounts: cash, bank and wallets',
      'Monthly budgets per category with early warnings',
      'Spending statistics by category, day and account',
      'Recurring income and expenses',
      'People tags',
      'Split expenses with friends: who owes whom, fewest payments',
      'Split sub-groups',
      'UPI QR for each split payment',
      'Google Drive backup and restore',
      'PDF and Excel export',
      'Dark and light themes',
    ],
  };
}

/** The site itself, on the home page. */
export function websiteSchema(origin: URL) {
  return {
    '@context': ctx,
    '@type': 'WebSite',
    name: site.name,
    url: new URL('/', origin).href,
    description: site.description,
    inLanguage: 'en-IN',
    publisher: developer,
  };
}

/** The in-browser split calculator on /split. */
export function splitToolSchema(origin: URL) {
  return {
    '@context': ctx,
    '@type': 'WebApplication',
    name: 'PennyLog split expenses calculator',
    description:
      'Free online bill splitter: add people and what each paid, and see the fewest payments that settle everyone. Runs in the browser, saves nothing.',
    url: new URL('/split', origin).href,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: free,
    isAccessibleForFree: true,
    author: developer,
  };
}

/** FAQPage from [question, answer-html] pairs. Answers lose their markup. */
export function faqSchema(qs: [string, string][]) {
  const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  return {
    '@context': ctx,
    '@type': 'FAQPage',
    mainEntity: qs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: text(a) } })),
  };
}
