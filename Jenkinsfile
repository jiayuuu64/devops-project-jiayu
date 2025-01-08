pipeline {
    agent any
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
                    npm audit fix
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
                bat '''
                    nyc instrument public instrumented
                '''
            }
        }
        stage('Run Frontend Electron Tests') {
            steps {
                bat '''
                    set ELECTRON_DISABLE_GPU=1
                    cypress run --browser chrome
                '''
            }
        }
        stage('Docker Login, Compose, Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
                        usernamePassword(credentialsId: 'azure-credentials-id', usernameVariable: 'APP_ID', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'tenant-id', variable: 'TENANT')
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
                    withCredentials([string(credentialsId: 'subscription-id', variable: 'SUBSCRIPTION_ID')]) {
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
            mail to: 'jiayu.wong42@gmail.com',
                 subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build failed. Please check Jenkins logs for details."
        }
    }
}
