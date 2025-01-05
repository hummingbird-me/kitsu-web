import { parseISO } from 'date-fns';

export default (date: string | null): Date | null =>
  date ? parseISO(date) : null;
