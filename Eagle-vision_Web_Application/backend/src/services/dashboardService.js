// services/dashboardService.js
const fs = require('fs');
const path = require('path');
const DashboardStatistics = require('../models/DashboardStatistics');

// Function to fetch data and write it to a JSON file
const fetchAndStoreDashboardData = async () => {
  try {
    // Fetch data from MongoDB
    let stats = await DashboardStatistics.find({}, { _id: 0, name: 1, value: 1 }); // Fetch only name and value

    if (!stats || stats.length === 0) {
      // Use defaults if empty
      stats = [
        { name: "Total Alerts Today", value: "59" },
        { name: "Resolved Alerts", value: "40" },
        { name: "Pending Alerts", value: "2" },
        { name: "Critical Alerts", value: "1" },
        { name: "Total Cameras", value: "245" },
        { name: "Active Cameras", value: "235" },
        { name: "Offline Cameras", value: "15" },
        { name: "Cameras with Active Alerts", value: "40" }
      ];
      // Seed the DB for future
      await DashboardStatistics.insertMany(stats);
    }

    // Define file path
    const filePath = path.join(__dirname, "../../data/dashboardStats.json");

    // Write data to JSON file
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));

    console.log('Dashboard statistics saved successfully!');
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
};

module.exports = { fetchAndStoreDashboardData };
