# 🍛 Prayagraj Street Food Guide

A context-driven local guide web application that understands Prayagraj's street food culture, local slang, and provides time-aware recommendations.

## 🎯 Project Overview

This project demonstrates how AI can be taught local nuances through a custom context file (`product.md`) rather than relying on generic global knowledge. The app acts like a local friend who knows the best street food spots, understands local slang, and gives culturally-aware recommendations.

## ✨ Features

- **Local Slang Understanding**: Recognizes terms like "bhai", "teekha", "halka", "shaam"
- **Time-Aware Recommendations**: Different suggestions for morning, afternoon, evening, night
- **Area-Specific Knowledge**: Knows about Kumbh area, Sangam, Chowk, Civil Lines
- **Taste Preference Mapping**: Handles spicy, sweet, light food requests
- **Cultural Context**: Understands local food habits and cultural references

## 🏗️ Architecture

### Context-Driven Intelligence
All local knowledge comes from `.kiro/product.md` - the app has no hardcoded food data. This demonstrates:
- **Separation of Logic and Content**: Code handles parsing and matching, content defines local knowledge
- **Easy Updates**: Change `product.md` to update recommendations without touching code
- **Scalability**: Same architecture can work for any city by swapping context files

### Core Components
- **Context Parser**: Extracts structured data from markdown
- **Query Analyzer**: Understands local slang and intent
- **Recommendation Engine**: Matches user needs with local options
- **Response Generator**: Creates culturally-aware responses

## 🚀 How to Run

1. Clone this repository
2. Open `index.html` in a web browser
3. Start asking for food recommendations in local style!

### Sample Queries
- "Bhai shaam ko kuch teekha khana hai"
- "Subah halka nashta suggest karo"
- "Kumbh area ke paas best street food kya hai?"
- "Meetha kuch chahiye"

## 📁 Project Structure

```
├── .kiro/
│   └── product.md          # Local context and knowledge base
├── index.html              # Main web interface
├── styles.css              # UI styling
├── script.js               # Core logic and context processing
├── README.md               # This file
├── design.md               # Design decisions and architecture
└── requirements.md         # Technical requirements and specifications
```

## 🧠 How Kiro Accelerated Development

This project was built efficiently using Kiro as an AI development partner:

1. **Rapid Prototyping**: Kiro helped structure the project and create the initial architecture
2. **Context Design**: Collaborated on designing the `product.md` format for maximum flexibility
3. **Code Generation**: Generated clean, working code with proper separation of concerns
4. **Documentation**: Created comprehensive documentation explaining the approach

## 🎨 Design Philosophy

- **Local-First**: Every recommendation comes from local context, not generic data
- **Cultural Awareness**: Understands and responds using local language patterns
- **Time Sensitivity**: Recommendations change based on time of day
- **Practical Focus**: Includes actionable tips like timing, location, ordering advice

## 🔧 Technical Highlights

- **Pure JavaScript**: No external dependencies, runs entirely in browser
- **Async Context Loading**: Dynamically loads and parses context file
- **Flexible Parsing**: Robust markdown parsing that handles various formats
- **Responsive Design**: Works on desktop and mobile devices

## 🏆 Why This Wins

This project demonstrates:
- **True Local Understanding**: Not just translated generic content
- **Context-Driven AI**: Shows how to teach AI local nuances
- **Practical Application**: Solves real problems for locals and tourists
- **Scalable Architecture**: Can be adapted for any city or domain
- **Clean Implementation**: Well-structured, maintainable code

Built with ❤️ for the Kiro Hero Challenge Week 5