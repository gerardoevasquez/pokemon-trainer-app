#!/bin/bash

# Setup Cloud Build for Pokemon Trainer App
# This script configures the required resources for Cloud Build

set -e  # Exit on any error

# Configuration
PROJECT_ID=${PROJECT_ID:-"your-project-id"}
REGION=${REGION:-"us-central1"}
BUCKET_NAME="${PROJECT_ID}-cloudbuild-logs"

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

# Check if gsutil is installed
check_gsutil() {
    if ! command -v gsutil &> /dev/null; then
        log_error "gsutil is not installed. Please install it first."
        exit 1
    fi
}

# Get project number
get_project_number() {
    PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
    echo $PROJECT_NUMBER
}

# Create logs bucket
create_logs_bucket() {
    log_info "Creating Cloud Build logs bucket..."
    
    # Check if bucket already exists
    if gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
        log_warning "Bucket gs://$BUCKET_NAME already exists"
        return 0
    fi
    
    # Create bucket
    gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME
    
    # Set bucket permissions
    PROJECT_NUMBER=$(get_project_number)
    gsutil iam ch serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com:objectViewer gs://$BUCKET_NAME
    
    log_success "Bucket gs://$BUCKET_NAME created successfully"
}

# Enable required APIs
enable_apis() {
    log_info "Enabling required APIs..."
    
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    gcloud services enable storage.googleapis.com
    
    log_success "APIs enabled successfully"
}

# Set up IAM permissions
setup_iam() {
    log_info "Setting up IAM permissions..."
    
    # Get project number
    PROJECT_NUMBER=$(get_project_number)
    
    # Grant Cloud Build service account permissions
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
        --role="roles/cloudbuild.builds.editor"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
        --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
        --role="roles/iam.serviceAccountUser"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
        --role="roles/storage.admin"
    
    log_success "IAM permissions configured successfully"
}

# Create Cloud Build triggers
create_triggers() {
    log_info "Creating Cloud Build triggers..."
    
    # Production trigger
    gcloud builds triggers create github \
        --repo-name=pokemon-trainer-app \
        --branch-pattern="main" \
        --build-config=cloudbuild.yaml \
        --name="pokemon-trainer-app-production" \
        --description="Deploy to production on main branch"
    
    # Staging trigger
    gcloud builds triggers create github \
        --repo-name=pokemon-trainer-app \
        --branch-pattern="develop" \
        --build-config=cloudbuild-staging.yaml \
        --name="pokemon-trainer-app-staging" \
        --description="Deploy to staging on develop branch"
    
    log_success "Cloud Build triggers created successfully"
}

# Test build
test_build() {
    log_info "Testing Cloud Build configuration..."
    
    # Submit a test build
    gcloud builds submit --config=cloudbuild-test.yaml . \
        --substitutions=_REGION=$REGION,_SERVICE_NAME="pokemon-trainer-app-test"
    
    log_success "Test build completed successfully"
}

# Main setup process
main() {
    log_info "Starting Cloud Build setup..."
    log_info "Project ID: $PROJECT_ID"
    log_info "Region: $REGION"
    log_info "Logs Bucket: gs://$BUCKET_NAME"
    
    # Check prerequisites
    check_gcloud
    check_gsutil
    
    # Setup and configure
    enable_apis
    create_logs_bucket
    setup_iam
    create_triggers
    
    log_success "Cloud Build setup completed successfully! 🎉"
    log_info "You can now push to main/develop branches to trigger deployments"
}

# Help function
show_help() {
    echo "Cloud Build Setup Script for Pokemon Trainer App"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --project-id PROJECT_ID    Google Cloud Project ID"
    echo "  -r, --region REGION           Google Cloud Region (default: us-central1)"
    echo "  -h, --help                    Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  PROJECT_ID                    Google Cloud Project ID"
    echo "  REGION                        Google Cloud Region"
    echo ""
    echo "Examples:"
    echo "  $0 --project-id my-project"
    echo "  $0 -p my-project -r us-west1"
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

# Run main setup
main 