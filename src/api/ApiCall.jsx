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

  export const getTransactionDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetTransactionDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetTransactionDetails',error);
    }
  };

  export const deleteTransaction = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}DeleteTransaction`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteTransaction',error);
    }
  };

  export const getMasters = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetMasters`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetMasters',error);
    }
  };