declare module "react-select-country-list" {
  /** Single country option returned by the library */
  export type CountryOption = {
    label: string; // e.g., "United States"
    value: string; // e.g., "US"
  };

  /** The default export is a function that returns an array of CountryOption */
  const countryList: () => CountryOption[];
  export default countryList;
}
