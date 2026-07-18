pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'NODE_OPTIONS=--max-old-space-size=2048 npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'sudo /usr/bin/systemctl restart nginx'
            }
        }
    }
}
