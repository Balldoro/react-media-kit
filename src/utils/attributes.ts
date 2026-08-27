// Set explicit undefined if condition is false, so that data-* attribute is remove from DOM element
export const setDataAttr = (condition: boolean) => condition || undefined;
