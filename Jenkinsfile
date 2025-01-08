pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/jiayuuu64/devops-project-jiayu',
                        credentialsId: 'bf8f9e76-ef23-4c2c-8a05-9893c7c69ded'
                    ]]
                ])
            }
        }
        stage('Run Backend Mocha Tests') {
            steps {
                bat 'npm run backend-test'
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
                    withCredentials([usernamePassword(credentialsId: 'bd124c49-6eb7-40f2-81ac-c7c607762adf', usernameVariable: 'Docker_Username',
                    passwordVariable: 'Docker_Password')]) {
                        bat '''
                            docker login -u %Docker_Username% -p %Docker_Password%
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
                        usernamePassword(credentialsId: '5aa936a1-70b9-49eb-89c9-e8cdbe52c14f', usernameVariable: 'appId',
                        passwordVariable: 'password'),
                        string(credentialsId: '21c737b7-0b84-48ec-a4bd-b44e2a8bd10c', variable: 'Tenant')
                    ]) {
                        try {
                            bat 'az login --service-principal -u %appId% -p %password% --tenant %Tenant%'
                        } catch (Exception e) {
                            error "Azure login failed: ${e.message}"
                        }
                    }
                }
            }
        }
        stage('Azure AKS Cluster Setup') {
            steps {
                bat '''
                    az aks show --resource-group rmsJobGroup --name rmsAKSCluster -o json >nul 2>nul || az aks create --resource-group rmsJobGroup --name btAKSCluster --node-count 1 --generate-ssh-keys 2>&1
                '''
            }
        }
        stage('Get AKS Cluster Credentials') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'aeedb859-2ae2-451a-91e5-ac4dc88c0b8b', variable: 'Subscription_id')]) {
                        try {
                            bat '''
                                az aks get-credentials --resource-group "rmsJobGroup" --name "rmsAKSCluster" --overwrite-existing --subscription %Subscription_id%
                            '''
                        } catch (Exception e) {
                            error "Get AKS Cluster Credentials failed: ${e.message}"
                        }
                    }
                }
            }
        }
        stage('Apply Kubernetes Deployment and Service') {
            steps {
                bat '''
                    kubectl apply -f bt-deployment.yaml
                    kubectl apply -f bt-service.yaml
                '''
            }
        }
        stage('Verify Kubernetes Deployment') {
            steps {
                bat '''
                    kubectl rollout history deployment/bt-deployment
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
            script {
                def consoleOutput = currentBuild.rawBuild.log(10).join("\n")
                mail bcc: '',
                     body: """
                         <b>Build Failed!</b><br>
                         <b>Project:</b> ${env.JOB_NAME}<br>
                         <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                         <b>Console Snippet:</b><br><pre>${consoleOutput}</pre><br>
                         <b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                     """,
                     cc: '',
                     charset: 'UTF-8',
                     from: '',
                     mimeType: 'text/html',
                     replyTo: '',
                     subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${consoleOutput}",
                     to: 'jiayu.wong42@gmail.com'
            }
        }
    }
}