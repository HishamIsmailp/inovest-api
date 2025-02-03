export const welcomePage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investment Platform API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
        }

        .container {
            max-width: 1000px;
            width: 100%;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            padding: 2rem;
            margin: 2rem 0;
        }

        h1 {
            color: #2d3748;
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 2.5rem;
        }

        .status {
            background: #48bb78;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            display: inline-block;
            margin-bottom: 2rem;
        }

        .endpoints {
            background: #f7fafc;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1rem 0;
        }

        .endpoint-group {
            margin-bottom: 2rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 1rem;
        }

        .endpoint-group:last-child {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
        }

        h2 {
            color: #4a5568;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        h2::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 1em;
            background: #4299e1;
            border-radius: 2px;
        }

        .endpoint {
            margin-bottom: 0.75rem;
            padding: 0.75rem;
            border-radius: 8px;
            background: white;
            border: 1px solid #e2e8f0;
            transition: all 0.2s;
        }

        .endpoint:hover {
            transform: translateX(5px);
            border-color: #bee3f8;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            margin-right: 0.75rem;
            font-size: 0.875rem;
            font-weight: 600;
            min-width: 65px;
            text-align: center;
        }

        .get { background: #ebf8ff; color: #2b6cb0; }
        .post { background: #f0fff4; color: #2f855a; }
        .put { background: #fffaf0; color: #9c4221; }
        .delete { background: #fff5f5; color: #c53030; }

        .route-path {
            font-family: 'Monaco', 'Consolas', monospace;
            color: #4a5568;
        }

        footer {
            text-align: center;
            margin-top: 2rem;
            color: #4a5568;
        }

        .auth-required {
            font-size: 0.75rem;
            background: #edf2f7;
            color: #718096;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            margin-left: 0.5rem;
            vertical-align: middle;
        }

        @media (max-width: 768px) {
            .container {
                margin: 1rem;
                padding: 1rem;
            }

            h1 {
                font-size: 2rem;
            }

            .endpoint {
                padding: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Investment Platform API</h1>
        <div style="text-align: center;">
            <span class="status">API is Online</span>
        </div>

        <div class="endpoints">
            <div class="endpoint-group">
                <h2>Authentication</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/auth/signup</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/auth/login</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/auth/refresh-token</span>
                </div>
            </div>

            <div class="endpoint-group">
                <h2>Categories</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/category</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/category</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/category/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/category/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="route-path">/api/category/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
            </div>

            <div class="endpoint-group">
                <h2>Entrepreneur</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/entrepreneur/ideas</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/entrepreneur/ideas/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="route-path">/api/entrepreneur/ideas/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/entrepreneur/ideas</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/entrepreneur/ideas/:id/status</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/entrepreneur/notifications</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/entrepreneur/chats</span>
                    <span class="auth-required">Auth Required</span>
                </div>
            </div>

            <div class="endpoint-group">
                <h2>Investor</h2>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/categories</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/ideas/top</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/categories/:id/ideas</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/ideas/:id</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/investor/ideas/:id/rate</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/investor/ideas/:id/interest</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/interests</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/investor/chats</span>
                    <span class="auth-required">Auth Required</span>
                </div>
            </div>

            <div class="endpoint-group">
                <h2>Common</h2>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/profile</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/profile</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/profile/role</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/chats/:id/messages</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/chats/:id/messages</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="route-path">/api/notifications</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="route-path">/api/notifications/:id/read</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/payments/create</span>
                    <span class="auth-required">Auth Required</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="route-path">/api/payments/verify</span>
                    <span class="auth-required">Auth Required</span>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>© 2024 Investment Platform API Documentation</p>
    </footer>
</body>
</html>
`;
