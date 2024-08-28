// Load environment variables
import { ENV } from './constants/constant';
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import folderRouter from './routes/folder.route';
import snippetRouter from './routes/snippet.route';
import userRouter from './routes/user.route';

// import snippetRoutes from './routes/snippetRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ENV.CORS_ORIGIN_ACCESS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/folder', folderRouter);
app.use('/api/v1/code-snippet', snippetRouter);
app.use('/api/v1/auth', userRouter);

// health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'health is good ❤️' });
});

// Routes
// app.use('/api/snippets', snippetRoutes);

export default app;
