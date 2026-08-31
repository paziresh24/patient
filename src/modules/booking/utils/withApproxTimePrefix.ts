/**
 * Formats online-visit time as «حدود {clock}-{date}» so «حدود» qualifies the hour, not the date.
 * Idempotent when the text is already in the target shape.
 * Note: do not use \b — JS word boundaries do not treat Persian letters as word chars.
 */
const JALALI_DATE = '([۰-۹0-9]{4}/[۰-۹0-9]{2}/[۰-۹0-9]{2})';
const CLOCK = '([۰-۹0-9]{1,2}:[۰-۹0-9]{2})';
const CORRECT_FORMAT = new RegExp(`^حدود\\s+${CLOCK}-${JALALI_DATE}$`);

const parseVisitTimeParts = (text: string): { clock: string; date: string } | null => {
  const dateThenClock = text.match(new RegExp(`^${JALALI_DATE}\\s+${CLOCK}$`));
  if (dateThenClock) {
    return { date: dateThenClock[1], clock: dateThenClock[2] };
  }

  const saatThenDate = text.match(new RegExp(`^ساعت\\s+${CLOCK}\\s*-\\s*${JALALI_DATE}$`));
  if (saatThenDate) {
    return { date: saatThenDate[2], clock: saatThenDate[1] };
  }

  const clockThenDate = text.match(new RegExp(`^${CLOCK}-${JALALI_DATE}$`));
  if (clockThenDate) {
    return { date: clockThenDate[2], clock: clockThenDate[1] };
  }

  return null;
};

export const withApproxTimePrefix = (timeText: string | null | undefined): string => {
  if (timeText == null) return '';
  const trimmed = String(timeText).trim();
  if (!trimmed) return '';
  if (CORRECT_FORMAT.test(trimmed)) return trimmed;

  let body = trimmed;
  if (/^حدود(?:\s|$)/.test(body)) {
    body = body.replace(/^حدود\s+/, '').trim();
  }

  const parts = parseVisitTimeParts(body);
  if (parts) {
    return `حدود ${parts.clock}-${parts.date}`;
  }

  return `حدود ${body}`;
};
