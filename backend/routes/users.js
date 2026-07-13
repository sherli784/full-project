import express from 'express';
import { User } from '../models/User.js';
import database from '../database.js';

const router = express.Router();

// Get all registered users
router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    
    let users;
    
    // Try MongoDB first, fallback to file database
    try {
      let query = {};
      
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }
      
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      users = await User.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('name email phone createdAt role'); // Only select required fields
        
      const total = await User.countDocuments(query);
      
      res.json({
        users: users.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt
        })),
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    } catch (mongoError) {
      // Fallback to file database
      console.log('Using fallback database for users');
      let allUsers = await database.findUsers ? database.findUsers() : [];
      
      if (search) {
        allUsers = allUsers.filter(user => 
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Sort users
      allUsers.sort((a, b) => {
        if (sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }
        return sortOrder === 'desc' ? 
          (b[sortBy] || '').localeCompare(a[sortBy] || '') : 
          (a[sortBy] || '').localeCompare(b[sortBy] || '');
      });
      
      const total = allUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      
      res.json({
        users: paginatedUsers.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt
        })),
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Download users as PDF
router.get('/download/pdf', async (req, res) => {
  try {
    const { search } = req.query;
    
    let users;
    try {
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }
      users = await User.find(query).sort({ createdAt: -1 });
    } catch (mongoError) {
      // Fallback to file database
      let allUsers = await database.findUsers ? database.findUsers() : [];
      if (search) {
        allUsers = allUsers.filter(user => 
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
        );
      }
      users = allUsers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    // Generate PDF content
    const pdfContent = generatePDFContent(users);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="registered-users.pdf"');
    res.send(pdfContent);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: error.message });
  }
});

// Download users as Excel
router.get('/download/excel', async (req, res) => {
  try {
    const { search } = req.query;
    
    let users;
    try {
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }
      users = await User.find(query).sort({ createdAt: -1 });
    } catch (mongoError) {
      // Fallback to file database
      let allUsers = await database.findUsers ? database.findUsers() : [];
      if (search) {
        allUsers = allUsers.filter(user => 
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
        );
      }
      users = allUsers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    // Generate Excel content
    const excelContent = generateExcelContent(users);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="registered-users.xlsx"');
    res.send(excelContent);
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate PDF content
function generatePDFContent(users) {
  // This is a simplified PDF generation
  // In production, you'd use a library like puppeteer or jsPDF
  const header = `
    KM Fashion Clothing Co
    Registered Users Report
    Generated on: ${new Date().toLocaleDateString()}
    
    Name | Email ID | Phone Number | Registration Date
    --------------------------------------------------
  `;
  
  const rows = users.map(user => {
    const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    return `${user.name || 'N/A'} | ${user.email || 'N/A'} | ${user.phone || 'N/A'} | ${regDate}`;
  }).join('\n');
  
  return Buffer.from(header + rows, 'utf-8');
}

// Helper function to generate Excel content
function generateExcelContent(users) {
  // This is a simplified Excel generation
  // In production, you'd use a library like xlsx or exceljs
  const header = 'Name,Email ID,Phone Number,Registration Date\n';
  
  const rows = users.map(user => {
    const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    return `"${user.name || 'N/A'}","${user.email || 'N/A'}","${user.phone || 'N/A'}","${regDate}"`;
  }).join('\n');
  
  return Buffer.from(header + rows, 'utf-8');
}

export default router;
