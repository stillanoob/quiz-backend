const route = require("express").Router()
const employeeController = require("../controllers/employeeController");

route.post("/register",employeeController.signup);
route.post("/login",employeeController.login);
route.post("/update",employeeController.updateInfo);
route.get("/getEmployee/:id",employeeController.getEmployee);
route.get("/getAll",employeeController.getEmployees);
route.delete("/delete/:id",employeeController.deleteEmployee);
module.exports = route;