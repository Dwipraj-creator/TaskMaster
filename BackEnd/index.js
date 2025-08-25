const express = require("express")
require("dotenv").config()
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db")
const userRouter = require("./routes/user.routes")
const taskRouter = require("./routes/task.routes")
const boardRouter = require("./routes/board.routes")
const collaborationRouter = require("./routes/colaboration.routes")
const CommentRouter = require("./routes/comment.routes")
app.use(express.json())
app.use(cors())
connectDB();

app.use("/api/auth",userRouter)
app.use("/api/tasks",taskRouter)
app.use("/api/boards",boardRouter)
app.use("/api/collaboration",collaborationRouter)
app.use("/api/comments",CommentRouter)

app.get("/api", (req, res) => {
    res.send("Hello World")
});

app.use((req,res) => {
    res.status(404).send("page not found" )
}); 


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});