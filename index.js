const app=require("express")();
const server=require("http").createServer(app);
const cors=require("cors");

const io=require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

app.use(cors());
const PORT=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('Server is running!');
});
io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit('call ended');
    });
    socket.on('calluser',({userToCall,signalData,name,from})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,name,from});

    });
    socket.on('answercall',(data)=>{
        io.to(data.to).emit('callaccepted',data.signal);
    });
});
server.listen(PORT,()=>console.log('Server is listening on '+PORT));
