import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Por favor inicia sesión" });
    }
    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error del servidor" });
    }
};