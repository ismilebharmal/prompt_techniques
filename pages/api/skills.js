import { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  reorderSkills 
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method, query } = req
  const { id } = query

  try {
    switch (method) {
      case 'GET':
        const skills = await getSkills()
        res.status(200).json(skills)
        break

      case 'POST':
        const newSkill = await createSkill(req.body)
        res.status(201).json(newSkill)
        break

      case 'PUT':
        if (req.body.action === 'reorder') {
          await reorderSkills(req.body.skillOrders)
          res.status(200).json({ message: 'Skills reordered successfully' })
        } else {
          const updatedSkill = await updateSkill(id, req.body)
          res.status(200).json(updatedSkill)
        }
        break

      case 'DELETE':
        await deleteSkill(id)
        res.status(200).json({ message: 'Skill deleted successfully' })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
