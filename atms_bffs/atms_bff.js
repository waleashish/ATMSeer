// ATMSeer Server API connections

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


const API_ENDPOINT = 'http://localhost:5000'; // Your API endpoint here

// Function to upload new dataset
async function uploadDataset(datasetPath) {
    let data = new FormData();
    data.append('file', fs.createReadStream(datasetPath));

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/new_dataset`,
        headers: {
            ...data.getHeaders()
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get datasets
async function getDatasets() {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/datasets`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function to get dataset by id
async function getDatasetById(datasetId) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/datasets/${datasetId}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}
async function getDataRunByDatasetId(datasetId) {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/dataruns?dataset_id=${datasetId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get configs
async function getConfigs() {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/configs`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get classifier summary by datarun_id
async function getClassifierSummary(datarunId) {
    try {
        const response = await axios.get(`${API_ENDPOINT}/api/classifier_summary`, {
            params: {
                datarun_id: datarunId
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/classifier_summary?datarun_id=${datarunId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get classifiers by datarun_id and status can be used without status too
// Use status complete
async function getClassifiers(datarunId, status) {
    const axios = require('axios');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/classifiers?datarun_id=${datarunId}&status=${status}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get hyperpartitions by datarun_id
async function getHyperpartitions(datarunId) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/hyperpartitions?&datarun_id=${datarunId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function to create new datarun
async function createNewDatarun(configData, datarunId) {
    let data = new FormData();
    data.append('configs', JSON.stringify(configData));

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/new_datarun/${datarunId}`,
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}

// Function to get recommendation by datarun_id
async function getRecommendation(datarunId) {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/getRecommendation/${datarunId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function to start worker by datarun_id
async function startWorker(datarunId) {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/start_worker/${datarunId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function to stop worker by datarun_id
async function stopWorker(datarunId) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_ENDPOINT}/api/stop_worker/${datarunId}`,

    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}



// Call the functions as needed
// uploadDataset('./../Datasets/pollution.csv');
// getDatasets();
// getDatasetById(1);
// getDataRunByDatasetId(1)
// getConfigs();
// getClassifierSummary(1);
// getClassifiers(1, "complete");
// getHyperpartitions(1);
// const config = {
//     methods: ["rf","knn","svm","dt","pa","logreg","bnb","mlp","ada","mnb","gp","gnb","sgd","et"],
//     budget: 1000,
//     r_minimum: 2,
//     k_window: 5,
//     gridding: 0,
//     metric: "f1",
//     selector: "bestk",
//     budget_type: "classifier",
//     tuner: "gp",
//     priority: 1
// };
// createNewDatarun(config,1);
// getRecommendation(1);
// startWorker(1);
// stopWorker(1);



// Useful APIS
// uploadDataset('./../Datasets/pollution.csv');
// getDatasets();
// getDatasetById(1);

// Creating Datarun config
// const config = {
//     methods: ["rf","knn","svm","dt","pa","logreg","bnb","mlp","ada","mnb","gp","gnb","sgd","et"],
//     budget: 1000,
//     r_minimum: 2,
//     k_window: 5,
//     gridding: 0,
//     metric: "f1",
//     selector: "bestk",
//     budget_type: "classifier",
//     tuner: "gp",
//     priority: 1
// };
// createNewDatarun(config,1);

// getHyperpatitions(1);