<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1a222c;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 20px;
            text-align: center;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
        }
        .company-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset Request</h1>
        <p>Notary Information System</p>
    </div>

    <div class="content">
        <p>Hello,</p>

        <p>You have requested to reset your password for the Notary Information System.</p>

        <p>Click the button below to reset your password:</p>

        <p style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
        </p>

        <p><strong>Important:</strong></p>
        <ul>
            <li>This link will expire in 15 minutes for security reasons</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Never share this reset link with anyone</li>
        </ul>

        <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
            {{ $resetUrl }}
        </p>
    </div>

    <div class="footer">
        <p>This is an automated message from the Notary Information System.</p>
        <p>If you have any questions, please contact your system administrator.</p>
        <p>&copy; {{ date('Y') }} Notary Information System. All rights reserved.</p>
    </div>
</body>
</html>
