import axios from "axios";
import dateformat from "dateformat";
import { notifications } from "./notifier.js";
import { getAllDistricts, findUsersByDistrict } from "./model.service.js";

import * as env from "dotenv";
env.config();
const config = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
  },
};
const { SESSION_ENDPOINT, RATE_LIMIT, API_RATE_INTERVAL_IN_MIN } = process.env;

export async function procesSessionData() {
  const districts = await getAllDistricts();
  fireAllSessionDataRequest(districts);
}

async function fireAllSessionDataRequest(districts) {
  console.log(`FIRE ALL SESSION DATA REQUEST: `);
  for (let i = 0; i < districts.length; i++) {
    if (i % RATE_LIMIT === 0 && i !== 0) {
      console.log("INTERVAL...", i);
      await sleep(API_RATE_INTERVAL_IN_MIN * 60 * 1000);
    }
    getSessionDataByDistrict(districts[i].districtId);
  }
}

async function getSessionDataByDistrict(districtId) {
  const date = new Date();
  const response = await axios.get(SESSION_ENDPOINT, {
    params: {
      district_id: districtId,
      date: dateformat(date, "dd-mm-yyyy"),
    },
    ...config,
  });
  const districtData = response.data;
  processSessionDetails(districtData, districtId);
}

async function processSessionDetails(districtData, district_id) {
  const { centers } = districtData;
  const usersList = await findUsersByCity(district_id);

  usersList.forEach((user) => {
    findAvailabilityForUser(user, centers);
  });
}

async function findUsersByCity(district_id) {
  const usersList = await findUsersByDistrict(district_id);
  return usersList;
}

async function findAvailabilityForUser(user, centers) {
  console.log(user.email, "EMAIL");
  const userSelectedCenters = centers
    .filter((center) => user.hospitals?.includes(center.center_id))
    .map((center) => center.center_id);
  if (!userSelectedCenters || !userSelectedCenters.length) {
    const avaialabilityMap = getAvailableCenters(
      centers.map((center) => center.center_id),
      centers
    );
    notifyUser({ user, ...avaialabilityMap });
    return;
  }
  const avaialabilityMap = getAvailableCenters(userSelectedCenters, centers);
  notifyUser({ user, ...avaialabilityMap });
}

function notifyUser({ user, centers, dates }) {
  console.log("NOTIFY USERS", dates);
  if (!centers.length) {
    return;
  }
  for (let channel of user.notificationChannels) {
    const notifier = notifications[channel];
    notifier.sendMessage({ dates, centers, user, getSessionByDate });
  }
}

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

function getAvailableCenters(userPreference, centers) {
  let avaiableCenters = [];
  let uniqueDates = [];
  for (let centerId of userPreference) {
    const center = centers.find((center) => center.center_id === centerId);
    const availabilities = center?.sessions.filter(
      (session) => session.available_capacity > 0
    );
    if (availabilities?.length) {
      const availableDates = availabilities
        .filter((session) => !uniqueDates.includes(session.date))
        .map((session) => session.date);
      uniqueDates = [...uniqueDates, ...availableDates];
      avaiableCenters = [...avaiableCenters, center];
    }
  }
  return { centers: avaiableCenters, dates: uniqueDates.sort() };
}

function getSessionByDate({ date, center }) {
  const session = center?.sessions?.filter((session) => session.date === date);
  console.log("SESSION:", session);
  return session || {};
}
