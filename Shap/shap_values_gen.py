import os

import joblib
import pandas as pd
import shap
import sklearn
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

# Define a directory to save trained models
model_dir = "saved_models"
os.makedirs(model_dir, exist_ok=True)
app = Flask(__name__)
CORS(app)

@app.route('/get_shap_values', methods=['POST'])
def get_shap_values():
    data = request.get_json()
    dataset_path = data.get('dataset_path')
    dataset_name = dataset_path.split('/')[-1].split('/')[-1].split(".")[0]

    algos = data.get('algos')

    # Load dataset
    df = pd.read_csv(dataset_path)
    X = df.iloc[:, :-1]  # Features
    y = df.iloc[:, -1]  # Target variable
    X_train, X_test, Y_train, Y_test = train_test_split(X, y, test_size=0.2, random_state=0)


    shap_results = {}
    for algo in algos:
        if algo not in ["knn", "svm", "logreg", "dt", "et", "rf", "ada", "pa"]:
            continue

        model = load_model(dataset_name, algo)
        if model is None:
            model = get_model(algo)
            model.fit(X_train, Y_train)
            save_model(dataset_name, model, algo)

        shap_values = calculate_shap_values(model, algo, X_train, X_test)
        ret = {
            'shap_values': shap_values.values.tolist(),
            'base_values': shap_values.base_values.tolist(),
            'input_value': shap_values.data.tolist()
        }
        shap_results[algo] = ret
        # shap_values_json = shap_values.tolist()  # Convert ndarray to nested list
        # shap_results[algo] = shap_values_json

    return jsonify(shap_results)


def load_model(dataset, algo):
    model_filename = os.path.join(model_dir, f"{dataset}_{algo}_model.pkl")
    if os.path.exists(model_filename):
        print(f"Loading pre-trained {algo} model...")
        return joblib.load(model_filename)
    else:
        return None


def save_model(dataset, model, algo):
    model_filename = os.path.join(model_dir, f"{dataset}_{algo}_model.pkl")
    joblib.dump(model, model_filename)
    print(f"Model saved: {model_filename}")


def calculate_shap_values(model, algo, X_train, X_test):
    explainer = get_explainer(algo, model, X_train)
    shap_values = explainer(X_test.iloc[0, :])
    return shap_values


def get_model(algo):
    if algo == "knn":
        model = KNeighborsClassifier()
    elif algo == "svm":
        model = sklearn.svm.SVC(kernel="linear", probability=True)
    elif algo == "logreg":
        from sklearn.linear_model import LogisticRegression
        model = LogisticRegression()
    elif algo == "sgd":
        from sklearn.linear_model import SGDClassifier
        model = SGDClassifier()
    elif algo == "dt":
        from sklearn.tree import DecisionTreeClassifier
        model = DecisionTreeClassifier()
    elif algo == "et":
        from sklearn.ensemble import ExtraTreesClassifier
        model = ExtraTreesClassifier()
    elif algo == "rf":
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier()
    elif algo == "gnb":
        from sklearn.naive_bayes import GaussianNB
        model = GaussianNB()
    elif algo == "mnb":
        from sklearn.naive_bayes import MultinomialNB
        model = MultinomialNB()
    elif algo == "bnb":
        from sklearn.naive_bayes import BernoulliNB
        model = BernoulliNB()
    elif algo == "gp":
        from sklearn.gaussian_process import GaussianProcessClassifier
        model = GaussianProcessClassifier()
    elif algo == "pa":
        from sklearn.linear_model import PassiveAggressiveClassifier
        model = PassiveAggressiveClassifier()
    elif algo == "mlp":
        from sklearn.neural_network import MLPClassifier
        model = MLPClassifier()
    elif algo == "ada":
        from sklearn.ensemble import AdaBoostClassifier
        model = AdaBoostClassifier()
    else:
        raise ValueError("Invalid algorithm name")

    return model


def get_explainer(algo, model, X_train):
    if algo in ["knn", "svm", "logreg", "sgd", "dt", "et", "rf", "ada"]:
        explainer = shap.KernelExplainer(model.predict_proba, X_train)


    # elif algo in ["svc"]:
    #     explainer = shap.Explainer(model.predict_log_proba, X_train)
    elif algo in ["gnb", "mnb", "bnb"]:
        explainer = shap.Explainer(model.predict_proba, X_train)
    elif algo == "gp":
        explainer = shap.Explainer(model.predict, X_train)
    elif algo == "pa":
        explainer = shap.KernelExplainer(model.decision_function, X_train)
    elif algo == "mlp":
        explainer = shap.DeepExplainer(model, X_train)
    else:
        raise ValueError("Invalid algorithm name")

    return explainer


if __name__ == "__main__":
    app.run(debug=True,port=8087)
