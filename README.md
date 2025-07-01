# KaneDocs 📚

> A modern documentation platform with integrated GitHub-like version control features

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/kanedocs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)

## ✨ Features

### 📜 **Version Control System**
- Complete Git-like versioning for documentation
- Commit history with detailed diffs
- Branch management and switching
- Tag support for releases

### 🧠 **Smart Diffs**
- Visual diff viewer with syntax highlighting
- Side-by-side comparison like GitHub pull requests
- Line-by-line change tracking
- Addition/deletion highlighting

### ⚙️ **AI-Powered Generation**
- AI markdown generation with templates
- Smart commit message suggestions
- Automated documentation creation
- Content optimization recommendations

### 🌿 **Branch Management**
- Multiple documentation branches
- Branch switching and comparison
- Protected branch support
- Merge conflict resolution

### 🔍 **Contributor Insights**
- Detailed contributor analytics
- Commit activity graphs
- Project statistics dashboard
- Language distribution charts

### 📊 **Project Analytics**
- Comprehensive project metrics
- Visual commit timeline
- Activity heatmaps
- Performance insights

### 🛠️ **Developer Experience**
- GitHub-like file browser
- Markdown editor with live preview
- File upload and management
- Search functionality
- Dark/light mode toggle

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kanedocs.git

# Navigate to project directory
cd kanedocs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your documentation site.

### Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Optional - for authentication)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=KaneDocs
VITE_ENABLE_ANALYTICS=true
```

## 📖 Usage

### Creating Documentation

1. **Navigate to the Editor**: Go to `/editor` to create new documentation
2. **Write in Markdown**: Use the built-in editor with live preview
3. **Commit Changes**: Save your work with meaningful commit messages
4. **Manage Versions**: Switch between different versions and branches

### Version Control Features

```markdown
# Example workflow

1. Create a new branch for your feature
2. Edit documentation files
3. Stage your changes
4. Commit with descriptive messages
5. Switch between branches to compare
6. View diff to see what changed
```

### AI Generation

1. **Go to AI Generator**: Visit `/ai-generator`
2. **Choose Template**: Select from pre-built templates
3. **Describe Your Needs**: Write what documentation you want
4. **Generate**: Let AI create comprehensive markdown
5. **Edit & Refine**: Customize the generated content

## 🏗️ Project Structure

```
kanedocs/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Header.tsx       # Top navigation
│   │   ├── VersionControlSystem.tsx  # VCS interface
│   │   ├── AIMarkdownGenerator.tsx   # AI generation
│   │   ├── DocumentationEditor.tsx  # Markdown editor
│   │   ├── GitManager.tsx   # Git-like interface
│   │   ├── DiffViewer.tsx   # Diff comparison
│   │   └── ...
│   ├── pages/               # Astro pages
│   │   ├── index.astro      # Homepage
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

KaneDocs supports custom themes through Tailwind CSS:

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
      }
    }
  }
}
```

### Configuration

Customize your documentation in `astro.config.mjs`:

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
```

### Adding New Features

1. **Create Component**: Add new React components in `src/components/`
2. **Add Page**: Create new Astro pages in `src/pages/`
3. **Update Navigation**: Modify `src/components/Sidebar.tsx`
4. **Style**: Use Tailwind CSS classes for styling

### Local Database

KaneDocs uses browser localStorage for the Git-like functionality:

- Repository data
- Commit history
- Branch information
- Working directory changes

All data is stored locally in your browser.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Astro** - For the amazing static site generator
- **React** - For the component architecture
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icons
- **Marked** - For markdown parsing
- **Highlight.js** - For syntax highlighting

## 📞 Support

- 📧 **Email**: support@kanedocs.com
- 💬 **Discord**: [Join our community](https://discord.gg/kanedocs)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/kanedocs/issues)
- 📖 **Documentation**: [Full Documentation](https://kanedocs.netlify.app)

## 🗺️ Roadmap

- [ ] **Real Git Integration**: Connect with actual Git repositories
- [ ] **Collaborative Editing**: Real-time collaboration features
- [ ] **Plugin System**: Extensible plugin architecture
- [ ] **Advanced Search**: Full-text search across documentation
- [ ] **API Integration**: REST API for external integrations
- [ ] **Mobile App**: Native mobile application
- [ ] **Enterprise Features**: SSO, advanced permissions, audit logs

---

<div align="center">
  <p>Made with ❤️ by the KaneDocs team</p>
  <p>
    <a href="https://kanedocs.netlify.app">Website</a> •
    <a href="https://github.com/yourusername/kanedocs">GitHub</a> •
    <a href="https://twitter.com/kanedocs">Twitter</a>
  </p>
</div>