const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MongoDB se Connect Karein
const mongoURI = "mongodb+srv://rajeevthakur78774_db_user:vpr7rd7OB8tgoUMv@cluster0.n2tqu4l.mongodb.net/?appName=Cluster0";
mongoose.connect(mongoURI)
    .then(() => console.log("🔥 MongoDB securely connect ho gaya hai!"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// 2. Database ka Naya Structure (Schema) - Nayi details ke sath
const orderSchema = new mongoose.Schema({
    orderId: String,
    status: String,
    location: String,
    date: String,
    origin: { type: String, default: "Delhi-NCR" },
    destination: String,
    tableStatus: String,
    weight: String,         // Naya field
    package: String,        // Naya field
    invoiceNo: String,      // Naya field
    expectedDate: String,   // Naya field
    contactDetail: String   // Naya field
});
const Order = mongoose.model('Order', orderSchema);

// 3. API - Admin Update Order
app.post('/update-order', async (req, res) => {
    // Nayi details ko request se nikalna
    const { 
        orderId, status, location, date, origin, destination, tableStatus,
        weight, package, invoiceNo, expectedDate, contactDetail 
    } = req.body; 

    try {
        await Order.findOneAndUpdate(
            { orderId: orderId }, 
            { 
                status: status, 
                location: location, 
                date: date,
                origin: origin || "Delhi-NCR",
                destination: destination || "-",
                tableStatus: tableStatus || status,
                weight: weight || "-",
                package: package || "-",
                invoiceNo: invoiceNo || "-",
                expectedDate: expectedDate || "-",
                contactDetail: contactDetail || "-"
            },
            { returnDocument: 'after', upsert: true } 
        );
        
        res.json({ message: "Order MongoDB me securely update ho gaya! 🎉" });
    } catch (error) {
        console.log("MongoDB Save Error: ", error);
        res.status(500).json({ error: "Database save error" });
    }
});

// 4. API - Track Order
app.get('/track-order/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order nahi mila" });
        }
    } catch (error) {
        console.log("MongoDB Fetch Error: ", error);
        res.status(500).json({ error: "Database fetch error" });
    }
});

// 5. Server Start Karein (Render ke liye PORT best practice)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
