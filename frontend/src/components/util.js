// Formats a js Date into "DD MMM, HH:mm [am/pm]"
export function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  let dateArray = date.toDateString().split(" ");
  return dateArray[2] + " " + dateArray[1] + ", " + strTime;
}

// Converts timestamp {seconds: , nanoseconds: } to js Date.
export function timeStampToDate(timestamp) {
  return new Date(timestamp._seconds * 1000);
}
