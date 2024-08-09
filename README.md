# NutriSnap
## Functionality:
NutriSnap simplifies the monitoring of nutrient intake, tracking calories, proteins, carbs, etc, consumed over different periods (day, week, month). Users can simply capture a picture of a nutritional label or the item itself, and NutriSnap will perform image analysis to calculate the nutrient intake from that meal.

## Backend Resources Used: 
### Google Firebase Authentication
Google Firebase Authentication allows individuals to create an account to access the application. It works in tandem with AWS to store user information based on their email addresses.

### Amazon Web Services
#### AWS RDS:
Supports a MySQL Database on the cloud (Check SQL code for database details).
#### AWS EC2: 
Hosts a Golang server which communicates with the frontend to handle requests. It has access to the private database to send/receive data.
#### Network Configuration:
- A custom VPC with both public and private subnets.
- The EC2 instance is in the public subnet, configured with strict security group settings.
- The database is kept in the private subnet to maintain security.

### Python Flask - 
The Flask server receives image data from the frontend, preprocesses it, and sends it to third-party APIs for analysis. Note that this server is meant for testing purposes rather than deployment.

### Azure Vision - 
Azure's OCR technology is used to extract relevant text from nutrition labels. Since the number of calories is usually extracted inaccurately due to the formatting of labels, the frontend has features that allow users to confirm and adjust extracted measurements.

## Final Notes: 
This project was primarily undertaken to learn and master new skills/tools, not for deployment. To run/experiment with this project yourself, you must set up your own Azure cloud instance, AWS resources, and Google Firebase instance and add the relevant information to a .env file. The necessary code is available in this repository.
