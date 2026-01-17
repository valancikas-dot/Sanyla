/**
 * Legal Documents Translations
 * Terms of Service, Privacy Policy, Refund Policy
 * 17 languages supported
 */

import { Language } from '@marketing-autopilot/shared';

export type LegalTranslationKey =
  // Legal Navigation
  | 'legal.terms_title'
  | 'legal.privacy_title'
  | 'legal.refund_title'
  | 'legal.back_home'
  | 'legal.effective_date'
  | 'legal.last_updated'
  
  // Terms of Service - Summary
  | 'terms.summary.title'
  | 'terms.summary.point1'
  | 'terms.summary.point2'
  | 'terms.summary.point3'
  | 'terms.summary.point4'
  | 'terms.summary.point5'
  | 'terms.summary.point6'
  | 'terms.summary.point7'
  
  // Terms sections
  | 'terms.section1.title'
  | 'terms.section1.content'
  | 'terms.section2.title'
  | 'terms.section3.title'
  | 'terms.section4.title'
  | 'terms.section5.title'
  | 'terms.section6.title'
  | 'terms.credits.starter'
  | 'terms.credits.pro'
  | 'terms.credits.power'
  | 'terms.section7.title'
  | 'terms.section8.title'
  | 'terms.contact.website'
  
  // Privacy Policy - Summary
  | 'privacy.summary.title'
  | 'privacy.summary.point1'
  | 'privacy.summary.point2'
  | 'privacy.summary.point3'
  | 'privacy.summary.point4'
  | 'privacy.summary.point5'
  | 'privacy.summary.point6'
  | 'privacy.summary.point7'
  
  // Privacy sections
  | 'privacy.section1.title'
  | 'privacy.section2.title'
  | 'privacy.section3.title'
  | 'privacy.section4.title'
  | 'privacy.section5.title'
  | 'privacy.your_rights.title'
  | 'privacy.your_rights.access'
  | 'privacy.your_rights.deletion'
  | 'privacy.your_rights.correction'
  | 'privacy.your_rights.export'
  
  // Refund Policy - Summary
  | 'refund.summary.title'
  | 'refund.summary.point1'
  | 'refund.summary.point2'
  | 'refund.summary.point3'
  | 'refund.summary.point4'
  | 'refund.summary.point5'
  | 'refund.summary.point6'
  
  // Refund sections
  | 'refund.section1.title'
  | 'refund.section2.title'
  | 'refund.section2.eligible'
  | 'refund.section2.not_eligible'
  | 'refund.section3.title'
  | 'refund.section3.step1'
  | 'refund.section3.step2'
  | 'refund.section3.step3'
  | 'refund.section4.title'
  | 'refund.contact_support';

