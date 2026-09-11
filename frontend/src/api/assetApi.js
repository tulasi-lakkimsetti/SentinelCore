import API from "./axiosConfig";

const ASSET_API = "/assets";
const DASHBOARD_API = "/dashboard";

export const getAllAssets = () => {
  return API.get(ASSET_API);
};

export const createAsset = (asset) => {
  return API.post(ASSET_API, asset);
};

export const getDashboardSummary = () => {
  return API.get(`${DASHBOARD_API}/summary`);
};

export const searchAssets = (search, status) => {
  return API.get(`${ASSET_API}/search`, {
    params: {
      search,
      status
    }
  });
};