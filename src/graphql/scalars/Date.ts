import { parseISO } from 'date-fns';

export default (date: string | null) => date && parseISO(date);
