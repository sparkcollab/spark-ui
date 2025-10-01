export const getOptions = (options, valueKey, labelKey) =>
  options.map((option) => ({
    value: option[valueKey],
    label: option[labelKey],
  }));
