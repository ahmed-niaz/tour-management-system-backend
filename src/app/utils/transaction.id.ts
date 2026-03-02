import { randomUUID } from 'crypto';

export const getTransactionId = () => `tran_${randomUUID()}`;