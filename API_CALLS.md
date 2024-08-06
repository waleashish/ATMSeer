# plots

1. feature distribution vertical bargraph
2. overview horizontal bargraph
3. trials vertical bargraph with line indicating highest F1 score
4. Algorithms horizonatal bargraph
5. hyperpartitions vertical bargraph with animation
6. hyperparameters scatter plot with area graph having interaction to select a particular subset


# steps

1. Upload dataset -> on upload button clic
	1. called `/api/new_dataset` `uploadDataset()`
	2. `/api/datasets` `getDatasets()` -> selects first dataset from the list and displays it on side panel
	3. `/api/dataruns?dataset_id=2` `getDataRunByDatasetId()` -> selects first datarun from the list. Dataset id is grabbed from above seleciton

2. Creating a new datarun -> on + button click
	1. `getConfigs()` -> fetches default config, and gives option to modify it
	2. `createNewDataRun()` -> creates new datarun with the above config
	3. `getDataRunByDatasetId()` -> get a list of all the dataruns associated with the given id, and selects the first one to show

3. Running Datarun -> on Run button click
	1. `startWorker(datarunId)` -> starts datarun worker

4. Stopping Datarun -> on Stop button click
	1. `stopWorker(datarunId)` -> stops datarun worker

5. Changing Datarun -> from dropdown
  1. `getDataRunbyDatasetid()` -> gets datarun
  2. `getClassifiers(dataRunid and status complete)` ->  get all classifiers which are finished
  3. `getClassifierSummary()` -> not used in SidePanel


* Hyperpartitions -> gives unique hyperpartitions for all classifiers
* test_metric -> is used in trials, algorithms, and performance(side panel)
* number of classifers -> with hyperparition id is used in hyperparition and hyperparameters plot
* cv_metric from classifer-> is used in hyperpartitions and hyperparameters
* id from hyperpartitions is same as hyperpartition_id in classifers

