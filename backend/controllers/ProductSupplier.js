import ProductSupplier from "../models/ProductSupplierModel.js";
import { Op } from "sequelize";

// Funcion para eliminar producto-proveedor
export const deleteProductSupplier = async (req, res) => {
  try {
    const supplier = await ProductSupplier.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
    if (!supplier) return res.status(404).json({ msg: "Proveedor-producto no encontrado" });

    await ProductSupplier.destroy({
      where: {
        uuid: supplier.uuid
      }
    });

    res.status(200).json({ msg: "Proveedor-producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Funcion para editar precio y dias de entregas de producto-proveedor
export const updateProductSupplier = async (req, res) => {
  try {
    const supplier = await ProductSupplier.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
    if (!supplier) return res.status(404).json({ msg: "Proveedor-producto no encontrado" });

    const { price, delivery_time } = req.body;
    await ProductSupplier.update({ price, delivery_time }, {
      where: {
        uuid: supplier.uuid
      }
    });

    res.status(200).json({ msg: "Proveedor-producto actualizado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};