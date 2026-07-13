import { sendLowStockNotification } from './emailService.js';

// Queue for email notifications
const emailQueue = [];
let isProcessing = false;

// Add email notification to queue
export const queueEmailNotification = (products) => {
  emailQueue.push({
    products,
    timestamp: Date.now(),
    id: Math.random().toString(36).substr(2, 9)
  });
  
  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }
};

// Process email queue in background
const processQueue = async () => {
  if (isProcessing || emailQueue.length === 0) return;
  
  isProcessing = true;
  
  while (emailQueue.length > 0) {
    const job = emailQueue.shift();
    
    try {
      await sendLowStockNotification(job.products);
      console.log(`Email notification sent for job ${job.id}`);
    } catch (error) {
      console.error(`Failed to send email notification for job ${job.id}:`, error);
    }
    
    // Small delay to prevent overwhelming email service
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessing = false;
};

// Batch multiple low stock notifications
export const batchLowStockNotifications = (products) => {
  // Group by product to avoid duplicates
  const uniqueProducts = [];
  const seen = new Set();
  
  for (const product of products) {
    if (!seen.has(product.id)) {
      seen.add(product.id);
      uniqueProducts.push(product);
    }
  }
  
  if (uniqueProducts.length > 0) {
    queueEmailNotification(uniqueProducts);
  }
};

export default {
  queueEmailNotification,
  batchLowStockNotifications
};
