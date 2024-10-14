const emailSignupTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            background-color: #ffffff;
        }
        .email-header, .email-footer {
            text-align: center;
            padding: 10px;
            background-color: #aedfe3;
            color: #ffffff;
        }
        .email-header {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .email-footer {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .email-content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4FC0E8;
            text-decoration: none;
            border-radius: 5px;
        }
        .logo {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo img {
            margin-right: 10px;
            height: 40px;
        }
        .logo span {
            align-self: center;
            font-size: 24px;
            font-weight: bold;
            color: #333333;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">
                <a href="https://grupovertice.com" class="flex mr-4">
                    <img src="https://grupovertice.com/wp-content/uploads/2022/09/cropped-isotipo_vertice_cuadrado-300x300.png" class="mr-3 h-8" alt="Vertice Logo" />
                </a>
            </div>
            <h1>Welcome to Vertice Studio!</h1>
        </div>
        <div class="email-content">
            <p>Hello {{username}},</p>
            <p>Welcome to {{my_company}}! We are thrilled to have you join our community. Your registration marks the beginning of an exciting journey, and we can't wait to see all the incredible things you'll achieve with our service.</p>
            <p>To get started and unlock all the features we have to offer, please verify your email address by clicking the button below:</p>
            <a href="{{verification_link}}" class="button">Verify Email</a>
            <p>If you did not create this account, you can ignore this email or contact our support team.</p>
            <p>Thank you for choosing us. We are here to support you every step of the way.</p>
            <p>Warm regards,<br>{{my_company}} Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 {{my_company}}. All rights reserved.</p>
            <p>{{company_address}}</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = { emailSignupTemplate };