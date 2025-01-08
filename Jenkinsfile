pipeline {
    agent any
    environment {
        PATH = "${env.PATH};C:\\Program Files\\Docker\\Docker\\resources\\bin" // Ensure Docker is accessible
    }
    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                bat '''
                    npm install
                '''
            }
        }
        stage('Run Backend Mocha Tests') {
            steps {
                bat '''
                    npm install sinon --save-dev
                    npm run backend-test
                '''
            }
        }
        stage('Run Frontend Instrumentation') {
            steps {
                bat 'npm run frontend-instrument'
            }
        }
        stage('Run Frontend Electron Tests') {
            steps {
                bat 'npm run frontend-test'
            }
        }
        stage('Docker Login, Compose, Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'bd124c49-6eb7-40f2-81ac-c7c607762adf', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                            docker-compose build
                            docker-compose push
                        '''
                    }
                }
            }
        }
        stage('Azure Login') {
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: '5aa936a1-70b9-49eb-89c9-e8cdbe52c14f', usernameVariable: 'APP_ID', passwordVariable: 'PASSWORD'),
                        string(credentialsId: '21c737b7-0b84-48ec-a4bd-b44e2a8bd10c', variable: 'TENANT')
                    ]) {
                        bat '''
                            az login --service-principal -u %APP_ID% -p %PASSWORD% --tenant %TENANT%
                        '''
                    }
                }
            }
        }
        stage('Azure AKS Cluster Setup') {
            steps {
                bat '''
                    az aks show --resource-group rmsJobGroup --name rmsAKSCluster -o json >nul 2>nul || az aks create --resource-group rmsJobGroup --name rmsAKSCluster --node-count 1 --generate-ssh-keys
                '''
            }
        }
        stage('Get AKS Cluster Credentials') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'aeedb859-2ae2-451a-91e5-ac4dc88c0b8b', variable: 'SUBSCRIPTION_ID')]) {
                        bat '''
                            az aks get-credentials --resource-group "rmsJobGroup" --name "rmsAKSCluster" --overwrite-existing --subscription %SUBSCRIPTION_ID%
                        '''
                    }
                }
            }
        }
        stage('Apply Kubernetes Deployment and Service') {
            steps {
                bat '''
                    kubectl apply -f rms-deployment.yaml
                    kubectl apply -f rms-service.yaml
                '''
            }
        }
        stage('Verify Kubernetes Deployment') {
            steps {
                bat '''
                    kubectl rollout history deployment/rms-deployment
                    kubectl get pods
                    kubectl get services
                '''
            }
        }
    }

    post {
        always {
            echo 'This will always run'
        }
        failure {
            mail bcc: '',
                 body: """
                     <b>Build Failed!</b><br>
                     <b>Project:</b> ${env.JOB_NAME}<br>
                     <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                     <b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                 """,
                 mimeType: 'text/html',
                 subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 to: 'jiayu.wong42@gmail.com'
        }
    }
}
