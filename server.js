/** @format */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(`${process.env.CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 40000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log(`Connected to the ${mongoose.connection.name} database`);
});

const ItemSchema = new mongoose.Schema({
  date: String,
  booking: String,
  customer: String,
  commodity: String,
  plr: String,
  pol: String,
  pod: String,
  fdn: String,
  shipping_Line: String,
  noOfCntrs: Number,
  cntrSize: String,
  cntrUsed: Number,
  quote: String,
  vessel: String,
  docCutOff: String,
  vesselCut: String,
  etd: String,
  comments: String,
  pic: String,
  vgmCutOff: String,
  status: String,
});

const Item = mongoose.model('BookingManagementCluster', ItemSchema);

app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    if (!items.length) {
      return res.status(404).json({ message: 'No items found' });
    }
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res
      .status(500)
      .json({ message: 'Error fetching items', error: err.message });
  }
});

app.post('/add-data', async (req, res) => {
  try {
    const newItem = new Item(req.body);

    await newItem.save();
    res.status(201).json(newItem); // Respond with the created item
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(500).json({ message: 'Error saving item', error: err.message });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res
      .status(500)
      .json({ message: 'Error updating item', error: err.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res
      .status(500)
      .json({ message: 'Error deleting item', error: err.message });
  }
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
