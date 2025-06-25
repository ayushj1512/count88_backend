const Query = require('../models/Query');

// POST: Create a new query
exports.createQuery = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      organisationName,
      location,
      queryType,
      message,
    } = req.body;

    if (!name || !phoneNumber || !queryType) {
      return res.status(400).json({ message: 'Name, phone number, and query type are required.' });
    }

    const newQuery = new Query({
      name,
      phoneNumber,
      email,
      organisationName,
      location,
      queryType,
      message,
    });

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error('❌ Error creating query:', error);
    res.status(500).json({ message: 'Server error while creating query.' });
  }
};

// GET: Fetch all queries
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    console.error('❌ Error fetching queries:', error);
    res.status(500).json({ message: 'Server error while fetching queries.' });
  }
};

// PATCH: Update only the status of a query
exports.updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    res.status(200).json(updatedQuery);
  } catch (error) {
    console.error('❌ Error updating query status:', error);
    res.status(500).json({ message: 'Server error while updating query status.' });
  }
};

// DELETE: Remove a query by ID
exports.deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuery = await Query.findByIdAndDelete(id);

    if (!deletedQuery) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    res.status(200).json({ message: 'Query deleted successfully.', deletedQuery });
  } catch (error) {
    console.error('❌ Error deleting query:', error);
    res.status(500).json({ message: 'Server error while deleting query.' });
  }
};
