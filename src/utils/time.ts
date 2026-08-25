export function getTimeParts(duration: number) {
  const timeParts = { hours: 0, minutes: 0, seconds: 0 };

  if (!Number.isFinite(duration) || duration < 0) return timeParts;

  timeParts.hours = Math.floor(duration / 3600);
  duration %= 3600;
  timeParts.minutes = Math.floor(duration / 60);
  duration %= 60;
  timeParts.seconds = Math.floor(duration);

  return timeParts;
}

const padZeros = (value: number | string) => String(value).padStart(2, "0");

export function getTimeFormat(time: number) {
  const { hours, minutes, seconds } = getTimeParts(time);
  const value = hours ? [hours, minutes, seconds] : [minutes, seconds];
  return value.map((v, idx) => (idx === 0 ? String(v) : padZeros(v))).join(":");
}

export function getDurationTimeFormat(time: number) {
  const { hours, minutes, seconds } = getTimeParts(time);
  return `PT${hours}H${minutes}M${seconds}S`;
}

export function createTimeLabelFormatter(locale?: string) {
  const createNumberFormatter = (unit: "hour" | "minute" | "second") =>
    new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "long" });

  const numberFormatters = {
    hour: createNumberFormatter("hour"),
    minute: createNumberFormatter("minute"),
    second: createNumberFormatter("second"),
  };
  const listFormatter = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });

  return (time: number) => {
    const { hours, minutes, seconds } = getTimeParts(time);
    const timeValues = [
      hours && numberFormatters["hour"].format(hours),
      minutes && numberFormatters["minute"].format(minutes),
      seconds && numberFormatters["second"].format(seconds),
    ].filter(Boolean) as string[];

    if (timeValues.length === 0) return numberFormatters["second"].format(0);
    return listFormatter.format(timeValues);
  };
}

export const normalizeTime = (time: number) => (Number.isFinite(time) ? time : 0);
