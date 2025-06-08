# Google Sheets API Setup Guide

This guide will help you set up Google Sheets API integration for your Personal Finance Tracker.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. A Google Sheets document for your financial data

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name (e.g., "Personal Finance Tracker")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API" and then "Enable"

## Step 3: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter a service account name (e.g., "finance-tracker-service")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Private Key

1. In the "Credentials" page, click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" and click "Create"
5. The JSON file will be downloaded to your computer

## Step 5: Create Your Google Sheet

1. Create a new Google Sheet with the following tabs:
   - **Income**: Columns: Source, Amount, Month, Year, Account
   - **Budgeting**: Columns: Category, Type, Color, Allocation, Spent, Month, Year, Account
   - **Spending**: Columns: Date, Description, Amount, Category, Account, Month, Year
   - **Assets**: Columns: Name, Type, Category, Symbol, Shares, Price, Current Value, Target Value, Last Updated
   - **Accounts**: Columns: Name, Type, Balance, Color
   - **Settings**: Columns: Key, Value

2. Share the sheet with your service account email:
   - Click "Share" in the top right
   - Add the service account email (found in the JSON file, looks like: `your-service@project-id.iam.gserviceaccount.com`)
   - Give it "Editor" permissions

## Step 6: Configure Environment Variables

1. Open your `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
# Google Sheets API Configuration
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_PROJECT_ID="your-google-cloud-project-id"

# Your Google Sheets spreadsheet ID (from the URL)
NEXT_PUBLIC_SPREADSHEET_ID="your-actual-spreadsheet-id"

# Optional: Google API Key for additional features
GOOGLE_API_KEY="your-google-api-key"
```

### Finding Your Spreadsheet ID

The spreadsheet ID is found in the URL of your Google Sheet:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

### Formatting the Private Key

The private key from your JSON file needs to have newlines properly escaped:
- Replace actual newlines with `\n`
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- Wrap the entire key in quotes

## Step 7: Restart Your Application

After updating the environment variables:
1. Stop your development server (Ctrl+C)
2. Restart it with `npm run dev`
3. The demo banner should disappear and real data should load

## Sheet Data Format Examples

### Income Sheet
| Source | Amount | Month | Year | Account |
|--------|--------|-------|------|---------|
| Salary | 25000000 | 6 | 2025 | BCA Checking |
| Freelance | 5000000 | 6 | 2025 | BCA Checking |

### Budgeting Sheet
| Category | Type | Color | Allocation | Spent | Month | Year | Account |
|----------|------|-------|------------|-------|-------|------|---------|
| Food & Groceries | needs | #10B981 | 4000000 | 3200000 | 6 | 2025 | BCA Checking |
| Entertainment | wants | #EF4444 | 2500000 | 3100000 | 6 | 2025 | BCA Checking |

### Spending Sheet
| Date | Description | Amount | Category | Account | Month | Year |
|------|-------------|--------|----------|---------|-------|------|
| 2025-06-05 | Supermarket | 750000 | Food & Groceries | BCA Checking | 6 | 2025 |
| 2025-06-08 | Grab Transport | 85000 | Transportation | BCA Checking | 6 | 2025 |

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you've shared the sheet with the service account email
2. **Invalid Credentials**: Double-check that the private key is properly formatted with `\n` for newlines
3. **Sheet Not Found**: Verify the spreadsheet ID in your environment variables
4. **API Not Enabled**: Ensure Google Sheets API is enabled in your Google Cloud Console

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your Google Sheet has the correct column headers
4. Make sure the service account has access to the sheet

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account credentials secure
- Consider using a separate Google account for this integration
- Regularly review and rotate your API credentials

## Sample Data

The application includes realistic sample data when the API is not configured, so you can explore all features before setting up the real integration.
