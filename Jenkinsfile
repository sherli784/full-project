pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
               git branch: 'main', url: 'https://github.com/sherli784/full-project.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Build started'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment started'
            }
        }
    }
}
