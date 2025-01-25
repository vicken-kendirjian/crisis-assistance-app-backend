import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";
import { User } from "../models";

const activeUsers = new Map<string, string>(); // userId -> socket.id

export const setupSocketServer = (server: http.Server) => {
  const io = new Server(server); // No need to specify wsEngine
  console.log("Socket Ready.")
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);



    // Handle incoming events
    socket.on("registerUser", (userId: string) => {
        console.log(`Registering user: ${userId}`);
  
        // Save the userId and socket.id in the activeUsers map
        activeUsers.set(userId, socket.id);
  
        // Optionally, send a confirmation back to the client
        socket.emit("registrationSuccess", { message: "User registered successfully" });
  
        // Log the active users
        console.log(activeUsers);
    });



    socket.on("updateLocation", async (data: { userId: string, lat: number, lng: number }) => {
        const { userId, lat, lng } = data;
  
        try {
          // Update the user's location in the database
          await User.findByIdAndUpdate(userId, {
            $set: { "location.lat": lat, "location.lng": lng },
          });
  
          // Broadcast the location update to users in the connectedUsers array
          const user = await User.findById(userId);
          if (user && user.connectedUsers) {
            user.connectedUsers.forEach((connectedUserId) => {
              // For each connected user, emit the location update
              const targetSocketId = activeUsers.get(connectedUserId.toString());
              if (targetSocketId) {
                io.to(targetSocketId).emit("locationUpdate", { userId, lat, lng });
              }
            });
          }
  
          console.log(`User ${userId} updated location to ${lat}, ${lng}`);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      });


    // Handle disconnection
    socket.on("disconnect", () => {
        // Remove the user from the activeUsers map when they disconnect
        activeUsers.forEach((socketId, userId) => {
          if (socketId === socket.id) {
            activeUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
          }
        });
    });



  });

  return io;
};
