import { registerAs } from '@nestjs/config';

export default registerAs('app.config', () => ({
   port: parseInt(process.env.PORT ?? '3333', 10),
   appName: process.env.APP_NAME || 'omega-shop-backend',
}));
