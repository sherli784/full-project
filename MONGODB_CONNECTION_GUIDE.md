# MongoDB Connection Guide

## 1. MongoDB Compass (GUI)

### Connection String:
```
mongodb://localhost:27017/textile
```

### Steps:
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste this connection string: `mongodb://localhost:27017/textile`
4. Click "Connect"
5. You should see the `textile` database with `users` collection

## 2. MongoDB Shell (Command Line)

### Connect to MongoDB:
```bash
mongosh
```

### Switch to textile database:
```bash
use textile
```

### View collections:
```bash
show collections
```

### View users:
```bash
db.users.find()
```

## 3. Connection Details

- **Host**: localhost
- **Port**: 27017
- **Database**: textile
- **Authentication**: None (local MongoDB)
- **Collections**: users, products, orders, offers

## 4. Verify Connection

### Check if MongoDB is running:
```bash
netstat -ano | findstr :27017
```

### Start MongoDB (if not running):
```bash
# Windows Service
net start MongoDB

# Or manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "C:\data\db"
```

## 5. Application Connection

Your application is already configured to connect to MongoDB through:
- Backend: `mongodb://localhost:27017/textile`
- Environment variable: `MONGODB_URI=mongodb://localhost:27017/textile`

## 6. Common Issues

### If connection fails:
1. Check if MongoDB service is running
2. Verify port 27017 is not blocked
3. Check firewall settings
4. Ensure MongoDB is installed correctly

### If database is empty:
1. Sign up a user through the web app
2. Check `users` collection in MongoDB Compass
3. Data should appear after successful registration
