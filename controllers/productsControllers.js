const productModel = require("../models/productModel");
const ProductModel = require("../models/productModel");
mconst formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

class productControllers {
  add_product = async (req, res) => {
    const form = formidable({ multiples: true });
    const { id } = req;

    form.parse(req, async (err, field, files) => {
      if (err) responseReturn(res, 404, { message: "error" });
      else {
        let {
          description,
          price,
          stock,
          discount,
          brand,
          shopName,
          name,
          category,
        } = field;

        const { images } = files;
        name = name.trim();
        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });
        try {
          let allImageUrl = [];
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(
              images[i].filepath,
              {
                folder: "products",
              },
            );
            allImageUrl = [...allImageUrl, result.url];
          }
          const product = await productModel.create({
            sellerId: id,
            name,
            shopName,
            slug,
            brand: brand.trim(),
            images: allImageUrl,
            category: category.trim(),
            stock: parseInt(stock),
            price: parseInt(price),
            discount: parseInt(discount),
            description: description.trim(),
          });
          responseReturn(res, 201, {
            product,
            message: "Product Adedd SuccussFully",
          });
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };

  get_products = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    console.log("req.id ==>", id) ;
      console.log("=== req.id ==>", req.id, "| type:", typeof req.id);


    

    try {
      if (searchValue) {

        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProducts = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId : id
          })
          .countDocuments();

        responseReturn(res, 200, { products, totalProducts });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProducts = await productModel.find({sellerId : id}).countDocuments();
        responseReturn(res, 200, { products, totalProducts });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new productControllers();
