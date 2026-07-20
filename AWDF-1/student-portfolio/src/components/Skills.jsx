export default function Skills({ skillList }) {
  // Group skills into categories for better visual organization
  const skillCategories = [
    {
      title: "Languages & Frameworks",
      skills: skillList.filter(skill => 
        ['Python', 'Java','C++','HTML','CSS','C Programming'].includes(skill)
      )
    },
    {
      title: "AI & Machine Learning", 
      skills: skillList.filter(skill =>
        ['Machine Learning', 'Data Science','Scikit-learn'].includes(skill)
      )
    },
    {
      title: "Data & Analytics",
      skills: skillList.filter(skill =>
        ['Pandas', 'NumPy', 'SQL', 'MongoDB','Postgre SQL','SupaBase'].includes(skill)
      )
    },
    {
      title: "Tools & Platform",
      skills: skillList.filter(skill =>
        ['Git', 'Power BI', 'Streamlit'].includes(skill)
      )
    }
  ]

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="card">
          <span className="section-label">Technical Skills</span>
          <h2 className="section-title">Technologies & Tools</h2>
          
          <div className="skills-content">
            {skillCategories.map((category, index) => (
              category.skills.length > 0 && (
                <div key={index} className="skills-category">
                  <h3 className="category-title">{category.title}</h3>
                  <div className="skills-list">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}