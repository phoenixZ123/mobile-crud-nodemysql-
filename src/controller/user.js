
import mysql from 'mysql';
import db from './db.js';
export const User = (req, res) => {
    let sql = "insert into user (name) values ?";
    const data = [
        ["sam"],
        ["john"],
        ["roman"]
    ]
    //insert data
    // db.query(sql, [data], (e, d) => {
    //     // console.log("inserted" + d);
    //     res.render('index', { user: d });
    // })
    //show data
    // db.query("select * from brand", (e, data, fields) => {
    //     res.render('index', { brand: data });

    // });
    const sqlPhone = "select brand_name from category as c,phone_specification as p,brand  where c.cate_id=p.cate_id and p.brand_id=brand.brand_id group by brand_name";
    const sqlLaptop = "select brand_name from category as c,laptop_specification as l,brand  where c.cate_id=l.cate_id and l.brand_id=brand.brand_id group by brand_name"
    db.query(sqlPhone, (e, data, fields) => {
        db.query(sqlLaptop, (e, laptop) => {
            res.render('index', { data, laptop })

        })
    })
    console.log("connected");


}
export const Category = (req, res) => {
    res.render('category');
}
export const Detail = (req, res) => {
    db.query('SELECT category_name FROM category, brand WHERE brand.brand_id = category.brand_id', (e, data, fields) => {
        if (e) {
            console.error('Database query error:', e);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('detail', { name: data });
    });


}
export const product = (req, res) => {

    const sql = `select model_name,price from phone_scification where cate_id=1`;
    db.query(sql, (e, data) => {
        if (e) {
            console.error("Error fetching model data:", e);
            return res.status(500).send("Database query failed");
        }
        res.render('phone', { data });

    })


}
export const edit = (req, res) => {
    const id = req.params.id;
    const sql = "select spec_id,brand_id,model_name,memory,display_size,resolution,main_camera,price,image from phone_specification where spec_id=" + id;
    db.query(sql, (e, edata) => {
        if (e) throw e;
        db.query("select brand_name from brand where brand_id=" + edata[0].brand_id, (e, data, fields) => {
            res.render('edit', { data: edata[0], brand: data });
        });
    })

}
export const laptop_edit = (req, res) => {
    const id = req.params.id;
    const sql = "select spec_id,brand_id,model_name,processor,memory_storage,graphic_card,display_size,resolution,price,image from laptop_specification where spec_id=" + id;
    db.query(sql, (e, edata) => {
        if (e) throw e;
        db.query("select brand_name from brand where brand_id=" + edata[0].brand_id, (e, data) => {
            res.render('laptop_edit', { data: edata[0], brand: data });
        });
    })
}
export const update = (req, res) => {
    const { id } = req.params;
    const sql = "select * from phone_specification where spec_id=" + id;
    db.query(sql, (e, data) => {
        if (e) throw e;
        var dbData = data[0];
        var image;
        var brandid;
        var cateid;
        if (!req.files || Object.keys(req.files).length == 0) {
            image = dbData.image;

        } else {
            if (!req.files.img || !req.files) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            const img = req.files.img;
            image = 'upload/' + img.name;
            if (!image) {
                return res.status(400).json({ error: 'Missing required image fields' });

            }
            img.mv("D://UniProject/crud/src/assets/" + image, (e) => {
                if (e) throw e;
            });
        }
        brandid = dbData.brand_id;
        cateid = dbData.cate_id;
        const { model, memory, display, resolution, camera, price } = req.body;
        if (!brandid || !cateid || !model || !memory || !display || !memory || !resolution || !camera || !price || !image) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const update = `update phone_specification set brand_id=${brandid},cate_id=${cateid},model_name='${model}',memory='${memory}',display_size='${display}',resolution='${resolution}',main_camera='${camera}',price=${price},image='${image}' where spec_id=` + id;
        db.query(update, (e) => {
            if (e) throw e;
            res.redirect("/specifications");
        })
    })

}
export const destroy = (req, res) => {
    const id = req.params.id;
    const sql = "delete from phone_specification where spec_id=" + id;
    db.query(sql, (e) => {
        if (e) throw e;
        return res.redirect('/specifications');
    })
}
export const laptop_destroy=(req,res)=>{
    const id = req.params.id;
    const sql = "delete from laptop_specification where spec_id=" + id;
    db.query(sql, (e) => {
        if (e) throw e;
        return res.redirect('/laptop_specifications');
    })
}
export const create = (req, res) => {
    db.query("select * from brand", (e, data, fields) => {
        res.render('create', { brand: data });

    });
}
export const create_laptop = (req, res) => {
    db.query("select * from brand", (e, data, fields) => {
        res.render('create_laptop', { brand: data });

    });
}
export const store = (req, res) => {
    const uname = req.body.model;
    const price = req.body.price;
    const date = req.body.date;
    const resolution = req.body.resolution;
    const camera = req.body.camera;
    const memory = req.body.memory;
    const display = req.body.display;

    const brand_name = req.body.brand;
    const brand_id = `SELECT brand_id FROM brand WHERE brand_name ='${brand_name}'`;
    const cateId = "select cate_id from category as c where category_name='Phone' ";
    //

    const img = req.files.image;
    console.log(img);
    let { name, mv } = img;

    const img_path = `upload/${req.file.filename}`;

    //
    console.log(brand_name);
    db.query(cateId, (e, cid, fields) => {
        db.query(brand_id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const brand_id = results[0].brand_id;
            const cate_id = cid[0].cate_id;
            const phone_specification = `insert into phone_specification values(${brand_id},${cate_id},'${uname}','${date}','${memory}','${resolution}','${display}','${camera}','${img_path}',${price})`;
            db.query(phone_specification, (e, data, fields) => {
                if (e) throw e;
                if (Object.keys(req.files).length < 1) {
                    res.send("choose file first");
                }
                mv("D://UniProject/crud/src/assets/upload/" + name, (e) => {
                    if (e) throw e;
                    res.send("uploaded successful");
                });
            })
            // results[0].brand_id
        });

    })

}

