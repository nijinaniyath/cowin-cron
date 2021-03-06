import axios from "axios";
import dateformat from "dateformat";
import { notifications } from "./notifier.js";
import logger from "./logger.js";
import {
  getAllDistricts,
  findUsersByDistrict,
  updateNotifiedOn,
} from "./model.service.js";

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
  logger.info("Get all session details...");
  fireAllSessionDataRequest(districts);
}

async function fireAllSessionDataRequest(districts) {
  logger.info("Get districts details...");
  for (let i = 0; i < districts.length; i++) {
    if (i % RATE_LIMIT === 0 && i !== 0) {
      await sleep(API_RATE_INTERVAL_IN_MIN * 60 * 1000);
    }
    try {
      const districtData = await getSessionDataByDistrict(
        districts[i].districtId
      );
      await processSessionDetails(
        districtData,
        districts[i].districtId
      ).catch((err) => logger.error("PROCESS SESSION DATA ERROR", err));
    } catch {
      logger.error("SESION BY DIDTRICT ERROR", err);
    }
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
  logger.info(`Get session by districts details...${districtId}`);
  return districtData;
}

async function processSessionDetails(districtData, district_id) {
  const { centers } = districtData;
  const usersList = await findUsersByCity(district_id);
  logger.info("Get users");
  usersList.forEach((user) => {
    findAvailabilityForUser(user, centers).catch((err) => {
      logger.error("ERROR", err);
    });
  });
}

async function findUsersByCity(district_id) {
  const usersList = await findUsersByDistrict(district_id);
  return usersList;
}

async function findAvailabilityForUser(user, centers) {
  const userSelectedCenters = centers
    .filter((center) => user.hospitals?.includes(center.center_id))
    .map((center) => center.center_id);
  if (!userSelectedCenters || !userSelectedCenters.length) {
    const avaialabilityMap = getAvailableCenters(
      centers.map((center) => center.center_id),
      centers,
      user
    );
    notifyUser({ user, ...avaialabilityMap });
    return;
  }
  const avaialabilityMap = getAvailableCenters(
    userSelectedCenters,
    centers,
    user
  );
  notifyUser({ user, ...avaialabilityMap });
}

async function notifyUser({ user, centers, dates }) {
  if (!centers.length) {
    return;
  }
  try {
    await updateNotifiedOn(user, centers);
    for (let channel of user.notificationChannels) {
      const notifier = notifications[channel];
      notifier.sendMessage({ dates, centers, user, getSessionByDate });
    }
  } catch {
    for (let channel of user.notificationChannels) {
      const notifier = notifications[channel];
      notifier.sendMessage({ dates, centers, user, getSessionByDate });
    }
  }
}

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

function getAvailableCenters(userPreference, centers, user) {
  let avaiableCenters = [];
  let uniqueDates = [];
  for (let centerId of userPreference) {
    if (user.notifiedCenters && user.notifiedCenters?.includes(centerId)) {
      continue;
    }
    const center = centers.find((center) => center.center_id === centerId);
    const availabilities = center?.sessions?.filter(
      (session) => session.available_capacity > 3
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
  const session = center?.sessions?.find((session) => session.date === date);
  return session || {};
}
