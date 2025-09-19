import { registerAs } from '@nestjs/config';

export default registerAs('groq.config', () => ({
   groqApiKey: process.env.GROQ_API_KEY,
}));
