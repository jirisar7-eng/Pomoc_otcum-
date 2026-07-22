import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('VAROVÁNÍ: RESEND_API_KEY není nastaven v proměnných prostředí.');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
export default resend;
