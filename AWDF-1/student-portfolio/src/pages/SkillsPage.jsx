import Skills from '../components/Skills'
import { portfolioData } from '../data'

export default function SkillsPage() {
  return (
    <Skills skillList={portfolioData.skillList} />
  )
}