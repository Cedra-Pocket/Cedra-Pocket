# 📚 Documentation

This folder contains all documentation for the Cedra Quest Backend project.

## 📁 Documentation Files

### **API Documentation**
- `API_DOCUMENTATION.md` - Complete API reference with endpoints, request/response examples

### **Game Economy**
- `GAME_ECONOMY_PLAN.md` - Detailed game economy design and implementation plan

### **Setup Guides**
- `HOW_TO_GET_REAL_INITDATA.md` - Step-by-step guide to get real Telegram initData for testing

### **Deployment**
- `PRODUCTION_CHECKLIST.md` - Complete production deployment checklist and maintenance guide

## 🎯 Quick Navigation

### **For Developers**
1. Start with `API_DOCUMENTATION.md` for API reference
2. Read `GAME_ECONOMY_PLAN.md` to understand business logic
3. Use `HOW_TO_GET_REAL_INITDATA.md` for Telegram integration

### **For DevOps**
1. Follow `PRODUCTION_CHECKLIST.md` for deployment
2. Check `API_DOCUMENTATION.md` for health endpoints
3. Review security configurations in production checklist

### **For Frontend Developers**
1. `API_DOCUMENTATION.md` - All endpoints and data formats
2. `GAME_ECONOMY_PLAN.md` - Business rules and game mechanics
3. Authentication flow examples

## 🔗 Related Files

### **Configuration Files** (in root directory)
- `docker-compose.yml` - Docker services configuration
- `Dockerfile` - Container build instructions
- `nginx.conf` - Reverse proxy configuration
- `.env.production` - Production environment template

### **Scripts** (in root directory)
- `deploy.sh` - Automated deployment script
- `healthcheck.js` - Health monitoring script

### **Tests** (in test/ directory)
- Various test scripts for API validation
- See `test/README.md` for details

## 📖 Documentation Standards

### **API Documentation Format**
```markdown
## Endpoint Name
**Method:** POST/GET
**URL:** /api/endpoint
**Request:** JSON example
**Response:** JSON example
**Errors:** Error codes and messages
```

### **Code Examples**
- Always include working code examples
- Use real-world scenarios
- Include error handling
- Provide curl commands for testing

### **Deployment Guides**
- Step-by-step instructions
- Prerequisites clearly listed
- Troubleshooting sections
- Security considerations

## 🔄 Keeping Documentation Updated

### **When to Update**
- New API endpoints added
- Business logic changes
- Deployment process changes
- Security requirements change

### **How to Update**
1. Edit the relevant .md file
2. Test all code examples
3. Update version numbers if applicable
4. Review for accuracy and completeness

## 🎨 Markdown Guidelines

### **Headers**
- Use `#` for main sections
- Use `##` for subsections
- Use `###` for details

### **Code Blocks**
```bash
# Use bash for shell commands
npm install
```

```javascript
// Use javascript for code examples
const result = await fetch('/api/endpoint');
```

```json
// Use json for API responses
{
  "success": true,
  "data": {}
}
```

### **Emphasis**
- **Bold** for important terms
- *Italic* for emphasis
- `Code` for inline code/filenames
- > Blockquotes for important notes

## 🔍 Finding Information

### **Search Tips**
- Use Ctrl+F to search within files
- Look for specific endpoint names
- Search for error codes
- Check troubleshooting sections first

### **Cross-References**
- API docs reference game economy rules
- Production checklist references API health endpoints
- Setup guides link to configuration examples

## 📞 Support

If documentation is unclear or missing information:
1. Check the troubleshooting sections first
2. Look for similar examples in other docs
3. Test the examples provided
4. Create an issue with specific questions