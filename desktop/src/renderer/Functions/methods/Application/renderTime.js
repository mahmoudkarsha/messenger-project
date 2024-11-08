export default function renderTime(date, format) {
  const d = new Date(date);
  let DD = String(d.getDate());
  let MM = String(d.getMonth() + 1);
  let YYYY = String(d.getFullYear());
  let HH = String(d.getHours());
  let II = String(d.getMinutes());
  if (DD.length === 1) DD = "0" + DD;
  if (MM.length === 1) MM = "0" + MM;
  if (HH.length === 1) HH = "0" + HH;
  if (II.length === 1) II = "0" + II;
  switch (format) {
    case "YYYY-MM-DD HH:II":
      return `${YYYY}/ ${MM}/ ${DD} ${HH}:${II}`;

    case "YYYY-MM-DD":
      return `${YYYY}-${MM}${DD}`;

    case "HH:II":
      return `${HH}:${II}`;
    default:
      return;
  }
}
