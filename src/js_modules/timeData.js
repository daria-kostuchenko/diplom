export const periodList = [
  {
    ID: 0,
    Name: 'Год',
    duration: 12
  },
  {
    ID: 1,
    Name: 'Полугодие',
    duration: 6
  },
  {
    ID: 2,
    Name: 'Квартал',
    duration: 3
  },
  {
    ID: 3,
    Name: 'Месяц',
    duration: 1
  },
]

export const periodValue = {
  0: {
    min: 2000,
    max: 2030
  },
  1: {
    min: 1,
    max: 2
  },
  2: {
    min: 1,
    max: 4
  },
  3: {
    min: 0,
    max: 11
  },
}

export const getPeriodById = (id) => {
  return periodList.find(period => period.ID === id);
}

const periodId = 0;

export const initialTime = {
  periodId: periodId,
  checkboxVals: [periodId],
  yearFrom: 2001,
  yearTo: 2001,
  chosenPeriodFrom: 0,
  chosenPeriodTo: 0
}