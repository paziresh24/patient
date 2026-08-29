type AverageRates = {
  average_quality_of_treatment?: unknown;
  average_doctor_encounter?: unknown;
  average_explanation_of_issue?: unknown;
};

/** Average only present rate dimensions — avoids treating missing as 0. */
export function getAverageRate(averageRates?: AverageRates | null): number | null {
  if (!averageRates) return null;
  const values = [
    averageRates.average_quality_of_treatment,
    averageRates.average_doctor_encounter,
    averageRates.average_explanation_of_issue,
  ]
    .map(v => Number(v))
    .filter(n => Number.isFinite(n) && n > 0);

  if (!values.length) return null;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

export function formatAverageRate(averageRates?: AverageRates | null): string | undefined {
  const avg = getAverageRate(averageRates);
  return avg == null ? undefined : avg.toFixed(1);
}

/** Profile SEO / card percent — 5-star average scaled to 0–100. */
export function getSatisfactionPercent(averageRates?: AverageRates | null): number | null {
  const avg = getAverageRate(averageRates);
  return avg == null ? null : Number((avg * 20).toFixed(0));
}
