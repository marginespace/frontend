import axios from 'axios';

export const adminClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL,
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
});
