// ATMSeer Server API connections

import axios from "axios";
import FormData from "form-data";
// import fs from "fs";

const API_ENDPOINT = "http://localhost:8081"; // Your API endpoint here

const requestFunc = async (config: any) => {
  try {
    const response = await axios.request(config);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to upload new dataset
const uploadDataset = async (formData: any) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/new_dataset`,
    // headers: {
    //   ...formData.getHeaders(),
    // },
    data: formData,
  };

  return requestFunc(config);
};

// Function to get datasets
const getDatasets = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/datasets`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return requestFunc(config);
};

// Function to get dataset by id
const getDatasetById = async (datasetId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/datasets/${datasetId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return requestFunc(config);
};

// Function to get dataset file
const getDatasetFile = async (datasetId: number, train = true) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/dataset_file/${datasetId}`,
    params: {
      train: train
    }
  };

  return requestFunc(config);
};

const getDataRunByDatasetId = async (datasetId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/dataruns?dataset_id=${datasetId}`,
  };

  return requestFunc(config);
};

// Function to get configs
const getConfigs = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/configs`,
  };

  return requestFunc(config);
};

// Function to get classifier summary by datarun_id
const getClassifierSummary = async (datarunId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/classifier_summary?datarun_id=${datarunId}`,
  };
  
  return requestFunc(config);
};

// Function to get classifiers by datarun_id and status can be used without status too
// Use status complete
const getClassifiers = async (datarunId: Number, status: string = "complete") => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/classifiers?datarun_id=${datarunId}&status=${status}`,
  };

  return requestFunc(config);
}

// Function to get hyperpartitions by datarun_id
const getHyperpartitions = async (datarunId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/hyperpartitions?&datarun_id=${datarunId}`,
  };
  
  return requestFunc(config);
}

// Function to create new datarun
const createNewDatarun = async (configData: any, datasetId: Number) => {
  const data = new FormData();
  data.append("configs", JSON.stringify(configData));

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/new_datarun/${datasetId}`,
    data: data,
  };

  return requestFunc(config);
}

// Function to get recommendation by datarun_id
const getRecommendation = async (datarunId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/getRecommendation/${datarunId}`,
  };

  return requestFunc(config);
}

// Function to start worker by datarun_id
const startWorker = async (datarunId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/start_worker/${datarunId}`,
  };

  return requestFunc(config);
}

// Function to stop worker by datarun_id
const stopWorker = async (datarunId: Number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_ENDPOINT}/api/stop_worker/${datarunId}`,
  };

  return requestFunc(config);
}

const explainableAPI = async (datasetPath: string, algorithm: string) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:5000/get_shap_values`,
    data: {
      datasetPath: datasetPath,
      algorithm: [algorithm]
    }
  };

  return requestFunc(config);
}


export {
  uploadDataset,
  getDatasets,
  getDatasetById,
  getDatasetFile,
  getDataRunByDatasetId,
  getConfigs,
  getClassifierSummary,
  getClassifiers,
  getHyperpartitions,
  createNewDatarun,
  getRecommendation,
  startWorker,
  stopWorker,
  explainableAPI,
};