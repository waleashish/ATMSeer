const axios = require('axios');

const API_ENDPOINT = 'http://localhost:5555'; // Update with your API endpoint

// Function to handle errors
const handleError = (error) => {
    console.error('Error:', error.message);
};

// Test data for POST /api/datasets
const testData = {
    class_column: 'class',
    train_path: '/app/atm/demos/pollution.csv'
};

// Test POST /api/datasets
const testUploadDataset = async () => {
        const response = await axios.post(`${API_ENDPOINT}/api/datasets`, testData);
        console.log('POST /api/datasets Response:', response.data);
        expect(response.status).toBe(201); // Assuming successful response status
        const datasetId = response.data.id; // Assuming the response contains an ID
        await testGetDatasetById(datasetId);

    
};

// Function to test GET /api/datasets/:id
async function testGetDataset() {
        const response = await axios.get(`${API_ENDPOINT}/api/datasets`);
        console.log('GET /api/datasets Response:', response.data);
        expect(response.status).toBe(200); // Assuming successful response status

    
}

// Function to test GET /api/datasets/:id
async function testGetDatasetById(datasetId) {
        const response = await axios.get(`${API_ENDPOINT}/api/datasets/${datasetId}`);
        console.log('GET /api/datasets/:id Response:', response.data);
        expect(response.status).toBe(200); // Assuming successful response status

    
}

// Function to test POST /api/run
async function testCreateDatasetRun(datasetId) {
        const testDataRun = {
            dataset_id: datasetId
        };
        const response = await axios.post(`${API_ENDPOINT}/api/run`, testDataRun);
        console.log('POST /api/run Response:', response.data);
        expect(response.status).toBe(200); // Assuming successful response status

    
}

// Function to test GET /api/datasets/:id/dataruns
async function testGetDatasetRuns(datasetId) {
        const response = await axios.get(`${API_ENDPOINT}/api/datasets/${datasetId}/dataruns`);
        console.log('GET /api/datasets/:id/dataruns Response:', response.data);
        expect(response.status).toBe(200); // Assuming successful response status
}

// Run additional tests
test('getDataset', testGetDataset);
test('createDatasetRun', async () => {
    await testCreateDatasetRun(1); // Assuming datasetId 1
});
test('getDatasetRuns', async () => {
    await testGetDatasetRuns(1); // Assuming datasetId 1
});
test('uploadDataset', async () => {
    await testUploadDataset();
});