// Lithuanian (LT) - Full translations
const LITHUANIAN_LEGAL = {
  // Navigation
  'legal.terms_title': 'Paslaugų Teikimo Sąlygos',
  'legal.privacy_title': 'Privatumo Politika',
  'legal.refund_title': 'Pinigų Grąžinimo Politika',
  'legal.back_home': '← Atgal į pradžią',
  'legal.effective_date': 'Įsigaliojimo data',
  'legal.last_updated': 'Paskutinis atnaujinimas',
  
  // Terms Summary
  'terms.summary.title': 'Santrauka',
  'terms.summary.point1': 'Sanyla generuoja 7 dienų socialinių tinklų kampanijas su AI',
  'terms.summary.point2': 'Kreditai perkame per Stripe (€9, €39, €69 paketai)',
  'terms.summary.point3': 'Jokių prenumeratų, jokių pasikartojančių mokėjimų',
  'terms.summary.point4': 'Pinigų grąžinimas tik už nenaudotus kreditus (14 dienų)',
  'terms.summary.point5': 'AI turinys generuojamas 17 kalbų',
  'terms.summary.point6': 'Jūs valdote sugeneruotą turinį',
  'terms.summary.point7': 'Paslauga teikiama fizinio asmens (ne įmonės)',
  
  // Terms Sections
  'terms.section1.title': '1. Sąlygų Priėmimas',
  'terms.section1.content': 'Naudodami Sanyla (https://www.sanyla.site), sutinkate su šiomis Paslaugų Teikimo Sąlygomis.',
  'terms.section2.title': '2. Apibrėžimai',
  'terms.section3.title': '3. Tinkamumas',
  'terms.section4.title': '4. Paslaugos Aprašymas',
  'terms.section5.title': '5. Mokėjimai ir Kreditai',
  'terms.section6.title': '6. Pinigų Grąžinimo Politika',
  'terms.credits.starter': 'Starter: 100 kreditų už €9',
  'terms.credits.pro': 'Pro: 500 kreditų už €39 (Populiariausias)',
  'terms.credits.power': 'Power: 1000 kreditų už €69',
  'terms.section7.title': '7. Vartotojo Atsakomybė',
  'terms.section8.title': '8. AI Generuoto Turinio Atsakomybės Apribojimas',
  'terms.contact.website': 'Svetainė: https://www.sanyla.site',
  
  // Privacy Summary
  'privacy.summary.title': 'Santrauka',
  'privacy.summary.point1': 'Renkame el. paštą, socialinių tinklų prieigos raktus ir naudojimo duomenis',
  'privacy.summary.point2': 'Duomenys naudojami TIK paslaugai teikti',
  'privacy.summary.point3': 'Stripe tvarko mokėjimus (mes nematome jūsų kortelės)',
  'privacy.summary.point4': 'MES NEPARDUODAME jūsų asmeninių duomenų',
  'privacy.summary.point5': 'Galite prašyti ištrinti duomenis bet kada',
  'privacy.summary.point6': 'HTTPS/SSL apsauga įjungta',
  'privacy.summary.point7': '17 kalbų platforma (daugiakalbis turinys)',
  
  // Privacy Sections
  'privacy.section1.title': '1. Įvadas',
  'privacy.section2.title': '2. Informacija, Kurią Renkame',
  'privacy.section3.title': '3. Kaip Naudojame Jūsų Informaciją',
  'privacy.section4.title': '4. Duomenų Dalijimasis ir Trečiosios Šalys',
  'privacy.section5.title': '5. Duomenų Saugojimas',
  'privacy.your_rights.title': 'Jūsų Teisės',
  'privacy.your_rights.access': 'Prieiga prie duomenų: Prašykite savo duomenų kopijos',
  'privacy.your_rights.deletion': 'Ištrynimas: Prašykite ištrinti paskyrą ir duomenis',
  'privacy.your_rights.correction': 'Taisymas: Atnaujinkite neteisingą informaciją',
  'privacy.your_rights.export': 'Eksportavimas: Gaukite duomenis JSON formatu',
  
  // Refund Summary
  'refund.summary.title': 'Santrauka',
  'refund.summary.point1': 'Pinigų grąžinimas tik už NENAUDOTUS kreditus',
  'refund.summary.point2': 'Prašymas per 14 dienų nuo pirkimo',
  'refund.summary.point3': 'Jokių grąžinimų už jau panaudotus kreditus ar sugeneruotas kampanijas',
  'refund.summary.point4': 'Rankinis grąžinimo procesas per pagalbos kontaktą',
  'refund.summary.point5': 'Apdorojama per Stripe (5-7 darbo dienos)',
  'refund.summary.point6': 'Vertinama individualiai',
  
  // Refund Sections
  'refund.section1.title': '1. Apžvalga',
  'refund.section2.title': '2. Tinkamumo Kriterijai',
  'refund.section2.eligible': 'Tinka grąžinimui:',
  'refund.section2.not_eligible': 'NETINKA grąžinimui:',
  'refund.section3.title': '3. Kaip Prašyti Grąžinimo',
  'refund.section3.step1': '1 žingsnis: Susisiekite su palaikymu',
  'refund.section3.step2': '2 žingsnis: Pateikite informaciją',
  'refund.section3.step3': '3 žingsnis: Patikrinimas',
  'refund.section4.title': '4. Grąžinimo Apdorojimas',
  'refund.contact_support': 'Susisiekti su palaikymu',
};

