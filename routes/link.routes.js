const{Router}=require('express');
const Link = require('../models/Link');
const shortid=require('shortid');
const auth=require('../middleware/auth.middleware');
const config=require('config');

const router = Router();

router.post("/generate",auth,async (req,resp)=>{
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;

        const code = shortid.generate();

        const existing=await Link.findOne({from});

        if(existing){
            return resp.json({link:existing});
        }

        const to = baseUrl + '/t/'+code;

        const  link = new Link({
            code,to,from,owner:req.user.userId
        });

        await link.save();

        resp.status(201).json({link});

    } catch (e) {
        resp.status(500).json({message: 'Что-то пошло не так попробуйте снова'});
    }
});

router.get("/",auth,async (req,resp)=>{
    try {
        const links = await Link.find({owner:req.user.userId});
        resp.json(links);
    } catch (e) {
        resp.status(500).json({message: 'Что-то пошло не так попробуйте снова'})
    }
});

router.get("/:id",auth,async (req,resp)=>{
    try {
        const link = await Link.findById(req.params.id);
        resp.json(link);
    } catch (e) {
        resp.status(500).json({message: 'Что-то пошло не так попробуйте снова'})
    }
});

module.exports = router