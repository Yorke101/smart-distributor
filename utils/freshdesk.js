require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DOMAIN = process.env.FRESHDESK_DOMAIN;
const API_KEY = process.env.FRESHDESK_API_KEY;
const RECRUITER_IDS = process.env.RECRUITER_IDS.split(',').map(Number);
let recruiterIndex = 0;

function getNextRecruiterId() {
  const id = RECRUITER_IDS[recruiterIndex];
  recruiterIndex = (recruiterIndex + 1) % RECRUITER_IDS.length;
  return id;
}

async function createContact(contact) {
  const ownerId = getNextRecruiterId();
  const payload = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    owner_id: ownerId,
    tags: ['auto-assigned', 'campaign_2025']
  };

  try {
    const response = await axios.post(`https://${DOMAIN}/api/v2/contacts`, payload, {
      auth: {
        username: API_KEY,
        password: 'X'
      }
    });

    logAssignment(contact.name, ownerId);
    return response.data;
  } catch (error) {
    console.error(`? Error creating ${contact.name}:`, error.response?.data || error.message);
    return null;
  }
}

function logAssignment(name, ownerId) {
  const logPath = path.join(__dirname, '../logs/assignments.log');
  const entry = `${new Date().toISOString()} - ${name} ? Recruiter ${ownerId}\n`;
  fs.appendFileSync(logPath, entry);
}

module.exports = { createContact };
