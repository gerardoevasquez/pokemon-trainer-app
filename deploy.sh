#!/bin/bash

# Pokemon Trainer App - Deployment Script
# This script deploys the application to Google Cloud Platform

set -e  # Exit on any error

# Configuration
PROJECT_ID=${PROJECT_ID:-"your-project-id"}
REGION=${REGION:-"us-east1"}
SERVICE_NAME=${SERVICE_NAME:-"pokemon-trainer-app"}
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
TAG=${TAG:-$(git rev-parse --short HEAD)}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
check_gcloud() {
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
}

# Check if docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
}

# Set up gcloud configuration
setup_gcloud() {
    log_info "Setting up Google Cloud configuration..."
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Enable required APIs
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    log_success "Google Cloud configuration completed"
}

# Build and push Docker image
build_and_push() {
    log_info "Building Docker image..."
    
    # Build the image
    docker build -t $IMAGE_NAME:$TAG .
    docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest
    
    # Push to Container Registry
    log_info "Pushing image to Container Registry..."
    docker push $IMAGE_NAME:$TAG
    docker push $IMAGE_NAME:latest
    
    log_success "Image built and pushed successfully"
}

# Deploy to Cloud Run
deploy_to_cloud_run() {
    log_info "Deploying to Cloud Run..."
    
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME:$TAG \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --port 80 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --min-instances 0 \
        --set-env-vars NODE_ENV=production,ANGULAR_ENV=production
    
    log_success "Deployment completed successfully"
}

# Get service URL
get_service_url() {
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    log_success "Service deployed at: $SERVICE_URL"
}

# Main deployment process
main() {
    log_info "Starting deployment process..."
    log_info "Project ID: $PROJECT_ID"
    log_info "Region: $REGION"
    log_info "Service Name: $SERVICE_NAME"
    log_info "Image Tag: $TAG"
    
    # Check prerequisites
    check_gcloud
    check_docker
    
    # Setup and deploy
    setup_gcloud
    build_and_push
    deploy_to_cloud_run
    get_service_url
    
    log_success "Deployment completed successfully! 🎉"
}

# Help function
show_help() {
    echo "Pokemon Trainer App - Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --project-id PROJECT_ID    Google Cloud Project ID"
    echo "  -r, --region REGION           Google Cloud Region (default: us-central1)"
    echo "  -s, --service-name NAME       Cloud Run service name (default: pokemon-trainer-app)"
    echo "  -t, --tag TAG                 Docker image tag (default: git commit hash)"
    echo "  -h, --help                    Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  PROJECT_ID                    Google Cloud Project ID"
    echo "  REGION                        Google Cloud Region"
    echo "  SERVICE_NAME                  Cloud Run service name"
    echo "  TAG                           Docker image tag"
    echo ""
    echo "Examples:"
    echo "  $0 --project-id my-project"
    echo "  $0 -p my-project -r us-west1 -s my-app"
    echo "  PROJECT_ID=my-project $0"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
            shift 2
            ;;
        -s|--service-name)
            SERVICE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if PROJECT_ID is set
if [ "$PROJECT_ID" = "your-project-id" ]; then
    log_error "Please set PROJECT_ID environment variable or use --project-id option"
    show_help
    exit 1
fi

# Run main deployment
main 