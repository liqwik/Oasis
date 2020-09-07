import * as Yup from 'yup';
import Company from '../models/Company';
import Representative from '../models/Representative';

class AddressController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      email: Yup.string().email().required(),
      phone_number: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada' });
    }

    const representative = await Representative.findOne({
      where: { company_id: req.companyId },
    });

    if (representative) {
      const {
        id,
        name,
        email,
        cpf,
        phone_number,
      } = await representative.update(req.body);

      return res.json({
        id,
        name,
        email,
        cpf,
        phone_number,
      });
    }

    const { id, name, email, cpf, phone_number } = await Representative.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      name,
      email,
      cpf,
      phone_number,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      cpf: Yup.string(),
      email: Yup.string().email(),
      phone_number: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json({ error: 'Empresa não existe.' });
    }

    const representative = await Representative.findOne({
      where: { company_id: req.companyId },
    });

    if (!representative) {
      return res
        .status(400)
        .json({ error: 'Representante legal não registrado.' });
    }

    const { id, name, email, cpf, phone_number } = await representative.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      cpf,
      phone_number,
    });
  }
}

export default new AddressController();