// English (EN) - Full translations
const ENGLISH_LEGAL = {
  // Navigation
  'legal.terms_title': 'Terms of Service',
  'legal.privacy_title': 'Privacy Policy',
  'legal.refund_title': 'Refund Policy',
  'legal.back_home': '← Back to Home',
  'legal.effective_date': 'Effective Date',
  'legal.last_updated': 'Last Updated',
  
  // Terms Summary
  'terms.summary.title': 'Summary',
  'terms.summary.point1': 'Sanyla generates AI-powered 7-day social media campaigns',
  'terms.summary.point2': 'Credits purchased via Stripe (€9, €39, €69 packs)',
  'terms.summary.point3': 'No subscriptions, no recurring charges',
  'terms.summary.point4': 'Refunds only for unused credits (14-day window)',
  'terms.summary.point5': 'AI content generated in 17 languages',
  'terms.summary.point6': 'You own the content you generate',
  'terms.summary.point7': 'Service operated by an individual (not a registered company)',
  
  // Terms Sections
  'terms.section1.title': '1. Acceptance of Terms',
  'terms.section1.content': 'By accessing or using Sanyla (https://www.sanyla.site), you agree to be bound by these Terms of Service.',
  'terms.section2.title': '2. Definitions',
  'terms.section3.title': '3. Eligibility',
  'terms.section4.title': '4. Description of Service',
  'terms.section5.title': '5. Payments and Credits',
  'terms.section6.title': '6. Refund Policy',
  'terms.credits.starter': 'Starter: 100 credits for €9',
  'terms.credits.pro': 'Pro: 500 credits for €39 (Most Popular)',
  'terms.credits.power': 'Power: 1000 credits for €69',
  'terms.section7.title': '7. User Responsibilities',
  'terms.section8.title': '8. AI-Generated Content Disclaimer',
  'terms.contact.website': 'Website: https://www.sanyla.site',
  
  // Privacy Summary
  'privacy.summary.title': 'Summary',
  'privacy.summary.point1': 'We collect email, social tokens, and usage data',
  'privacy.summary.point2': 'Data used ONLY to provide the Service',
  'privacy.summary.point3': 'Stripe handles payments (we never see your card)',
  'privacy.summary.point4': 'We do NOT sell your personal data',
  'privacy.summary.point5': 'You can request data deletion anytime',
  'privacy.summary.point6': 'HTTPS/SSL security enabled',
  'privacy.summary.point7': '17-language platform (multilingual content generation)',
  
  // Privacy Sections
  'privacy.section1.title': '1. Introduction',
  'privacy.section2.title': '2. Information We Collect',
  'privacy.section3.title': '3. How We Use Your Information',
  'privacy.section4.title': '4. Data Sharing and Third Parties',
  'privacy.section5.title': '5. Data Retention',
  'privacy.your_rights.title': 'Your Rights',
  'privacy.your_rights.access': 'Access: Request a copy of your data',
  'privacy.your_rights.deletion': 'Deletion: Request account and data deletion',
  'privacy.your_rights.correction': 'Correction: Update inaccurate information',
  'privacy.your_rights.export': 'Export: Get your data in JSON format',
  
  // Refund Summary
  'refund.summary.title': 'Summary',
  'refund.summary.point1': 'Refunds available for UNUSED credits only',
  'refund.summary.point2': 'Request within 14 days of purchase',
  'refund.summary.point3': 'No refunds for already-used credits or generated campaigns',
  'refund.summary.point4': 'Manual refund process via support contact',
  'refund.summary.point5': 'Processed through Stripe (5-7 business days)',
  'refund.summary.point6': 'Evaluated case-by-case',
  
  // Refund Sections
  'refund.section1.title': '1. Overview',
  'refund.section2.title': '2. Refund Eligibility',
  'refund.section2.eligible': 'Eligible for Refund:',
  'refund.section2.not_eligible': 'NOT Eligible for Refund:',
  'refund.section3.title': '3. How to Request a Refund',
  'refund.section3.step1': 'Step 1: Contact Support',
  'refund.section3.step2': 'Step 2: Provide Information',
  'refund.section3.step3': 'Step 3: Verification',
  'refund.section4.title': '4. Refund Processing',
  'refund.contact_support': 'Contact Support',
};

