export const welcomeTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
      <h1 style="color: #2c3e50;">Welcome to Our Platform!</h1>
    </div>
    
    <div style="padding: 20px; background-color: white;">
      <h2 style="color: #34495e;">Hello ${name},</h2>
      
      <p style="color: #555; line-height: 1.6;">
        We're excited to have you join our community of entrepreneurs and investors! 
        Our platform connects innovative ideas with the right investors to make dreams come true.
      </p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">What's Next?</h3>
        <ul style="color: #555; line-height: 1.6;">
          <li>Complete your profile</li>
          <li>Browse through projects</li>
          <li>Connect with potential partners</li>
          <li>Start your investment journey</li>
        </ul>
      </div>
      
      <p style="color: #555; line-height: 1.6;">
        If you have any questions, our support team is always here to help!
      </p>
    </div>
    
    <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
      <p>© 2024 Investment Platform. All rights reserved.</p>
    </div>
  </div>
`; 