// Email service utility for sending notifications
// In a real application, this would connect to an email service like SendGrid, Nodemailer, etc.
// For demo purposes, this will simulate email sending and log to console

export type EmailTemplate = 'approval' | 'disapproval'

export interface EmailData {
  to: string
  userName: string
  equipmentTitle: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  adminNote?: string
}

class EmailService {
  private static instance: EmailService
  
  private constructor() {}
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendApprovalEmail(data: EmailData): Promise<boolean> {
    try {
      const emailContent = this.generateApprovalTemplate(data)
      
      // In a real app, this would use an actual email service
      console.log('📧 Sending approval email to:', data.to)
      console.log('Email content:', emailContent)
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show browser notification (for demo)
      this.showNotification('Approval Email Sent', `Sent to ${data.to}`, 'success')
      
      return true
    } catch (error) {
      console.error('Failed to send approval email:', error)
      this.showNotification('Email Failed', 'Failed to send approval email', 'error')
      return false
    }
  }

  async sendDisapprovalEmail(data: EmailData): Promise<boolean> {
    try {
      const emailContent = this.generateDisapprovalTemplate(data)
      
      // In a real app, this would use an actual email service
      console.log('📧 Sending disapproval email to:', data.to)
      console.log('Email content:', emailContent)
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show browser notification (for demo)
      this.showNotification('Disapproval Email Sent', `Sent to ${data.to}`, 'warning')
      
      return true
    } catch (error) {
      console.error('Failed to send disapproval email:', error)
      this.showNotification('Email Failed', 'Failed to send disapproval email', 'error')
      return false
    }
  }

  private generateApprovalTemplate(data: EmailData): string {
    return `
Subject: ✅ Equipment Rental Request Approved - ${data.equipmentTitle}

Dear ${data.userName},

Great news! Your equipment rental request has been APPROVED.

📋 Booking Details:
• Equipment: ${data.equipmentTitle}
• Start: ${data.startDate} at ${data.startTime}
• End: ${data.endDate} at ${data.endTime}

${data.adminNote ? `📝 Admin Note: ${data.adminNote}` : ''}

Please ensure you collect and return the equipment on time.

Best regards,
Equipment Rental Team
    `.trim()
  }

  private generateDisapprovalTemplate(data: EmailData): string {
    return `
Subject: ❌ Equipment Rental Request Disapproved - ${data.equipmentTitle}

Dear ${data.userName},

We regret to inform you that your equipment rental request has been DISAPPROVED.

📋 Request Details:
• Equipment: ${data.equipmentTitle}  
• Requested: ${data.startDate} at ${data.startTime} to ${data.endDate} at ${data.endTime}

${data.adminNote ? `📝 Reason: ${data.adminNote}` : ''}

Please feel free to submit a new request or contact us for more information.

Best regards,
Equipment Rental Team
    `.trim()
  }

  private showNotification(title: string, message: string, type: 'success' | 'error' | 'warning') {
    // Create a visual notification in the browser
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-yellow-500 text-black'
    }`
    
    notification.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm mt-1">${message}</div>
    `
    
    document.body.appendChild(notification)
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }
}

export default EmailService.getInstance()