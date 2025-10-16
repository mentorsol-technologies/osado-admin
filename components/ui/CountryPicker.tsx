"use client";

import { useMemo } from "react";
import callingCode from "country-calling-code";
import countryList from "react-select-country-list";

export type Country = {
  code: string;
  name: string;
  iso: string; // just store ISO code
  iso3: string;
  callingCode?: string;
};

export function useCountries(): Country[] {
  return useMemo(() => {
    return (countryList() as any)
      .getData()
      .map((c: { value: string; label: string }) => {
        const countryData = callingCode.find(
          (d) => d.isoCode2 === c.value
        );
        const dial = countryData?.countryCodes[0] || "";
        const iso3 = countryData?.isoCode3 || "";

        return {
          code: dial ? `+${dial}` : "",
          name: c.label,
          iso: c.value.toLowerCase(),
          iso3: iso3.toUpperCase(),
        };
      })
      .filter((c: Country) => c.code); // only keep countries with dialing codes
  }, []);
}
