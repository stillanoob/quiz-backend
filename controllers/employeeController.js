const mongoose = require("mongoose");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getEmployees=function(req,res){
    userModel.find({isadmin:false}).exec()
    .then( employees=>{
        if(employees.length>0){
            return res.status(200).json(employees);
        }else{
            return res.status(404).json({message:"there is no employees"})
        }    
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}

exports.deleteEmployee=function(req,res){
    userModel.findByIdAndDelete(req.params.id,(err,result)=>{
        if(result){
            return res.status(200).json({message:'employee deleted'});
        }
        
        if(err){
            return res.status(500).json(err);
        }

        else {
            return res.status(404).json({message:'employee not found '});
        }
        

    })
}

exports.getEmployee=function(req,res){
    userModel.findById(req.params.id).exec()
    .then(employee=>{
        if(employee){
            return res.status(200).json(employee);
        }
        else {
            return res.status(404).json({message:'employee not found'})
        }
    })
    .catch(err=>{
        return res.status(404).json(err);
    })
    
    }
    
    exports.updateInfo = function(req, res) {
        userModel.findById(req.params.id)
            .exec()
            .then(async employee => {
                if (employee) {
                    if(req.body.motdepasse){
                     const  encrypted = await  bcrypt.hash(req.body.motdepasse, 10);
                     employee.motdepasse=encrypted;
                }
    
                if(req.file.path){
                    console.log(req.file.path);
                }
    
    
                Object.keys(req.body).forEach(element=>{
                    if(element.toString() !== "motdepasse"){
                        employee[element]=req.body[element]
                    }
                })
                
                employee.save().then(result=>{
                    if(result){
                        return res.status(200).json({message:'update done ',employee})
                       }
                       else {
                           return res.status(400).json({message:'update failed'});
                       }
                }).catch(err=>{
                    return res.status(500).json(err);
                })
            }
            else {
                return res.status(404).json({message:'employee not found'});
    
            }
        })    
    
            
            .catch(err => {
                return res.status(500).json(err)
            })
    }
    
    
    
    
    exports.login = function (req,res){
        userModel.findOne({ email: req.body.email })
            .exec()
            .then( async  employee => {
                    
                if (employee) {
                    bcrypt.compare(req.body.motdepasse, employee.motdepasse,  (err, same) => {
                        if (err) {
                            return new Error("comparing failed");
                        }
                        if (same) {
                            const token = jwt.sign({employee_id: employee._id}, "Secret", { expiresIn: 60 * 60 * 60 })
                            return res.status(200).json({ message: 'login successfully', token });
                        } 
                        else
                        {
                            return res.status(401).json({ message: 'mot de passe incorrect' });
                        }
    
                    })
                }  
                else {
                    return res.send("email incorrect")
                } 
            })
            .catch(err => {
                return res.staus(500).json(err);
            });
    }
    
    
    exports.signup =function (req,res){
        console.log(req.body)
        userModel.findOne({ email: req.body.email })
        .exec()
        .then(employee => {
        
            if (employee) {
                return res.status(401).json({ message: 'email exists try another one' });
            } else {
                bcrypt.hash(req.body.motdepasse, 10, (err, encrypted) => {
                    if (err) {
                        return new Error("crypting error");
                    }
                    if (encrypted) {
                        const employee = new userModel({
                            _id: new mongoose.Types.ObjectId(),
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            motdepasse: encrypted,
                            email: req.body.email,
                            datenaissance:req.body.datenaissance,
                            isadmin:false
                        })
                        employee.save().then(
                            employee => {return res.status(201).json(employee)}
                        ).catch(err => {
                                return res.status(500).json(err);
                            })
                    }
                })
            }
        })
        .catch(err => {
            return res.status(500).json(err);
    
        })
    
    }
    
    