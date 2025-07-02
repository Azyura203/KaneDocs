# KODEX 📚

> The next-generation AI-powered documentation platform with integrated Git-like version control

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/kodex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)

## ✨ Features

### 🧠 **AI-Powered Content Generation**
- Advanced AI markdown generation with intelligent templates
- Context-aware documentation creation
- Smart content optimization and suggestions
- Custom prompt support for specialized content

### 📜 **Enterprise Version Control**
- Complete Git-like versioning for documentation
- Intelligent commit history with detailed diffs
- Advanced branch management and switching
- Tag support for releases and milestones

### 🔍 **Visual Intelligence**
- Smart diff viewer with syntax highlighting
- Side-by-side comparison like GitHub
- Line-by-line change tracking with context
- Advanced merge conflict resolution

### 🌿 **Advanced Branching**
- Multiple documentation branches
- Protected branch support
- Intelligent branch comparison
- Seamless branch switching and merging

### 👥 **Team Collaboration**
- Real-time collaborative editing
- Detailed contributor analytics
- Advanced permission controls
- Team insights and activity tracking

### 📊 **Analytics & Insights**
- Comprehensive project metrics
- Visual commit timeline and activity graphs
- Language distribution analysis
- Performance and usage insights

### 🛠️ **Developer Experience**
- GitHub-like file browser with tree view
- Advanced markdown editor with live preview
- Intelligent file upload and management
- Global search with keyboard shortcuts
- Dark/light mode with system preference detection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kodex.git

# Navigate to project directory
cd kodex

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your documentation platform.

### Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Optional - for authentication)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=KODEX
VITE_ENABLE_ANALYTICS=true
```

## 📖 Usage

### Creating Documentation

1. **Navigate to Projects**: Go to `/projects` to start creating documentation
2. **AI Generation**: Use `/ai-generator` for intelligent content creation
3. **Version Control**: Manage versions with `/version-control`
4. **Real-time Editing**: Collaborate with the built-in editor

### AI-Powered Workflow

```markdown
# Example AI workflow

1. Describe your documentation needs
2. Choose from intelligent templates
3. Let AI generate comprehensive content
4. Edit and refine with live preview
5. Commit with smart version control
6. Collaborate with your team
```

### Version Control Features

```markdown
# Advanced version control

1. Create branches for different features
2. Make changes with intelligent tracking
3. Stage and commit with meaningful messages
4. Compare versions with visual diffs
5. Merge branches with conflict resolution
6. Tag releases for important milestones
```

## 🏗️ Project Structure

```
kodex/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── VersionControlSystem.tsx  # VCS interface
│   │   ├── AIMarkdownGenerator.tsx   # AI generation
│   │   ├── DocumentationEditor.tsx  # Advanced editor
│   │   ├── GitManager.tsx   # Git-like interface
│   │   ├── DiffViewer.tsx   # Visual diff comparison
│   │   └── ...
│   ├── pages/               # Astro pages
│   │   ├── index.astro      # Homepage
│   │   ├── projects.astro   # Project management
│   │   ├── editor.astro     # Documentation editor
│   │   ├── version-control.astro  # Version control
│   │   ├── ai-generator.astro     # AI generation
│   │   └── ...
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Utilities and services
│   └── assets/              # Static assets
├── public/                  # Public files
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind CSS config
└── package.json             # Dependencies
```

## 🎨 Customization

### Theming

KODEX supports advanced theming through Tailwind CSS:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your primary color palette
        },
        accent: {
          // Your accent color palette
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      }
    }
  }
}
```

### Configuration

Customize your documentation platform in `astro.config.mjs`:

```javascript
export default defineConfig({
  integrations: [react(), tailwind()],
  // Add your customizations
});
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Configure Build**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**: Netlify will automatically deploy on every push

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains your built site
# Upload to your hosting provider
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
npm run lint         # Lint code
npm run format       # Format code
```

### Adding New Features

1. **Create Component**: Add new React components in `src/components/`
2. **Add Page**: Create new Astro pages in `src/pages/`
3. **Update Navigation**: Modify `src/components/Sidebar.tsx`
4. **Style**: Use Tailwind CSS classes for styling

### Local Database

KODEX uses browser localStorage for Git-like functionality:

- Repository data and metadata
- Complete commit history
- Branch information and switching
- Working directory changes
- User preferences and settings

All data is stored locally in your browser for privacy and performance.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent file organization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Astro** - For the amazing static site generator
- **React** - For the component architecture
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icons
- **Marked** - For markdown parsing
- **Highlight.js** - For syntax highlighting
- **Supabase** - For authentication infrastructure

## 📞 Support

- 📧 **Email**: support@kodex.dev
- 💬 **Discord**: [Join our community](https://discord.gg/kodex)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/kodex/issues)
- 📖 **Documentation**: [Full Documentation](https://kodex.netlify.app)

## 🗺️ Roadmap

- [ ] **Real Git Integration**: Connect with actual Git repositories
- [ ] **Advanced AI Features**: Code analysis and intelligent suggestions
- [ ] **Plugin System**: Extensible plugin architecture
- [ ] **Advanced Search**: Full-text search with AI-powered relevance
- [ ] **API Integration**: REST API for external integrations
- [ ] **Mobile App**: Native mobile application
- [ ] **Enterprise Features**: SSO, advanced permissions, audit logs
- [ ] **Multi-language Support**: Internationalization and localization

---

<div align="center">
  <p>Made with ❤️ by the KODEX team</p>
  <p>
    <a href="https://kodex.netlify.app">Website</a> •
    <a href="https://github.com/yourusername/kodex">GitHub</a> •
    <a href="https://twitter.com/kodex">Twitter</a>
  </p>
</div>