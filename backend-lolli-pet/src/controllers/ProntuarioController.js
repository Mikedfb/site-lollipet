import Pet from '../models/Pet.js'
import Prontuario from '../models/Prontuario.js'
import ProntuarioArquivo from '../models/ProntuarioArquivo.js'

class ProntuarioController {
  // GET /prontuarios/:petId - Lista todos os prontuários de um pet
  async index(req, res) {
    try {
      const { petId } = req.params
      const pet = await Pet.findByPk(petId)
      if (!pet) return res.status(404).json({ errors: ['Pet não encontrado'] })

      const prontuarios = await Prontuario.findAll({
        where: { pet_id: petId },
        include: [
          {
            model: ProntuarioArquivo,
            as: 'arquivos',
            required: false
          }
        ],
        order: [['data', 'DESC']]
      })

      // Garante que arquivos sempre é um array
      const prontuariosFormatados = prontuarios.map(p => ({
        ...p.toJSON(),
        arquivos: p.arquivos || []
      }))

      return res.json(prontuariosFormatados)
    } catch (err) {
      return res.status(500).json({ errors: [err.message] })
    }
  }

  // POST /prontuarios/:petId - Cria novo prontuário
  async store(req, res) {
    try {
      const { petId } = req.params
      const pet = await Pet.findByPk(petId)
      if (!pet) return res.status(404).json({ errors: ['Pet não encontrado'] })

      const { data, tipo, descricao, responsavel } = req.body
      const prontuario = await Prontuario.create({
        pet_id: petId,
        data,
        tipo,
        descricao,
        responsavel
      })

      // Retorna com arquivos vazio
      return res.json({
        ...prontuario.toJSON(),
        arquivos: []
      })
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map(e => e.message) })
      return res.status(500).json({ errors: [err.message] })
    }
  }

  // PUT /prontuarios/:id - Atualiza um prontuário
  async update(req, res) {
    try {
      const { id } = req.params
      const prontuario = await Prontuario.findByPk(id, {
        include: [
          {
            model: ProntuarioArquivo,
            as: 'arquivos',
            required: false
          }
        ]
      })

      if (!prontuario) {
        return res.status(404).json({ errors: ['Prontuário não encontrado'] })
      }

      const { data, tipo, descricao, responsavel } = req.body
      await prontuario.update({ data, tipo, descricao, responsavel })

      // Retorna com arquivos
      return res.json({
        ...prontuario.toJSON(),
        arquivos: prontuario.arquivos || []
      })
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map(e => e.message) })
      return res.status(500).json({ errors: [err.message] })
    }
  }

  // DELETE /prontuarios/:id - Deleta um prontuário
  async delete(req, res) {
    try {
      const { id } = req.params
      const prontuario = await Prontuario.findByPk(id)

      if (!prontuario) {
        return res.status(404).json({ errors: ['Prontuário não encontrado'] })
      }

      await prontuario.destroy()
      return res.status(204).send()
    } catch (err) {
      return res.status(500).json({ errors: [err.message] })
    }
  }
}

export default new ProntuarioController()
