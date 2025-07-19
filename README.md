# CoffeeBase

## Background
Coffee + Database = CoffeeBase

With the rapid growth of the coffee industry, more customers want detailed information about their coffee—such as blend (origin, type), farm, roastery, and restaurant. For coffee connoisseurs, the lack of documentation about coffee origins and types often deters them from making purchases. CoffeeBase aims to help businesses better market their drinks and beans, opening up commercial coffee to specialty coffee markets, and to help determine consumer patterns for better pricing.

## Motivation
CoffeeBase is designed to track coffee entities and provide services for two user types:

- **Customers:** Search for coffee information by selecting tables (e.g., blend, farm, roastery, restaurant).
- **Business Owners:** Manage the database by creating, editing, and deleting data, appealing to coffee connoisseurs.

Users can track their cup of coffee from its origin, through the roasting process, to the blend and restaurant.

## Features
- **User Authentication:** Login and registration for customers and business owners.
- **Role-Based UI:** Customers can search; business owners can manage data.
- **CRUD Operations:** Business owners can add, edit, and delete entities.
- **Supply Chain Tracking:** Trace coffee from farm to cup.
- **Secure Database Access:** All database operations use stored procedures to prevent SQL injection.

## Technical Challenges
- **SQL Injection Warnings:** Using the column name `price` caused issues with some SQL servers and JavaScript, triggering injection attack warnings.
- **Auto-Incremented IDs:** Testing with auto-incremented primary keys sometimes violated referential integrity.
- **CSV Parsing Issues:** CSV files with addresses containing commas and row splits using `\r\n` led to incorrect parsing and data splits.

## Entity Relationship Diagram

*(See project files for ER diagram)*

### Key Entities
- **Business:** (Name, Location, Contact) - Supertype for Farm, Roastery, Restaurant
- **Farm:** Produces Beans
- **Beans:** (BeanID, Breed)
- **Roastery:** Roasts Beans, Makes Blend
- **Blend:** (BlendID, Name, Origin, Flavor)
- **Restaurant:** Brews Drink
- **Drink:** (DrinkID, Name, Price)
- **Customer:** (ID, Location)

### Relationships
- Farms produce beans.
- Beans are roasted by roasteries.
- Roasteries make blends.
- Blends are sold to restaurants and customers.
- Restaurants brew drinks.
- Drinks are sold to customers.

## Database Design
- **Stored Procedures:** All data operations (insert, update, delete, select) use stored procedures for security.
- **Referential Integrity:** Maintained via primary and foreign keys, with cascade policies for updates/deletes.
- **Domain Integrity:** Enforced by front-end validation.
- **No Supplemental Indexes:** Composite keys and frequent CRUD operations make additional indexing unnecessary.

## Setup Instructions
1. **Clone the repository:**
   ```zsh
   git clone https://github.com/Jaden24/coffeebase.git
   ```
2. **Install dependencies:**
   ```zsh
   cd coffeebase-project/workspace/CoffeeBase
   npm install
   ```
3. **Configure Firebase and SQL Server:**  
   Update `firebase.json` and database connection settings in `server.js`.
4. **Run the server:**
   ```zsh
   node server.js
   ```
5. **Access the web app:**  
   Open `index.html` in your browser.

## Glossary
- **Front-End:** User interface and interaction code.
- **Back-End:** Server-side code and database queries.
- **Stored Procedure:** Precompiled SQL query.
- **Entity Integrity:** Ensures unique rows.
- **Referential Integrity:** Ensures proper table references.
- **ER Diagram/Relational Schema:** Visual representation of database structure.
- **SQL:** Database query language.
- **Index:** Data sorting for efficient searches.