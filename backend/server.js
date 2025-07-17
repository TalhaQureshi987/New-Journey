import cron from 'node-cron';

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add a test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Run the check every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        const result = await Job.updateMany(
            {
                status: 'active',
                expiryDate: { $lt: now }
            },
            {
                $set: { status: 'expired' }
            }
        );
        
        console.log(`Cron job: ${result.modifiedCount} jobs marked as expired`);
    } catch (error) {
        console.error('Cron job error:', error);
    }
}); 