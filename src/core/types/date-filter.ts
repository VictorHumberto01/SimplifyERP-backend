export type DateFilter = {
  type: 'greater' | 'less' | 'equal' | 'between';
  firstDate: Date;
  secondDate?: Date;
};
