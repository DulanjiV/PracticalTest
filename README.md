# Setting Up the Database for PracticalTest

## Create the Database
Run the following command to create a new database named StudentDB:

```
CREATE DATABASE StudentDB;
GO
```
```
USE StudentDB;
GO
```

## Configure the Connection String
Update the appsettings.json file in your project to include the connection string for your local database. Example:

```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME\\SQLEXPRESS;Database=StudentDB;Trusted_connection=true;TrustServerCertificate=true;"
  }
}`
```

## Automatically Create Tables
Ensure your models and ApplicationDbContext are properly defined in your project. The Entity Framework will use these models and ApplicationDbContext to create tables in the database.

## Install EF Core NuGet Packages
In the Package Manager Console:
```
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
```

## Run Migrations
To create and apply migrations:

- Create a migration using the following command (replace Initial with your desired migration name):

```
Add-Migration Initial
```

- Apply the migration to update the database:

```
Update-Database
```

After running these commands, the required tables will be automatically created in the database.
