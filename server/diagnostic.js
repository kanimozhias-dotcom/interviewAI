import dns from 'dns/promises';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

const hostname = uri.match(/mongodb\+srv:\/\/(?:[^:]+:[^@]+@)?([^/?]+)/)[1];

async function runDiagnostics() {
  console.log("=== MongoDB Diagnostic Report ===");
  console.log(`Node.js Version: ${process.version}`);
  
  try {
    const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
    console.log(`Mongoose version in package.json: ${pkg.dependencies.mongoose}`);
    
    const mongoosePackage = JSON.parse(readFileSync('./node_modules/mongoose/package.json', 'utf8'));
    console.log(`Installed Mongoose version: ${mongoosePackage.version}`);
    
    const mongodbPackage = JSON.parse(readFileSync('./node_modules/mongodb/package.json', 'utf8'));
    console.log(`Installed MongoDB driver version: ${mongodbPackage.version}`);
  } catch (e) {
    console.log("Could not read package versions", e.message);
  }

  console.log(`\n--- Testing DNS SRV Resolution for ${hostname} ---`);
  try {
    const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
    console.log("SRV Records found:");
    console.log(srvRecords);
  } catch (err) {
    console.error("DNS SRV Resolution FAILED:", err.message);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'SERVFAIL') {
      console.log(">> Diagnostic: This is a DNS issue. Your mobile hotspot or ISP is likely blocking or failing on SRV queries.");
    }
  }

  console.log(`\n--- Testing Mongoose Connection (Standard) ---`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("Standard connection SUCCEEDED.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Standard connection FAILED:", err.message);
  }

  console.log(`\n--- Testing Mongoose Connection (family: 4) ---`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000, family: 4 });
    console.log("Connection with family: 4 SUCCEEDED.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Connection with family: 4 FAILED:", err.message);
  }
}

runDiagnostics();
