import Suppliers from "../models/SupplierModel.js";
import { Op } from "sequelize";

// GET ALL
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Suppliers.findAll({
      attributes: ['id', 'uuid', 'name', 'phone', 'representative']
    });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET BY UUID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Suppliers.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
    if (!supplier) return res.status(404).json({ msg: "Proveedor no encontrado" });

    const response = await Suppliers.findOne({
      attributes: ['id', 'uuid', 'name', 'phone', 'representative'],
      where: {
        uuid: supplier.uuid
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// CREATE
export const createSupplier = async (req, res) => {
  const { name, phone, representative } = req.body;
  try {
    await Suppliers.create({
      name,
      phone,
      representative
    });
    res.status(201).json({ msg: "Proveedor agregado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Suppliers.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
    if (!supplier) return res.status(404).json({ msg: "Proveedor no encontrado" });

    const { name, phone, representative } = req.body;
    await Suppliers.update({ name, phone, representative }, {
      where: {
        uuid: supplier.uuid
      }
    });

    res.status(200).json({ msg: "Proveedor actualizado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Suppliers.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
    if (!supplier) return res.status(404).json({ msg: "Proveedor no encontrado" });

    await Suppliers.destroy({
      where: {
        uuid: supplier.uuid
      }
    });

    res.status(200).json({ msg: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
