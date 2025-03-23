export const full: Intl.DateTimeFormatOptions = { dateStyle: "full", timeZone: 'UTC' } as const
export const monthYear: Intl.DateTimeFormatOptions = { month: "long", year: "numeric", timeZone: 'UTC' } as const

export const spanishFull = new Intl.DateTimeFormat("es", full);
export const englishFull = new Intl.DateTimeFormat("en", full);

export const spanishMonthYear = new Intl.DateTimeFormat("es", full);
export const englishMonthYear = new Intl.DateTimeFormat("en", full);
