export interface CurrencyOption {
  code: string;
  label: string;
}

// Jordan & GCC currencies
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "JOD", label: "Jordanian Dinar (JOD)" },
  { code: "SAR", label: "Saudi Riyal (SAR)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "QAR", label: "Qatari Riyal (QAR)" },
  { code: "KWD", label: "Kuwaiti Dinar (KWD)" },
  { code: "BHD", label: "Bahraini Dinar (BHD)" },
  { code: "OMR", label: "Omani Rial (OMR)" },
];
