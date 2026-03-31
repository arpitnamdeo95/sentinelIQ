const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  alert: { type: Boolean, required: true },
  footageUrl: { type: String, required: true },
  location: { type: String, required: true },
  anomalyDate: { type: String, required: true },
  anomalyTime: { type: String, required: true },
  coordinates: { type: String, required: true }, // The frontend uses .split(',') for this!
  createdContract: { type: String }
}, { strict: false }); // Disable strict to allow testing different formats

const Alert = mongoose.model("Alert", alertSchema);

const URI = "mongodb+srv://diva:divakar2004@divacluster.4zroa.mongodb.net/UrbanGuard";

const seedDatabase = async () => {
  try {
    console.log("Connecting to the new MongoDB database...");
    await mongoose.connect(URI);
    console.log("Connected! Inserting dummy alert...");

    const dummyAlert = new Alert({
      alert: true,
      footageUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      location: "MG Road Junction, Sector 5",
      anomalyDate: new Date().toLocaleDateString(),
      anomalyTime: new Date().toLocaleTimeString(),
      // String format for the frontend's split(',') method
      coordinates: "12.9716,77.5946", 
      createdContract: "false"
    });

    await dummyAlert.save();
    console.log("✅ Dummy Alert Inserted Successfully!");

    const alertsCount = await Alert.countDocuments();
    console.log(`Total alerts in database: ${alertsCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
