# QR Studio

QR Studio is a fullstack web application that allows users to generate
customizable QR codes and save generation history.

## Features

- Generate QR codes from text or URL
- Customize QR size and colors
- Save QR generation history
- REST API for managing QR records

## Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Node.js
- Express

Database:
- SQLite

ORM:
- Prisma

## Project structure

backend/
- Express server
- Prisma ORM
- SQLite database

frontend/
- React application

docs/
- design.md
- architecture notes

## Run backend

cd backend
npm install
npm run dev

Server will run at:
http://localhost:5000