export const applyFilters = (data = [], search = "", selectedFilters = {}, options = {}) => {
    const { searchKeys = [], dateKey } = options;

    return data?.filter((item) => {
        // ✅ Search filter
        const matchesSearch =
            !search ||
            searchKeys.some((key) =>
                item[key]?.toString().toLowerCase().includes(search.toLowerCase())
            );

        // ✅ Other filters (status, role, etc.)
        const matchesFilters = Object.entries(selectedFilters).every(([key, value]) => {
            // if no value or 'All', skip this filter
            if (!value || value.toLowerCase() === "all") return true;

            // ✅ Handle date-based filters
            if (key.toLowerCase().includes("date") || key === dateKey) {
                if (!item[dateKey]) return false;

                const getItemDatePart = (dateValue) => {
                    if (!dateValue) return "";
                    return dateValue.toString().split("T")[0];
                };

                const itemDatePart = getItemDatePart(item[dateKey]);
                const selectedDatePart = getItemDatePart(value);

                return itemDatePart === selectedDatePart;
            }

            // ✅ Default exact match
            return item[key]?.toString().toLowerCase() === value.toLowerCase();
        });

        return matchesSearch && matchesFilters;
    });
};
