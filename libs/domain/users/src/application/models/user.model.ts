import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  fullname: z.string().optional().nullable(),
});

export type UserModel = z.TypeOf<typeof userSchema>;
