import { Server } from 'socket.io'

let io

export const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
      allowedHeaders: ['your-custom-header'],
      credentials: true,
    },
  })
  return io 
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}



// export default {
//   init: (httpServer) => {
//     io = new Server(createServer(httpServer), {
//       cors: {
//         origin: '*', // Adjust this to your client origin
//         methods: ['GET', 'POST'],
//         allowedHeaders: ['your-custom-header'],
//         credentials: true,
//       },
//     })
//     return io
//   },
// }
