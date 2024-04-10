// src/apiService.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: any) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const signup = async (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { name, email, password });
};

export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const fetchUserProfile = async () => {
  return apiClient.get(`/profile`);
};

export const authorizeShopify = async (code: string, shopName: string) => {
  return apiClient.post(`/shopify/auth`, { code, shop: shopName });
};

export const authorizeGoogle = async (code: string) => {
  return apiClient.post(`/google/auth`, { code });
};

export const GetShopifyProducts = async () => {
  return apiClient.get(`/shopify/products`);
};

export const CreateSheet = async (name: string) => {
  return apiClient.post(`/google/sheets`, { name });
};

export const GetSheets = async () => {
  return apiClient.get(`/google/sheets`);
};

export const AddtoSheet = async (spreadsheet_id: string, data: any, choice: any) => {
  return apiClient.post(`/google/sheets/update`, {
    spreadsheet_id,
    data,
    choice,
  });
};
