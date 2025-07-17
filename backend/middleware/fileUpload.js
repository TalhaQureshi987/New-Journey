import fileUpload from 'express-fileupload';

export const fileUploadMiddleware = fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    debug: process.env.NODE_ENV === 'development',
    uploadTimeout: 60000, // 1 minute
});