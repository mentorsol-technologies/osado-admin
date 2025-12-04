interface ApplyFiltersOptions {
  searchKeys?: string[];
  dateKey?: string;
  sortKey?: string;
  nameKey?: string;
  dateFieldKey?: string;
}

// Keys that are used for sorting, not filtering
const SORT_KEYS = ["sort-by", "sortBy", "sort", "sort_by"];

const getLocalDateString = (dateValue: string | Date): string => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const applyFilters = (
  data: any[] = [],
  search: string = "",
  selectedFilters: Record<string, any> = {},
  options: ApplyFiltersOptions = {}
) => {
  const {
    searchKeys = [],
    dateKey,
    nameKey = "name",
    dateFieldKey = "createdAt",
  } = options;

  if (!data || !Array.isArray(data)) return [];

  let result = data.filter((item) => {
    const matchesSearch =
      !search ||
      searchKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(search.toLowerCase())
      );

    // Filter matching
    const matchesFilters = Object.entries(selectedFilters).every(
      ([key, value]) => {
        // Skip empty values or "All"
        if (!value || value.toLowerCase() === "all") return true;

        // Skip sort keys - they're handled separately
        if (SORT_KEYS.includes(key)) return true;

        // Date filtering - check if this is a date-type filter
        const isDateFilter =
          key === dateKey ||
          key.toLowerCase().includes("date") ||
          key.toLowerCase() === "createdat" ||
          key.toLowerCase() === "updatedat";

        if (isDateFilter) {
          const dateField = dateKey || key;
          if (!item[dateField]) return false;

          // Compare dates in local timezone to avoid timezone shift issues
          const itemDate = getLocalDateString(item[dateField]);
          const selectedDate = getLocalDateString(value);

          return itemDate === selectedDate;
        }

        // Regular field filtering (e.g., status)
        const itemValue = item[key];

        // If the field doesn't exist on the item, don't filter it out
        if (itemValue === undefined || itemValue === null) return true;

        return itemValue.toString().toLowerCase() === value.toLowerCase();
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Sorting logic
  const sortBy =
    selectedFilters["sort-by"] ||
    selectedFilters["sortBy"] ||
    selectedFilters["sort_by"] ||
    selectedFilters["sort"];
  if (sortBy && sortBy.toLowerCase() !== "all") {
    const sortValue = sortBy.toLowerCase();

    if (sortValue === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b[dateFieldKey]).getTime() -
          new Date(a[dateFieldKey]).getTime()
      );
    } else if (sortValue === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a[dateFieldKey]).getTime() -
          new Date(b[dateFieldKey]).getTime()
      );
    } else if (sortValue === "a–z" || sortValue === "a-z") {
      result = [...result].sort((a, b) =>
        (a[nameKey] || "").localeCompare(b[nameKey] || "")
      );
    } else if (sortValue === "z–a" || sortValue === "z-a") {
      result = [...result].sort((a, b) =>
        (b[nameKey] || "").localeCompare(a[nameKey] || "")
      );
    }
  }

  return result;
};
