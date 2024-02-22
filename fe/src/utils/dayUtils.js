import dayjs from "dayjs";

export const getMondayOfWeek = (weekDay) => {
  return dayjs(weekDay).day(1).toDate();
};

export const getAllMondayOfYear = (year) => {
  const mondays = [];

  let mondayOfMonth = dayjs().year(year).month(1).date(1).day(1);

  while (mondayOfMonth.year() == year) {
    mondays.push(mondayOfMonth.toDate());
    mondayOfMonth = mondayOfMonth.add(7, "day");
  }

  return mondays;
};
export const getCurrentYear = () => {
  return dayjs().year();
};
