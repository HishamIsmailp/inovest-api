export const resetPasswordTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>You have requested to reset your password. Click the button below to set a new password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  </div>
</body>
</html>
`; 