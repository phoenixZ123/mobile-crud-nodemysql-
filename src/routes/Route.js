import express from "express";
import db from "../controller/db.js";
import { create, create_laptop, destroy, edit, laptop_destroy, laptop_edit, laptop_specification, product, specifications, update, update_laptop, User } from "../controller/user.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.get('/', User);
router.get('/create', create);
router.get('/create_laptop', create_laptop);
router.get('/edit/:id', edit);
router.get('/laptop_edit/:id', laptop_edit);
router.post('/edit/:id', update);
router.post('/laptop_edit/:id', update_laptop);
router.get('/delete/:id', destroy);
router.get('/laptop_delete/:id', laptop_destroy);
router.get('/laptop_specifications', laptop_specification);
router.post('/create', (req, res) => {
    const uname = req.body.model;
    const price = req.body.price;
    const resolution = req.body.resolution;
    const camera = req.body.camera;
    const memory = req.body.memory;
    const display = req.body.display;
    const brand_name = req.body.brand;
    const brand_id = `SELECT brand_id FROM brand WHERE brand_name ='${brand_name}'`;
    const cateId = "select cate_id from category as c where category_name='Phone' ";
    //

    if (!req.files || !req.files.img) {
        return res.status(400).json({ error: 'Image file is required' });
    }
    const img = req.files.img;
    let { name, mv } = img;
    const img_path = `upload/${img.name}`;
    //
    console.log(price);
    //
    console.log(brand_name);

    db.query(cateId, (e, cid) => {
        db.query(brand_id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const brand = results[0].brand_id;
            const cate = cid[0].cate_id;
            if (!brand || brand.length === 0) {
                // Check if the result is undefined or empty
                return res.status(404).json({ error: 'Brand not found' });
            }
            if (!cate || cate.length === 0) {
                // Check if the result is undefined or empty
                return res.status(404).json({ error: 'Category not found' });
            }
            if (!brand || !cate || !uname || !memory || !resolution || !display || !camera || !price || !img_path) {
                // Check if any required fields are missing
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const phone_specification = `insert into phone_specification (brand_id,cate_id,model_name,memory,display_size,resolution,main_camera,price,image) values(${brand},${cate},'${uname}','${memory}','${display}','${resolution}','${camera}','${price}','${img_path}')`;

            db.query(phone_specification, (e, data, fields) => {
                if (!data) {
                    res.status(404).json({ error: 'Data not found' });
                }
                mv("D://UniProject/crud/src/assets/upload/" + name, (e) => {
                    if (e) throw e;
                    // res.send("successful");
                    res.redirect("specifications");
                });

                console.log(data);
            })
            // results[0].brand_id
        });
    })
});
router.post('/create_laptop', (req, res) => {
    const uname = req.body.model;
    const price = req.body.price;
    const memory = req.body.memory;
    const resolution = req.body.resolution;
    const display = req.body.display;
    const brand_name = req.body.brand;
    const processor = req.body.processor;
    const graphic = req.body.graphic;
    const brand_id = `SELECT brand_id FROM brand WHERE brand_name ='${brand_name}'`;
    const cateId = "select cate_id from category as c where category_name='Phone' ";
    //

    if (!req.files || !req.files.img) {
        return res.status(400).json({ error: 'Image file is required' });
    }
    const img = req.files.img;
    let { name, mv } = img;
    const img_path = `upload/${img.name}`;
    //
    console.log(price);
    //
    console.log(brand_name);

    db.query(cateId, (e, cid) => {
        db.query(brand_id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const brand = results[0].brand_id;
            const cate = cid[0].cate_id;
            if (!brand || brand.length === 0) {
                // Check if the result is undefined or empty
                return res.status(404).json({ error: 'Brand not found' });
            }
            if (!cate || cate.length === 0) {
                // Check if the result is undefined or empty
                return res.status(404).json({ error: 'Category not found' });
            }
            if (!req.body || !img_path) {
                // Check if any required fields are missing
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const laptop_specification = `insert into laptop_specification (brand_id,cate_id,model_name,processor,memory_storage,graphic_card,display_size,resolution,image,price) values(${brand},${cate},'${uname}','${processor}','${memory}','${graphic}','${display}','${resolution}','${img_path}',${price})`;

            db.query(laptop_specification, (e, data, fields) => {
                if (!data) {
                    res.status(404).json({ error: 'Data not found' });
                }
                mv("D://UniProject/crud/src/assets/upload/" + name, (e) => {
                    if (e) throw e;
                    res.redirect("/laptop_specifications");
                });

                console.log(data);
            })
            // results[0].brand_id
        });
    })
});
router.get('/specifications', specifications);
// router.post('/', (req, res) => {
//     if (Object.keys(req.files).length < 1) {
//         res.send("choose file first");
//     }
//     const uname = req.body.name;

//     const img = req.files.image;
//     let { name, mv } = img;

//     const img_path = `upload/${img.name}`;

//     const sql = `insert into test values('${uname}','${img_path}')`;
//     db.query(sql, (e, data, fields) => {
//         mv("D://UniProject/crud/src/assets/upload/" + name, (e) => {
//             if (e) throw e;
//             res.send("uploaded successful");
//         });
//     })
//     //mv is to store folder name,(e)=> is show error

//     // res.render('index', req.body);
//     // console.log(img.name);
// })



export default router;
