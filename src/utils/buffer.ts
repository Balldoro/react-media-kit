export function getBufferedEnd(buffered: TimeRanges | undefined, time: number) {
  if (!buffered) return time;

  for (let i = 1, len = buffered.length; i <= len; i++) {
    const idx = len - i;
    const start = buffered.start(idx);
    const end = buffered.end(idx);

    if (time >= start && time <= end) return end;
  }
  return time;
}
