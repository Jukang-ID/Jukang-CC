# Jukang-CC
## Table of Contents
1. [What is Jukang ID?](#what-is-jukangid)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
4. [Jukang Team CC](#team-jukang-cc)
## What is Jukang ID?
Jukang ID is an Application to helps homeowners in Indonesia easily find reliable handymen for repairs, construction, or renovations. Many people struggle with uncertainties around pricing, quality, and availability when relying on personal recommendations. Our application solves this by connecting users to professional handymen, providing clear details about skills, availability, ratings, and pricing, making the process faster and more reliable.
## Installation
### Step 1: Clone the Repository
```bash
git clone https://github.com/Jukang-ID/Jukang-CC.git
```
### Step 2: Install Dependencies
```bash
npm install
```
## Running the Project
### Start the Server
```bash
npm start
```
### Development Mode
```bash
npm run start:dev
```
The server will be accessible at `http://0.0.0.0:8080`.
## API Endpoints
- **Register**: `POST/register`
- **Get All users**: `GET/register`
- **Add tukang**: `POST/tukang`
- **Get All tuknag**: `GET/tukang`
- **Get data beranda**: `GET//tukang/{users_id}`
- **Update data tukang**: `/tukang/{tukang_id}`
- **Detail profile user**: `/detailprofile/{user_id}`
- **Search**: `/search`
- **Login**: `/users/login`
- **add Transaksi**: `/addtransaksi`
- **GET Transaksi**: `/transaksi/{id_transaksi}`
- **Riwayat Transaksi**: `/riwayat/{user_id}`
- **GET Detail Tukang**: `/detailtukang/{tukang_id}`
- **GET Detail Transaksi**: `/detailtransaksi/{id_transaksi}`
- **Get Tukang by Lokasi**: `/tukangbylokasi`

## Team Jukang ID - CC

| Bangkit ID       | Name               | Learning Path       | University                          | LinkedIn |
|------------------|--------------------|---------------------|-------------------------------------|----------|
| c529b4ky1707    | Hanif Fahruddin   | Cloud Computing     | Politeknik Negeri Pontianak | [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hanif-fahruddin-bb3646330/) |
| C529B4KY0633    | Ariel Wira Ramadhan	  | Cloud Computing     | Politeknik Negeri Pontianak | [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ariel-wira-ramadan-135a76330/) |
---
# Note that code in this repository is dummy because our actual repo containing secret so we need to private it
