import axios from "axios"
import { baseUrl } from "./baseUrl";

export const getLogin = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}UserLogin`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('UserLogin',error);
    }
  };

  export const getMenu = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetMenu`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetMenu',error);
    }
  };

  export const getDocSettings = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetDocSettings`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetDocSettings',error);
    }
  };

  export const getTransactionSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetTransactionSummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetTransactionSummary',error);
    }
  };