# Abhimanyu Kumar - Portfolio Website

A modern, responsive portfolio website built with HTML5, CSS3, JavaScript, and Flask backend. Features a professional design with smooth animations, 3D effects, and a contact form with backend integration.

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern UI/UX**: Professional design with gradient backgrounds and smooth animations
- **3D Effects**: Perspective transforms and hover effects on images
- **Interactive Elements**: 
  - Smooth scrolling navigation
  - Reveal-on-scroll animations
  - 3D tilt effects on project cards
  - Floating form labels
  - Success toast notifications
- **Accessibility**: 
  - ARIA labels and roles
  - Keyboard navigation support
  - Focus-visible outlines
  - Skip-to-content link
  - Reduced motion support
- **PWA Ready**: Service Worker and Web App Manifest
- **SEO Optimized**: Meta tags, structured data, sitemap, and robots.txt

### Backend
- **Flask Server**: Python microframework for handling form submissions
- **Contact Form**: Backend API endpoint for storing messages
- **Image Caching**: Automatic download and caching of images from external sources
- **Data Persistence**: JSONL file storage for contact messages

## 🛠️ Technologies Used

### Frontend Technologies
- **HTML5**: Semantic markup with modern elements
- **CSS3**: 
  - CSS Grid and Flexbox for layouts
  - CSS Custom Properties (CSS Variables)
  - Advanced animations and transitions
  - Modern CSS features (aspect-ratio, object-fit, etc.)
  - Color mixing with `color-mix()` function
- **JavaScript (ES6+)**:
  - Modern JavaScript features
  - DOM manipulation
  - Event handling
  - Form validation
  - Intersection Observer API
  - Service Worker registration

### Backend Technologies
- **Python 3.x**: Core programming language
- **Flask**: Lightweight web framework
- **JSONL**: Data storage format for messages

### Development Tools
- **Progressive Web App (PWA)**: Service Worker and Web App Manifest
- **Image Optimization**: AVIF format with JPG fallbacks
- **Performance**: Lazy loading, cache busting, and optimized assets

## 📁 Project Structure

```
01_setup/
├── index.html                 # Main HTML file
├── styles.css                 # All CSS styles and animations
├── script.js                  # JavaScript functionality
├── manifest.webmanifest       # PWA manifest file
├── sw.js                      # Service Worker
├── robots.txt                 # Search engine directives
├── sitemap.xml               # Site structure for SEO
├── README.md                 # This file
├── server/
│   ├── app.py                # Flask backend server
│   ├── requirements.txt      # Python dependencies
│   └── data/
│       └── messages.jsonl    # Contact form messages storage
└── assets/
    └── images/
        ├── logo.svg          # Custom logo
        ├── favicon.svg       # Site favicon
        ├── hero.jpg.avif     # Hero section image
        ├── about.jpg.avif    # About section image
        ├── project-1.jpg.avif # Project thumbnails
        ├── project-2.jpg.avif
        ├── project-3.jpg.avif
        ├── project-4.jpg.avif
        ├── project-5.jpg.avif
        └── project-6.jpg.avif
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE

### Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd 01_setup
   ```

2. **Install Python dependencies**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. **Start the Flask server**
   ```bash
   python app.py
   ```

4. **Access the website**
   Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## 🎨 Design Features

### Color Scheme
- **Primary Brand**: Indigo (#4f46e5) to Cyan (#22d3ee) gradient
- **Background**: Dark theme with subtle gradients
- **Surface**: Semi-transparent cards with backdrop blur
- **Text**: High contrast for accessibility

### Typography
- **Font Family**: Inter (system fallbacks)
- **Responsive Sizing**: Clamp() functions for fluid typography
- **Gradient Text**: Brand colors applied to headings

### Animations
- **Background**: Animated gradient overlay with floating blobs
- **Images**: 3D perspective transforms with hover effects
- **Cards**: Glow effects and scale animations
- **Navigation**: Smooth underline animations
- **Forms**: Floating labels and validation feedback

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 600px - 1199px
- **Mobile**: Below 600px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly button sizes
- Optimized image loading
- PWA installation support

## 🔧 Customization

### Personal Information
Update the following files with your information:

1. **`index.html`**:
   - Update name, title, and meta description
   - Modify contact information in the contact section
   - Update social media links in footer

2. **`manifest.webmanifest`**:
   - Change app name and description
   - Update theme colors

3. **`sitemap.xml`**:
   - Update domain URL

### Styling
- **Colors**: Modify CSS custom properties in `:root`
- **Fonts**: Change font-family in body styles
- **Animations**: Adjust timing and easing in CSS

### Content
- **Projects**: Update project cards in the projects section
- **About**: Modify the about section content
- **Images**: Replace images in `assets/images/` directory

## 🚀 Deployment

### Static Hosting (Frontend Only)
For static hosting without the contact form backend:

1. **Netlify**:
   - Drag and drop the project folder
   - Or connect to Git repository

2. **Vercel**:
   - Install Vercel CLI
   - Run `vercel` in project directory

3. **GitHub Pages**:
   - Push to GitHub repository
   - Enable Pages in repository settings

### Full Stack Deployment (With Backend)
For deployment with contact form functionality:

1. **Heroku**:
   - Add `Procfile` with `web: python server/app.py`
   - Deploy using Heroku CLI or GitHub integration

2. **Railway**:
   - Connect GitHub repository
   - Set Python as runtime

3. **Render**:
   - Create new Web Service
   - Point to server directory

## 🔒 Security Features

- **Form Validation**: Client-side and server-side validation
- **Honeypot Field**: Spam protection in contact form
- **Content Security Policy**: CSP headers for XSS protection
- **Secure Headers**: Proper HTTP headers configuration

## 📊 Performance Optimizations

- **Image Optimization**: AVIF format with JPG fallbacks
- **Lazy Loading**: Images load as they enter viewport
- **Service Worker**: Caching for offline functionality
- **Minification**: CSS and JS minification for production
- **CDN Ready**: Assets structured for CDN deployment

## 🧪 Testing

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Device Testing
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- Focus management

## 📈 SEO Features

- **Meta Tags**: Title, description, and Open Graph tags
- **Structured Data**: JSON-LD Person schema
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine directives
- **Canonical URLs**: Prevent duplicate content
- **Social Media**: Twitter and Facebook meta tags

## 🔄 Version Control

The project uses Git for version control. Key files to track:
- All source files (HTML, CSS, JS)
- Python backend files
- Configuration files
- Documentation

Files to ignore:
- `node_modules/` (if using Node.js tools)
- `__pycache__/`
- `.env` files
- Log files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abhimanyu Kumar**
- GitHub: [@Abhimanyu-Kumar06](https://github.com/Abhimanyu-Kumar06)
- LinkedIn: [Abhimanyu Kumar](https://www.linkedin.com/in/abhimanyu-kumar-640502178/)
- Email: abhimanyuka12@gmail.com
- Location: Kolkata, India

## 🙏 Acknowledgments

- **Unsplash/Picsum**: For placeholder images
- **Inter Font**: Google Fonts
- **Flask Community**: Python web framework
- **CSS Grid**: Modern layout system
- **PWA Standards**: Progressive Web App guidelines

---

**Note**: This portfolio website is designed to showcase modern web development skills and best practices. It demonstrates proficiency in frontend technologies, backend development, responsive design, accessibility, and performance optimization.
