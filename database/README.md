# Knex DB

## 1. Setup

```
npm install
```

## Environment Variables

Rename `.env.sample` to `.env` and edit the contained variables to match the DB config.

```dosini
NODE_ENV=development # use sqlite
NODE_ENV=production # use mysql
```

## 2. Initialize Database

```
npm run migrate # create the db schema
npm run seed # seed fake data
```
