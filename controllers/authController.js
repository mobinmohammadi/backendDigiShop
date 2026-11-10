const { default: mongoose } = require("mongoose");
const userModel = require("../model/userModel");
const { responseReturn } = require("../utils/responseReturn");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/tokeCreate");

class authController {
  user_Register = async (req, res) => {
    const { email, fullName, password, phone } = req.body;

    try {
      const getuser = await userModel.findOne({ email });
      if (getuser)
        responseReturn(res, 404, {
          error: "این کاربر قبلا ثبت نام کرده است",
        });
      else {
        const user = await userModel.create({
          fullName,
          email,
          password: await bcrypt.hash(password, 10),
          phone: phone
          method: "manualy",
        });

        const token = await createToken({
          email: user.email,
          fullName: user.fullName,
          phone : user.phone,
          status : user.status,
        });
        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, {
          user,
          token,
          message: "کاربر گرامی خوش آمدید",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "خطای داخلی سرور" });
    }
  };

  user_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const foundUser = await userModel.findOne({ email }).select("+password");
      if (!foundUser)
        responseReturn(res, 404, { error: "کاربری با این ایمیل یافت نشد" });
      else {
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
          console.log("foundUser ====" , foundUser);
          
          const token = await createToken({
            email: foundUser.email,
            fullName: foundUser.fullName,
            status: foundUser.status,
            image: foundUser.image,
            phone: foundUser.phone,
          });
          res.cookie("customerToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, {
            foundUser,
            token,
            message: "خوش آمدید سرورم",
          });
        } else {
          responseReturn(res, 401, { error: "رمز عبور نامعتبر" });
        }
      }
    } catch (error) {
      responseReturn(res, 404, { message: "کاربری با این ایمیل یافت نشد" });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;
    console.log(id);
    console.log(role);

    try {
      if (role === "user") {
        const user = await userModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      }
    } catch (error) {
      responseReturn(res, 500, { erorr: "Internal Server Error 😣 " });
    }
  };
}

module.exports = new authController();