// Other languages (machine translations - recommend professional review before production)
// For production, these should be professionally translated
const POLISH_LEGAL = {
  'legal.terms_title': 'Warunki Świadczenia Usług',
  'legal.privacy_title': 'Polityka Prywatności',
  'legal.refund_title': 'Polityka Zwrotów',
  'legal.back_home': '← Powrót do strony głównej',
  'legal.effective_date': 'Data wejścia w życie',
  'legal.last_updated': 'Ostatnia aktualizacja',
  'terms.summary.title': 'Podsumowanie',
  'terms.summary.point1': 'Sanyla generuje 7-dniowe kampanie w mediach społecznościowych za pomocą AI',
  'terms.summary.point2': 'Kredyty kupowane przez Stripe (€9, €39, €69 pakiety)',
  'terms.summary.point3': 'Bez subskrypcji, bez opłat cyklicznych',
  'terms.summary.point4': 'Zwroty tylko za niewykorzystane kredyty (14 dni)',
  'terms.summary.point5': 'Treści AI generowane w 17 językach',
  'terms.summary.point6': 'Posiadasz wygenerowane treści',
  'terms.summary.point7': 'Usługa prowadzona przez osobę fizyczną (nie firmę)',
  'terms.section1.title': '1. Akceptacja Warunków',
  'terms.section1.content': 'Korzystając z Sanyla, zgadzasz się na niniejsze Warunki Świadczenia Usług.',
  'terms.section2.title': '2. Definicje',
  'terms.section3.title': '3. Uprawnienia',
  'terms.section4.title': '4. Opis Usługi',
  'terms.section5.title': '5. Płatności i Kredyty',
  'terms.section6.title': '6. Polityka Zwrotów',
  'terms.credits.starter': 'Starter: 100 kredytów za €9',
  'terms.credits.pro': 'Pro: 500 kredytów za €39 (Najpopularniejszy)',
  'terms.credits.power': 'Power: 1000 kredytów za €69',
  'terms.section7.title': '7. Obowiązki Użytkownika',
  'terms.section8.title': '8. Zastrzeżenie Treści AI',
  'terms.contact.website': 'Strona: https://www.sanyla.site',
  'privacy.summary.title': 'Podsumowanie',
  'privacy.summary.point1': 'Zbieramy e-mail, tokeny społecznościowe i dane użytkowania',
  'privacy.summary.point2': 'Dane używane TYLKO do świadczenia usługi',
  'privacy.summary.point3': 'Stripe obsługuje płatności (nie widzimy twojej karty)',
  'privacy.summary.point4': 'NIE sprzedajemy twoich danych osobowych',
  'privacy.summary.point5': 'Możesz poprosić o usunięcie danych w dowolnym momencie',
  'privacy.summary.point6': 'Zabezpieczenie HTTPS/SSL włączone',
  'privacy.summary.point7': 'Platforma 17-językowa (wielojęzyczne treści)',
  'privacy.section1.title': '1. Wprowadzenie',
  'privacy.section2.title': '2. Informacje, Które Zbieramy',
  'privacy.section3.title': '3. Jak Używamy Twoich Informacji',
  'privacy.section4.title': '4. Udostępnianie Danych i Strony Trzecie',
  'privacy.section5.title': '5. Przechowywanie Danych',
  'privacy.your_rights.title': 'Twoje Prawa',
  'privacy.your_rights.access': 'Dostęp: Poproś o kopię swoich danych',
  'privacy.your_rights.deletion': 'Usunięcie: Poproś o usunięcie konta i danych',
  'privacy.your_rights.correction': 'Korekta: Zaktualizuj nieprawidłowe informacje',
  'privacy.your_rights.export': 'Eksport: Pobierz dane w formacie JSON',
  'refund.summary.title': 'Podsumowanie',
  'refund.summary.point1': 'Zwroty dostępne TYLKO dla niewykorzystanych kredytów',
  'refund.summary.point2': 'Prośba w ciągu 14 dni od zakupu',
  'refund.summary.point3': 'Brak zwrotów za już użyte kredyty lub wygenerowane kampanie',
  'refund.summary.point4': 'Ręczny proces zwrotu przez kontakt z pomocą',
  'refund.summary.point5': 'Przetwarzane przez Stripe (5-7 dni roboczych)',
  'refund.summary.point6': 'Oceniane indywidualnie',
  'refund.section1.title': '1. Przegląd',
  'refund.section2.title': '2. Uprawnienia do Zwrotu',
  'refund.section2.eligible': 'Kwalifikuje się do zwrotu:',
  'refund.section2.not_eligible': 'NIE kwalifikuje się do zwrotu:',
  'refund.section3.title': '3. Jak Poprosić o Zwrot',
  'refund.section3.step1': 'Krok 1: Skontaktuj się z pomocą',
  'refund.section3.step2': 'Krok 2: Podaj informacje',
  'refund.section3.step3': 'Krok 3: Weryfikacja',
  'refund.section4.title': '4. Przetwarzanie Zwrotu',
  'refund.contact_support': 'Skontaktuj się z pomocą',
};

// Type for legal translations
type LegalTranslations = Record<LegalTranslationKey, string>;

export const legalTranslations: Record<Language, Partial<LegalTranslations>> = {
  LITHUANIAN: LITHUANIAN_LEGAL,
  ENGLISH: ENGLISH_LEGAL,
  POLISH: POLISH_LEGAL,
  // Other languages fallback to English for now
  // In production, these should be professionally translated
  LATVIAN: { ...ENGLISH_LEGAL },
  ESTONIAN: { ...ENGLISH_LEGAL },
  RUSSIAN: { ...ENGLISH_LEGAL },
  GERMAN: { ...ENGLISH_LEGAL },
  FRENCH: { ...ENGLISH_LEGAL },
  SPANISH: { ...ENGLISH_LEGAL },
  ITALIAN: { ...ENGLISH_LEGAL },
  PORTUGUESE: { ...ENGLISH_LEGAL },
  DUTCH: { ...ENGLISH_LEGAL },
  SWEDISH: { ...ENGLISH_LEGAL },
  NORWEGIAN: { ...ENGLISH_LEGAL },
  DANISH: { ...ENGLISH_LEGAL },
  FINNISH: { ...ENGLISH_LEGAL },
  CZECH: { ...ENGLISH_LEGAL },
};

// Helper function to get legal translation
export function getLegalTranslation(
  language: Language,
  key: LegalTranslationKey
): string {
  return legalTranslations[language]?.[key] || legalTranslations.ENGLISH[key] || key;
}
