import axios from "axios";
import dateformat from "dateformat";
import * as env from "dotenv";
import { NOTIFIERS, notifications } from "./notifier.js";
env.config();
const users = [
  {
    id: 1,
    hospitals: [581644, 693527],
    districts: [512],
    email: "nijinaniayth@gmail.com",
    phoneNumber: 839283928392,
    notificationChannels: [NOTIFIERS.MAIL],
  },
];

const registeredDistricts = [512, 600, 735];
const config = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
  },
};
const {
  STATES_ENDPOINT,
  DISTRICT_ENDPOINT,
  SESSION_ENDPOINT,
  RATE_LIMIT,
  API_RATE_INTERVAL_IN_MIN,
} = process.env;

export async function procesSessionData() {
  const districts = await getRegisteredDistricts();
  fireAllSessionDataRequest(districts);
}

async function fireAllSessionDataRequest(districts) {
  console.log(`FIRE ALL SESSION DATA REQUEST: `);
  for (let i = 0; i < districts.length; i++) {
    if (i % RATE_LIMIT === 0 && i !== 0) {
      console.log("INTERVAL...", i);
      await sleep(API_RATE_INTERVAL_IN_MIN * 60 * 1000);
    }
    getSessionDataByDistrict(districts[i]);
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
  const usersList = users.filter((user) =>
    user.districts.includes(district_id)
  );
  return usersList;
}

async function findAvailabilityForUser(user, centers) {
  if (!user.hospitals && user.hospitals.length) {
    return;
  }
  const avaialabilityMap = {};
  for (let centerId of user.hospitals) {
    const center = centers.find((center) => center.center_id === centerId);
    console.log("centers", center);
    const availabilities = center?.sessions?.filter(
      (session) => session.available_capacity > 0
    );
    if (availabilities?.length) {
      avaialabilityMap[centerId] = availabilities;
    }
  }

  notifyUser(user, avaialabilityMap);
}

function notifyUser(user, avaialabilityMap) {
  console.log("NOTIFY USERS", avaialabilityMap);
  if (!Object.keys(avaialabilityMap).length) {
    return;
  }
  for (let channel of user.notificationChannels) {
    const notifier = notifications[channel];
    const message = notifier.createMessage();
    notifier.sendMessage({ message, user });
  }
}

async function getRegisteredDistricts() {
  return registeredDistricts;
}

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

//ignore

export async function getStates() {
  console.log("state,,");
  const res = await axios.get(STATES_ENDPOINT, config);
  const states = res.data;
  return states;
}

async function getAllDistricts(states) {
  console.log(`GET ALL DISTRICTS: `);
  let allDistricts = [];
  for await (const { districts } of states.map((state) =>
    fetchDistricts(state?.state_id)
  )) {
    allDistricts = [...allDistricts, ...districts];
  }
  fireAllSessionDataRequest(allDistricts);
}

async function fetchDistricts(state) {
  console.log("fetching district...");
  const response = await axios.get(`${DISTRICT_ENDPOINT}/${state}`, config);
  const districts = response.data;
  return districts;
}
