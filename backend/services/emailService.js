import nodemailer from 'nodemailer';

// Create a working email transporter for development
const createTransporter = () => {
  // Try different transport methods in order of preference
  const transporters = [
    // 1. Try configured SMTP
    () => {
      if (process.env.SMTP_USER && process.env.SMTP_PASS && 
          process.env.SMTP_USER !== 'your-mailtrap-user') {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_PORT == 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      }
      return null;
    },
    
    // 2. Try Ethereal test account
    async () => {
      try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('📧 Using Ethereal test account:', testAccount.user);
        return nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      } catch (error) {
        console.log('⚠️ Ethereal account failed:', error.message);
        return null;
      }
    },
    
    // 3. Fallback to local stream transport
    () => {
      console.log('📧 Using local stream transport (preview only)');
      return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  ];
  
  return transporters;
};

// Send low stock notification email
export const sendLowStockNotification = async (products) => {
  console.log('🚨 Sending low stock notification for', products.length, 'products');
  
  try {
    const emailContent = generateLowStockEmail(products);
    
    // Always use local stream transport for reliability
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'orders@ecommerce.local',
      to: process.env.LOW_STOCK_EMAIL || 'sherlij.23bsr@kongu.edu',
      subject: `🚨 Low Stock Alert - ${products.length} Product(s) Running Low`,
      html: emailContent
    };

    console.log('📧 Generating email notification...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email notification generated successfully!');
    console.log('📧 Email Details:');
    console.log('   To:', process.env.LOW_STOCK_EMAIL || 'sherlij.23bsr@kongu.edu');
    console.log('   From:', process.env.FROM_EMAIL || 'orders@ecommerce.local');
    console.log('   Subject:', `🚨 Low Stock Alert - ${products.length} Product(s) Running Low`);
    console.log('   Products:', products.map(p => `${p.name} (${p.id})`).join(', '));
    console.log('   Message ID:', info.messageId);
    console.log('');
    console.log('📄 Email Content:');
    console.log('─'.repeat(50));
    console.log(info.message.toString());
    console.log('─'.repeat(50));
    
    return info;
  } catch (error) {
    console.error('❌ Failed to generate low stock notification:', error);
    throw error;
  }
};

// Generate HTML email content for low stock products
const generateLowStockEmail = (products) => {
  // Convert products to simple items format like original
  const items = [];
  products.forEach(product => {
    Object.entries(product.sizes).forEach(([size, data]) => {
      if (data.stock <= 5) { // Only include low stock items
        items.push({
          productName: product.name,
          size: size,
          stock: data.stock,
          category: product.category
        });
      }
    });
  });

  const rows = items.map(i => `
    <tr>
      <td style="padding:6px;border:1px solid #ddd">${i.productName}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.size}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.stock}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.category}</td>
    </tr>
  `).join('');

  return `
    <p>This is a test low-stock alert.</p>
    <table style="border-collapse:collapse;width:100%">
      <thead>
        <tr>
          <th style="padding:6px;border:1px solid #ddd;text-align:left">Product</th>
          <th style="padding:6px;border:1px solid #ddd;text-align:left">Size</th>
          <th style="padding:6px;border:1px solid #ddd;text-align:left">Stock</th>
          <th style="padding:6px;border:1px solid #ddd;text-align:left">Category</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

// Check if product stock is low
export const checkLowStock = (product, threshold = 10) => {
  return Object.entries(product.sizes).some(([_, data]) => 
    data.stock <= threshold
  );
};

export default {
  sendLowStockNotification,
  checkLowStock
};
