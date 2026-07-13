import nodemailer from 'nodemailer';

async function main(){
  try {
    // Try to create an Ethereal test account and send via real SMTP.
    let transporter;
    let testAccount;
    try {
      testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created.');
      console.log('User:', testAccount.user);

      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (err) {
      console.warn('Ethereal account creation failed or network blocked:', err.message || err);
      console.log('Falling back to stream transport (local only)');
      transporter = nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true });
    }

    const items = [
      { productName: 'Sample Tee', size: 'M', stock: 3, category: 'T-Shirts' },
      { productName: 'Party Blazer', size: 'L', stock: 2, category: 'Party Wear' }
    ];

    const rows = items.map(i => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd">${i.productName}</td>
        <td style="padding:6px;border:1px solid #ddd">${i.size}</td>
        <td style="padding:6px;border:1px solid #ddd">${i.stock}</td>
        <td style="padding:6px;border:1px solid #ddd">${i.category}</td>
      </tr>
    `).join('');

    const html = `
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

    const msg = {
      from: 'no-reply@example.com',
      to: 'sherlij.23bsr@kongu.edu',
      subject: 'Test Low Stock Alert',
      text: items.map(i => `${i.productName} (${i.size}) - ${i.stock} units`).join('\n'),
      html
    };

    let info;
    try {
      info = await transporter.sendMail(msg);
    } catch (sendErr) {
      console.warn('Sending via primary transporter failed:', sendErr.message || sendErr);
      console.log('Falling back to local stream transport to produce raw message output');
      const fallback = nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true });
      info = await fallback.sendMail(msg);
      // unset testAccount so we treat this as local-only
      testAccount = null;
    }

    console.log('Message processed. Info:');
    console.log(info);

    // If we used Ethereal, print preview URL. If stream transport used, print raw message buffer.
    if (testAccount) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', preview);
    } else if (info && info.message) {
      // info.message is a Buffer when streamTransport is used
      const raw = info.message.toString('utf-8');
      console.log('\n----- RAW MESSAGE START -----\n');
      console.log(raw);
      console.log('\n----- RAW MESSAGE END -----\n');
    }
  } catch (err) {
    console.error('Test send failed:', err);
    process.exit(1);
  }
}

main();
