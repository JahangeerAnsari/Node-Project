
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user")
const fs = require("fs");
const Post = require("../models/post")
const dateFormat = require("dateformat");
//  get methods
exports.postForm =  (req,res) => {
    res.render("createPost",{headingTitle:"Create New Post",login: true , errors:[],
        title:'', body:''})

    }
 exports.posts =  async  (req,res ) =>{
    //  lets fetched all post
     const id = req.id;
     let currentPage = 1;
     let page = req.params.page;
     if(page){
         currentPage = page;
     }
     const perPage = 4;
     const skip = (currentPage - 1) * perPage;
       
    //  -1 decending order 
     const allPosts = await Post.find({userId: id})
     .skip(skip)
     .limit(perPage)
     .sort({updatedAt: -1});

     const count = await Post.find({userId: id}).countDocuments();

    res.render("posts",{headingTitle:"Posts Page",
    login: true ,posts:allPosts,
    formate:dateFormat,count, perPage, currentPage})

}
exports.savePost = (req, res) =>{
   const form = formidable();
   form.parse(req, (err,fields, files) =>{
     const errors = [];
     const {title, body} = fields;

     if(title.length  === 0){
        errors.push({msg:"title is required"})
     }
     if(body.length  === 0){
        errors.push({msg:"body is required"})
     }
    const  imageName = files.image.name;
    const split = imageName.split(".");
    const imageExt = split[split.length - 1].toUpperCase();
    // console.log(imageExt);
    if(files.image.name.length === 0){
        errors.push({msg:"Image is required"})
     }else if(imageExt !== "JPEG" && imageExt !== "PNG"){
        errors.push({ msg: "Only JPG and PNG are allowed"})
    }
  
  if(errors.length !== 0){
      res.render("createPost",{headingTitle:"Create New Post", login:true,errors, title,body})
  }else{
    //   res.send(files.image.path)
    files.image.name = uuidv4() + "." + imageExt;
    const oldImagePath =  files.image.path;
    const newImagePath = __dirname + "/../views/assets/img/" + files.image.name
  fs.readFile(oldImagePath,(error,data) =>{
      if(!err){
          fs.writeFile(newImagePath, data,(err) =>{
              if(!err){
                  fs.unlink(oldImagePath, async (err) =>{
                      if(!err){
                        //  req.id = we have user id in req.id of logged user
                        const id = req.id;
                        try {
                              const user = await User.findOne({ _id: id});
                            
                              const name = user.name;
                            //   console.log("user ==>",user.name)
                                const newPost  = new Post({
                                    userId: id,
                                    title,
                                    body,
                                    image: files.image.name,
                                    userName: name
                                })
                                try {
                                    const result = newPost.save();
                                    if(result){ 
                                  req.flash('success', 'New Post has been Added');
                                  res.redirect('/posts/1');
                                    }
                                } catch (err) {
                                    console.log(err.msg)
                                }
                        } catch (err) {
                            console.log(err.msg)
                        }
                      }
                  })
              }
          })
      }
  })
    
}

   })
}