export const specifications = (req, res) => {
    const spec = 'select spec_id,brand_id,model_name,price,memory,resolution,display_size,main_camera,price,image from phone_specification as ps,category as c where ps.cate_id=c.cate_id order by brand_id';
    db.query(spec, (e, data) => {
        res.render('specifications', { data });
    })
}
export const laptop_specification = (req, res) => {
    const lspec = 'select * from laptop_specification as ls,category as c where ls.cate_id=c.cate_id order by brand_id';
    db.query(lspec, (e, laptop) => {
        res.render('laptop_specifications', { laptop });
        console.log(laptop);
    })
}
export const update_laptop = (req, res) => {
    const { id } = req.params;
    const sql = "select * from laptop_specification where spec_id=" + id;
    db.query(sql, (e, data) => {
        if (e) throw e;
        var dbData = data[0];
        var image;
        var brandid;
        var cateid;
        if (!req.files || Object.keys(req.files).length == 0) {
            image = dbData.image;

        } else {
            if (!req.files.img || !req.files) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            const img = req.files.img;
            image = 'upload/' + img.name;
            if (!image) {
                return res.status(400).json({ error: 'Missing required image fields' });

            }
            img.mv("D://UniProject/crud/src/assets/" + image, (e) => {
                if (e) throw e;
            });
        }
        brandid = dbData.brand_id;
        cateid = dbData.cate_id;
        const { model, processor, memory, graphic, display, resolution, price } = req.body;
        if (!req.body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const update = `update laptop_specification set brand_id=${brandid},cate_id=${cateid},model_name='${model}',processor='${processor}',memory_storage='${memory}',graphic_card='${graphic}',display_size='${display}',resolution='${resolution}',image='${image}',price=${price} where spec_id=` + id;
        db.query(update, (e) => {
            if (e) throw e;
            res.redirect("/laptop_specifications");
        })
    })

}