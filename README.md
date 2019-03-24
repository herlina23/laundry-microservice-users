# Microservice-Users
## Endpoints

### User (/api/v1/users)

#### Get all users
```bash
GET / 
# authorization: all
# Return
# {
#    "create_date": "2019-02-25T07:45:00.043Z",
#    "_id": "5c739d5f0f64700ff05ed8aa",
#    "username": "kasir",
#    "password": "$2a$10$VPNX.iae8jR4tlkRwL3DG.pZnkpDS9/zRay7xnVzeC6k85FtiCGgK",
#    "role": "kasir",
#    "__v": 0
# }
```

#### Get a user
```bash
GET /:id
# authorization: all
```

#### Create a user
```bash
POST /
# authorization: admin
# Request Sample
# {
#   "user": {
#       "username": "kasir2",
#       "role": "kasir",  #enum['admin', 'kasir']
#       "password": "kasir"
#   }
# }
```

#### Update a user
```bash
PUT /
# authorization: admin and kasir
```

#### Delete a user
```bash
DELETE /:id
# authorization: admin
```

#### Login user
```bash
POST /login
# authorization: all

# Request sample
# {
#   "user": {
#       "username": "kasir2",
#       "password": "kasir"
#   }
# }

# Return
# {
#  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Yzc1NDljOTQwMDAzNTMwNjgwYmYwYjIiLCJpYXQiOjE1NTExOTA3Mzl9.wQTP2TlW-Z6tHJpl1GffImfCAYdRXsqHKcHJmhDWg4o"
# }
```

# Microservice-Users
## Endpoints

### Salary (/api/v1/salaries)

#### Get all salaries
```bash
GET / 
# authorization: admin
# Return
# {
#      "date": "2019-02-26T14:27:28.291Z",
#       "_id": "5c754d70cdc37b3700bfbe05",
#       "user": {
#           "create_date": "2019-02-25T07:45:00.043Z",
#           "_id": "5c739d5f0f64700ff05ed8aa",
#           "username": "kasir",
#           "password": "$2a$10$VPNX.iae8jR4tlkRwL3DG.pZnkpDS9/zRay7xnVzeC6k85FtiCGgK",
#           "role": "kasir",
#           "__v": 0
#       },
#       "total": 1000000,
#       "__v": 0
# }
```

#### Get a salary
```bash
GET /:id
# authorization: admin
```

#### Create a salary
```bash
POST /
# authorization: admin
# Request Sample
# {
#   "salary": {
#       "user": "5c739d5f0f64700ff05ed8aa",
#       "total": 1000000
#   }
# }
```

#### Update a salary
```bash
PUT /
# authorization: admin
```

#### Delete a salary
```bash
DELETE /:id
# authorization: admin
```