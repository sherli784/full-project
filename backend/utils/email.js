import nodemailer from 'nodemailer';

const getTransporter = () => {
  // Read SMTP settings from env
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If SMTP configured, use it
  if (host && port && user && pass) {
    console.log('Using configured SMTP transport');
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback: use stream transport to capture email locally (for testing/preview)
  console.log('⚠️  SMTP not configured. Using local fallback stream transport for email preview.');
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

export async function sendLowStockAlert(to, items, threshold = 10) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('Skipping sending low stock email (transporter not available).');
    console.log('Low stock items:', items);
    return;
  }

  const from = process.env.FROM_EMAIL || 'orders@ecommerce.local';
  const subject = `LOW STOCK ALERT: ${items.length} item(s) below ${threshold} units`;

  const rowsHtml = items.map(i => `
    <tr>
      <td style="padding:6px;border:1px solid #ddd">${i.productName}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.size}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.stock}</td>
      <td style="padding:6px;border:1px solid #ddd">${i.category || ''}</td>
    </tr>
  `).join('');

  const html = `
    <h2 style="color: #d32f2f;">Low Stock Alert</h2>
    <p>The following products are below the configured low-stock threshold (<strong>${threshold} units</strong>):</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #ddd">
      <thead style="background:#f5f5f5">
        <tr>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;font-weight:bold">Product</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;font-weight:bold">Size</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;font-weight:bold">Current Stock</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;font-weight:bold">Category</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    <p style="margin-top: 20px; color: #d32f2f;"><strong>⚠️ ACTION REQUIRED:</strong> Please restock these items as soon as possible.</p>
    <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated alert from your e-commerce system.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: `Low Stock Alert\n\n${items.map(i => `${i.productName} (${i.size}) - ${i.stock} units`).join('\n')}\n\nPlease restock these items.`
    });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        ✅ LOW STOCK EMAIL GENERATED    ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Items:', items.length, 'product(s)');
    
    // If stream transport was used, print the raw email
    if (info.message) {
      const raw = info.message.toString('utf-8');
      console.log('\n----- EMAIL PREVIEW START -----\n');
      console.log(raw);
      console.log('\n----- EMAIL PREVIEW END -----\n');
    } else {
      console.log('Message ID:', info.messageId);
    }
  } catch (err) {
    console.error('❌ Failed to send low stock email:', err.message);
    console.error('Error details:', err);
  }
}

export default { sendLowStockAlert };
