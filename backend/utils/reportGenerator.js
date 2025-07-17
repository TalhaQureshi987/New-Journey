import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { UserSubscription } from '../models/userSubscriptions.model.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Company } from '../models/company.model.js';
import { format as dateFormat } from 'date-fns';

// Helper functions (not exported)
const calculateGrowth = (data) => {
    if (!data || data.length < 2) return 0;
    const oldValue = data[0].value;
    const newValue = data[data.length - 1].value;
    return oldValue === 0 ? 100 : ((newValue - oldValue) / oldValue * 100).toFixed(1);
};

const generateTimeSeriesData = async(startDate, endDate) => {
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const timeSeriesData = {
        users: [],
        jobs: [],
        companies: []
    };

    for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const [users, jobs, companies] = await Promise.all([
            User.countDocuments({
                createdAt: { $lt: nextDate }
            }),
            Job.countDocuments({
                status: 'active',
                createdAt: { $lt: nextDate }
            }),
            Company.countDocuments({
                createdAt: { $lt: nextDate }
            })
        ]);

        const dateStr = currentDate.toISOString().split('T')[0];
        timeSeriesData.users.push({ date: dateStr, value: users });
        timeSeriesData.jobs.push({ date: dateStr, value: jobs });
        timeSeriesData.companies.push({ date: dateStr, value: companies });
    }

    return timeSeriesData;
};

const generateReportData = async(startDate, endDate, type) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Basic stats
        const [users, jobs, subscriptions] = await Promise.all([
            User.aggregate([{
                $facet: {
                    total: [{ $count: "count" }],
                    active: [
                        { $match: { status: "active" } },
                        { $count: "count" }
                    ],
                    byRole: [{
                        $group: {
                            _id: "$role",
                            count: { $sum: 1 }
                        }
                    }]
                }
            }]),
            Job.aggregate([{
                $facet: {
                    total: [{ $count: "count" }],
                    byCategory: [{
                        $group: {
                            _id: "$category",
                            posted: { $sum: 1 },
                            filled: {
                                $sum: { $cond: [{ $eq: ["$status", "filled"] }, 1, 0] }
                            }
                        }
                    }],
                    byStatus: [{
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }]
                }
            }]),
            UserSubscription.aggregate([{
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        return {
            users: users[0],
            jobs: jobs[0],
            subscriptions: subscriptions[0] || { totalRevenue: 0, count: 0 }
        };
    } catch (error) {
        console.error('Error generating report data:', error);
        throw error;
    }
};

const generateExportFile = async(data, format) => {
    try {
        if (format === 'csv') {
            return generateCSV(data);
        } else if (format === 'pdf') {
            return generatePDF(data);
        } else {
            throw new Error('Unsupported format');
        }
    } catch (error) {
        console.error('Export file generation error:', error);
        throw error;
    }
};

const generateCSV = (data) => {
    try {
        // Prepare data for CSV
        const records = data.timeSeriesData.users.map((entry, index) => ({
            date: entry.date,
            totalUsers: entry.value,
            activeJobs: data.timeSeriesData.jobs[index].value,
            totalCompanies: data.timeSeriesData.companies[index].value,
            activeUsers: data.overview.users.active,
            inactiveUsers: data.overview.users.inactive,
            userGrowth: data.overview.users.growth,
            jobGrowth: data.overview.jobs.growth,
            companyGrowth: data.overview.companies.growth
        }));

        const fields = [
            { label: 'Date', value: 'date' },
            { label: 'Total Users', value: 'totalUsers' },
            { label: 'Active Users', value: 'activeUsers' },
            { label: 'Inactive Users', value: 'inactiveUsers' },
            { label: 'Active Jobs', value: 'activeJobs' },
            { label: 'Total Companies', value: 'totalCompanies' },
            { label: 'User Growth (%)', value: 'userGrowth' },
            { label: 'Job Growth (%)', value: 'jobGrowth' },
            { label: 'Company Growth (%)', value: 'companyGrowth' }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(records);

        return {
            data: csv,
            mimeType: 'text/csv'
        };
    } catch (error) {
        console.error('CSV Generation Error:', error);
        throw error;
    }
};

const generatePDF = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve({
                    data: result,
                    mimeType: 'application/pdf'
                });
            });

            // Title and Date
            doc.fontSize(20)
                .text('Platform Analytics Report', { align: 'center' })
                .moveDown(0.5);

            doc.fontSize(12)
                .text(`Generated on: ${dateFormat(new Date(), 'PPP')}`, { align: 'right' })
                .moveDown(2);

            // Overview Section
            doc.fontSize(16)
                .text('Overview Statistics', { underline: true })
                .moveDown(1);

            // Users Section
            doc.fontSize(14)
                .text('User Statistics')
                .moveDown(0.5);
            doc.fontSize(12)
                .text(`Total Users: ${data.overview.users.total}`)
                .text(`Active Users: ${data.overview.users.active}`)
                .text(`Inactive Users: ${data.overview.users.inactive}`)
                .text(`Growth Rate: ${data.overview.users.growth}%`)
                .moveDown(1);

            // Jobs Section
            doc.fontSize(14)
                .text('Job Statistics')
                .moveDown(0.5);
            doc.fontSize(12)
                .text(`Active Jobs: ${data.overview.jobs.active}`)
                .text(`Growth Rate: ${data.overview.jobs.growth}%`)
                .moveDown(1);

            // Companies Section
            doc.fontSize(14)
                .text('Company Statistics')
                .moveDown(0.5);
            doc.fontSize(12)
                .text(`Total Companies: ${data.overview.companies.total}`)
                .text(`Active Companies: ${data.overview.companies.active}`)
                .text(`Inactive Companies: ${data.overview.companies.inactive}`)
                .text(`Growth Rate: ${data.overview.companies.growth}%`)
                .moveDown(2);

            // Time Series Data
            doc.fontSize(16)
                .text('Daily Statistics', { underline: true })
                .moveDown(1);

            // Create a table-like structure for time series data
            const tableTop = doc.y;
            const tableLeft = 50;
            const colWidth = 120;

            // Table headers
            doc.fontSize(10)
                .text('Date', tableLeft, tableTop)
                .text('Users', tableLeft + colWidth, tableTop)
                .text('Jobs', tableLeft + colWidth * 2, tableTop)
                .text('Companies', tableLeft + colWidth * 3, tableTop)
                .moveDown();

            // Table data
            data.timeSeriesData.users.forEach((entry, index) => {
                const y = doc.y;
                doc.text(dateFormat(new Date(entry.date), 'PP'), tableLeft, y)
                    .text(entry.value.toString(), tableLeft + colWidth, y)
                    .text(data.timeSeriesData.jobs[index].value.toString(), tableLeft + colWidth * 2, y)
                    .text(data.timeSeriesData.companies[index].value.toString(), tableLeft + colWidth * 3, y)
                    .moveDown(0.5);
            });

            doc.end();
        } catch (error) {
            console.error('PDF Generation Error:', error);
            reject(error);
        }
    });
};

// Single export statement at the end
export {
    calculateGrowth,
    generateTimeSeriesData,
    generateReportData,
    generateExportFile
};