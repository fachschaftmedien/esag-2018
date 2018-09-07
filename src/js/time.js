import mod from './mod.js'

function parseTime(time){
  if(typeof time === "number") return time;
  const [hour, minute] = time.trim().split(":", 2).map(e => +e);
  return hour * 60 + minute;
}

function toTime(parsed){
 const h = parseInt(parsed / 60);
 const m = mod(parsed, 60);
 return (h < 10 ? "0"+h : ""+h) + ":" + (m < 10 ? "0"+m : m);
}

function isBetween(start, end, entry){
  start = parseTime(start);
  end = parseTime(end);
  return !(start > parseTime(entry.end) && end < parseTime(entry.start));
}


export default {
  isBetween,
  parseTime,
  toTime
}
