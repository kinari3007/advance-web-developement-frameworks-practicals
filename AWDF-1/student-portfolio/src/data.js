// Portfolio data
export const portfolioData = {
  name: "Kinari Thummar",
  
  bio: "Hi, I'm Kinari Thummar, a 3rd-year B.Tech AIML student with a strong enthusiasm for Artificial Intelligence, Machine Learning, and Data Science. I love building projects that turn ideas into real, working solutions and enjoy exploring product-based interactions that make technology more intuitive and user-friendly. I'm always eager to learn new tools and frameworks, and I thrive on the challenge of solving problems creatively through code.",
  
  skillList: [
    "Python",,"Data Visualization","Power BI","SupaBase",
    "Machine Learning", "Data Science", "Pandas", "NumPy", "Scikit-learn",
    "TensorFlow", "SQL", "MongoDB", "Git","Postgre SQL","C++","Java","C Programming","HTML","CSS","Streamlit"
  ],
  
  projectList: [
    {
      title: "Uber Analytics Dashboard",
      description: "End-to-end analytics project examining 148K+ rides using SQL and Power BI, uncovering revenue patterns, cancellation risks, and peak-hour trends across vehicle tiers. Delivered an interactive 5-tab dashboard with actionable business recommendations.",
      githubLink: "https://github.com/kinari3007/uber-operations-and-marketing-analytics",
      techStack: ["Python", "Pandas", "Power BI", "SQL", "MongoDB"]
    },
    {
      title: "LinkedIn Intelligence Tool",
      description: "A machine learning system that predicts LinkedIn post engagement using semantic analysis rather than text length, achieving strong accuracy with a Logistic Regression + TF-IDF model. Includes a Flask API and a LinkedIn-themed web interface for real-time predictions.",
      githubLink: "https://github.com/kinari3007/LinkedIn-Post-Intelligence-System", 
      techStack: ["Python", "NLP", "Scikit-learn", "FastAPI", "Jupyter Notebook"]
    },
    {
      title: "Kyphosis Detection System",
      description: "A full-stack ML web app that predicts kyphosis likelihood from clinical inputs using a Decision Tree classifier with ~82% accuracy. Built with FastAPI backend and a simple, explainable frontend for educational demonstration. Designed with clear disclaimers as an educational tool, not a substitute for professional medical diagnosis.",
      githubLink: "https://github.com/kinari3007/spinal-kyphosis-detector-using-machine-learning",
      techStack: ["Python", "Machine Learning", "Data Visualization", "FastAPI"]
    }
  ]
}