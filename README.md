# Pokémon Trainer App

A modern Angular application that allows users to create a Pokémon trainer profile, select their team of Pokémon, and view detailed statistics using the PokeAPI.

## 🎯 Features

### Core Features
- **Trainer Profile Creation**: Upload profile image, enter personal information with form validation
- **Pokémon Selection**: Browse and select 3 Pokémon from the first generation (151 Pokémon)
- **Trainer Summary**: View complete profile with selected Pokémon team and detailed stats
- **Form Validation**: Required fields validation with proper error handling
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Bonus Features
- **Virtual Scroll**: Angular Material CDK for efficient Pokémon list rendering
- **Swiper Integration**: Interactive carousel for viewing Pokémon statistics
- **API Integration**: Full integration with PokeAPI for Pokémon data
- **Error Handling**: Comprehensive error management and loading states

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI (version 17 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gerardoevasquez/pokemon-trainer-app.git
   cd pokemon-trainer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200` to view the application

## 📋 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── forms/                    # Form components
│   │   │   ├── trainer-profile-form/ # Main trainer form
│   │   │   ├── search-bar/           # Pokémon search functionality
│   │   │   └── primary-button/       # Reusable button component
│   │   ├── pokemon/                  # Pokémon-related components
│   │   │   ├── pokemon-card/         # Individual Pokémon card
│   │   │   ├── pokemon-grid/         # Pokémon selection grid
│   │   │   └── pokemon-selection/    # Pokémon selection logic
│   │   ├── profile/                  # Profile components
│   │   │   └── profile-image-uploader/ # Image upload functionality
│   │   └── trainer/                  # Trainer components
│   │       └── trainer-summary/      # Trainer profile display
│   ├── models/                       # TypeScript interfaces
│   ├── services/                     # API services and utilities
│   ├── pages/                        # Main application pages
│   └── shared/                       # Shared modules and utilities
├── assets/                           # Static assets
└── styles/                           # Global styles and variables
```

## 🎨 Design Implementation

The application follows the provided Figma design specifications:
- **Color Scheme**: Pokémon brand colors (#01426A, #FFC600, #F2F2F2)
- **Typography**: Modern, readable fonts with proper hierarchy
- **Layout**: Responsive grid system with proper spacing
- **Components**: Reusable components following BEM methodology
- **Animations**: Smooth transitions and hover effects

## 🔧 Technical Stack

- **Framework**: Angular 20 (Standalone Components)
- **Language**: TypeScript 5.8
- **Styling**: SCSS with CSS Variables
- **UI Library**: Angular Material 20
- **Virtual Scroll**: Angular CDK Scrolling
- **Carousel**: Swiper.js 11.2
- **API**: PokeAPI (https://pokeapi.co/)
- **Build Tool**: Angular CLI 20
- **Node.js**: 20.x (LTS)
- **Container**: Docker with Nginx
- **Cloud**: Google Cloud Platform (Cloud Build + Cloud Run)

## 📱 Features Breakdown

### 1. Trainer Profile Configuration
- **Required Fields**: Name (*), Birth Date (*), DUI (*) for adults
- **Optional Fields**: Hobby, Profile Image
- **Validation**: 
  - DUI format validation with auto-completion
  - Age-based document requirement logic
  - Image upload with preview

### 2. Pokémon Team Selection
- **First Generation**: All 151 Pokémon from the original games
- **Selection Limit**: Maximum 3 Pokémon per team
- **Search Functionality**: Filter by ID or name
- **Visual Feedback**: Selected state with yellow background
- **Virtual Scroll**: Efficient rendering for large lists

### 3. Trainer Profile Display
- **Profile Information**: Complete trainer details
- **Pokémon Team**: Selected Pokémon with detailed stats
- **Statistics Display**: Progress bars for all Pokémon stats
- **Edit Functionality**: Modify profile and team selections
- **Swiper Integration**: Interactive carousel for Pokémon viewing

## 🎯 API Integration

### PokeAPI Endpoints Used
- `GET /pokemon` - List of all Pokémon
- `GET /pokemon/{id}` - Individual Pokémon details
- **Sprite Images**: `sprites.other.home.front_default`

### Error Handling
- Network error management
- Loading states for all API calls
- Fallback images for failed loads
- User-friendly error messages

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Build Output
The build artifacts will be stored in the `dist/` directory.

### Docker Deployment

The application includes a Dockerfile for containerized deployment:

1. **Build the Docker image:**
   ```bash
   docker build -t pokemon-trainer-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 80:80 pokemon-trainer-app
   ```

3. **Access the application:**
   Navigate to `http://localhost` in your browser

### Docker Compose (Optional)

Create a `docker-compose.yml` file for easier deployment:

```yaml
version: '3.8'
services:
  pokemon-trainer-app:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

## 🐳 Docker Features

- **Multi-stage build** for optimized image size
- **Nginx server** for production-ready serving
- **Gzip compression** for better performance
- **Security headers** for enhanced security
- **Static asset caching** for improved loading times
- **SPA routing support** for Angular navigation
- **Health check endpoint** at `/health`

## ☁️ Google Cloud Platform Deployment

### Cloud Build & Cloud Run

The application includes comprehensive GCP deployment configurations:

#### **Automatic Deployment (Recommended)**

1. **Create logs bucket (required for Cloud Build):**
   ```bash
   # Create a bucket for Cloud Build logs
   gsutil mb gs://$PROJECT_ID-cloudbuild-logs
   
   # Set bucket permissions
   gsutil iam ch serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com:objectViewer gs://$PROJECT_ID-cloudbuild-logs
   ```

2. **Set up Cloud Build triggers:**
   ```bash
   # Create triggers for different environments
   gcloud builds triggers create github \
     --repo-name=pokemon-trainer-app \
     --branch-pattern="main" \
     --build-config=cloudbuild.yaml
   ```

2. **Push to trigger deployment:**
   ```bash
   git push origin main  # Triggers production deployment
   git push origin develop  # Triggers staging deployment
   ```

#### **Manual Deployment**

1. **Setup Cloud Build (first time only):**
   ```bash
   # Set your project ID
   export PROJECT_ID="your-project-id"
   
   # Run setup script
   ./setup-cloud-build.sh
   ```

2. **Using the deployment script:**
   ```bash
   # Set your project ID
   export PROJECT_ID="your-project-id"
   
   # Run deployment
   ./deploy.sh
   ```

2. **Using gcloud commands:**
   ```bash
   # Build and push image
   gcloud builds submit --tag gcr.io/$PROJECT_ID/pokemon-trainer-app
   
   # Deploy to Cloud Run
   gcloud run deploy pokemon-trainer-app \
     --image gcr.io/$PROJECT_ID/pokemon-trainer-app \
     --platform managed \
     --region us-east1 \
     --allow-unauthenticated
   ```

### Environment Configurations

- **Production** (`cloudbuild.yaml`): 512Mi RAM, 1 CPU, 10 max instances (us-east1)
- **Staging** (`cloudbuild-staging.yaml`): 256Mi RAM, 1 CPU, 5 max instances (us-east1)
- **Testing** (`cloudbuild-test.yaml`): 256Mi RAM, 1 CPU, 1 max instance (us-east1)

### Cloud Build Features

- **Multi-environment support** (production, staging, testing)
- **Automatic testing** before deployment
- **Linting and code quality checks**
- **Optimized build machines** (E2_HIGHCPU_8 for production)
- **Environment-specific configurations**
- **Health checks and monitoring**

## 📝 Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Angular Standards**: Following Angular style guide
- **Component Architecture**: Standalone components with proper separation of concerns
- **Service Pattern**: Centralized data management
- **Error Boundaries**: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for technical assessment purposes.

## 👨‍💻 Author

**Gerardo Vasquez**
- GitHub: [@gerardoevasquez](https://github.com/gerardoevasquez)

---

*Built with ❤️ using Angular and the PokeAPI*
