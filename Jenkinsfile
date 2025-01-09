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
        stage('Update Outdated Packages') {
            steps {
                bat 'npm install -g npm-check-updates'
            }
        }
        stage('Run Backend Mocha Tests') {
            steps {
                bat '''
                    npm run backend-test
                '''
            }
        }
        stage('Run Frontend Instrumentation') {
            steps {
                bat '''
                    npx nyc instrument public instrumented
                '''
            }
        }
        stage('Run Frontend Electron Tests') {
            steps {
                bat '''
                    set ELECTRON_DISABLE_GPU=1
                    npx cypress run --browser chrome
                '''
            }
        }
        stage('Docker Login, Build, and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'bd124c49-6eb7-40f2-81ac-c7c607762adf', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
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
                    kubectl rollout status deployment/rms-deployment
                    kubectl get services
                    kubectl get pods
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
