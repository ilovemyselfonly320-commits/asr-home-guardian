# ESP32 Home Automation Backend

This directory contains the sample API files for the ESP32 home automation system.

## Setup Instructions

1. **Upload PHP Files to Your Server:**
   - Copy all PHP files (`get_status.php`, `send_command.php`, `update_status.php`, etc.) to your web server
   - Ensure your server supports PHP and MySQL

2. **Configure Database:**
   - Update `db_config.php` with your MySQL credentials
   - Create the required database and tables

3. **Update API URL:**
   - In `src/services/api.ts`, replace `API_BASE_URL` with your actual server URL
   - Example: `https://your-domain.com/api`

4. **File Permissions:**
   - Ensure PHP files have proper write permissions for JSON files
   - Set appropriate permissions for `device_status.json` and `device_commands.json`

## API Endpoints

- `GET get_status.php?device_id=E1` - Get device status
- `POST send_command.php` - Send command to device
- `POST update_status.php` - Update device status (used by ESP32)
- `GET get_command.php?device_id=E1` - Get pending commands (used by ESP32)
- `GET test.php?action=test` - Test API connection

## ESP32 Integration

Your ESP32 devices should:
1. Poll `get_command.php` regularly to check for new commands
2. Execute received commands (LIGHT_ON, LIGHT_OFF, FAN_ON, FAN_OFF, etc.)
3. Report status updates using `update_status.php`
4. Report sensor data (door status, etc.) using `update_status.php`

## Security Notes

- Implement proper authentication for production use
- Use HTTPS for all API communications
- Consider rate limiting and input validation
- Secure your database credentials