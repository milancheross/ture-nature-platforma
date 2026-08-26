type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/**
 * CLDR plural for `locale`. Each language file owns its word forms.
 * sr: one / few / other · en: one / other · future langs follow the same map.
 */
export function plural(locale: string, n: number, forms: PluralForms) {
  const rule = new Intl.PluralRules(locale).select(n);
  return `${n} ${forms[rule] ?? forms.other}`;
}
