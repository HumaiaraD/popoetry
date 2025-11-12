import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  post: z.string().min(20).max(500), // or use `post` instead of `description`
  category: z.string().min(3).max(20),
});
