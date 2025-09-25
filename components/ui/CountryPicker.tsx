"use client";

import { useMemo } from "react";
import callingCode from "country-calling-code";
import countryList from "react-select-country-list";

export type Country = {
  code: string;
  name: string;
  iso: string; // just store ISO code
};

export function useCountries(): Country[] {
  return useMemo(() => {
    return countryList() // countryList() already returns the array
      .map((c) => {
        const dial =
          callingCode.find((d) => d.isoCode2 === c.value)?.countryCodes[0] ||
          "";

        return {
          code: dial ? `+${dial}` : "",
          name: c.label,
          iso: c.value.toLowerCase(),
        };
      })
      .filter((c) => c.code); // only keep countries with dialing codes
  }, []);
}
