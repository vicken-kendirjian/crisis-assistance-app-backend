import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models';


export const searchUser = async (req: Request, res: Response) => {

    const phone = req.query;
    console.log("HI FROM SC");
    try{
        const user = await User.findOne(phone);

        if(!user) return res.status(404).json({msg: "User not found"})
        
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            bloodType: user.bloodType
        })
    }catch(err){
        return res.status(500).json({msg: 'Server error'})
    }
}


export const sendConnectionRequest = async (req: Request, res: Response) => {
    const {targetPhone} = req.body;
    const userId = req.userId;//sender

    try{
        const targetUser = await User.findOne({phone: targetPhone});//receiver
        if(!targetUser){
            return res.status(404).json({msg: "Target user not found"})
        }

        const alreadySent = targetUser.connections.find( c=> {
          return String(c.senderId) === String(userId) && c.status === 'pending';
        })
        if(alreadySent){
          return res.status(500).json({msg: 'You already sent a connection request to this user'})
        }

        console.log("User found")
        const senderUser = await User.findById(userId);
        if(!senderUser){
            return res.status(404).json({ msg: "Sender user not found"});
        }
        if(senderUser.connectedUsers.includes(targetUser._id)){
          return res.status(500).json({msg: "You are already connected with this user."})
        }
        if(targetPhone===senderUser.phone){
          return res.status(500).json({msg: "You cannot send a request to yourself."})
        }
        console.log("Sender User found")
        targetUser.connections.push({ 
            senderId: senderUser._id,
            status: 'pending',
            senderPhone: senderUser.phone

        })
        console.log("connection object created and pushed")
        await targetUser.save();
        return res.status(200).json({msg: "Connection request sent"})
    }catch(err){
      return res.status(500).json({msg: 'Server error'})
    }
}


export const handleConnectionRequest = async (req: Request, res: Response) => {
    const {targetUserId, action } = req.body; // userId of the receiver and targetUserId of the sender
    const userId = req.userId;
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ msg: 'Invalid action' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: ' Receiver User not found' });
      }
      console.log("User found")

      // Find the connection request
      const connection = user.connections.find(c => {
        return String(c.senderId) === String(targetUserId);
      });
      
      if (!connection) {
        return res.status(404).json({ msg: 'Connection request not found' });
      }
      if (connection.status!=='pending'){
        return res.status(500).json({msg: 'Server error'})
      }
  
      // Update connection status

      if(action=='reject'){
        connection.status = 'rejected'
        await user.save()
        return res.status(200).json({ msg: `Connection request ${action}ed` });
      }
      else if(action=='accept'){
        connection.status = 'accepted'
        await user.save()

        console.log("Now saving the connection for Chris");
        const targetUser = await User.findById(targetUserId);
      
        if(!targetUser) return res.status(404).json({msg: "Target User not found"});

        targetUser.connections.push({ 
          senderId: user._id,
          status: 'accepted',
          senderPhone: user.phone
        })
        targetUser.connectedUsers.push(String(userId));
        user.connectedUsers.push(String(targetUserId))
        await user.save()
        await targetUser.save()
  
        return res.status(200).json({ msg: `Connection request ${action}ed` });
      }
      // connection.status = action === 'accept' ? 'accepted' : 'rejected';
      // await user.save();

      
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: 'Server error' });
    }
};


export const getUserConnections = async (req: Request, res: Response) => {
    const userId = req.userId; 
  
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Filter connections based on their status
      const acceptedConnections = user.connections.filter(c => c.status === 'accepted');
      const rejectedConnections = user.connections.filter(c => c.status === 'rejected');
      const pendingConnections = user.connections.filter(c => c.status === 'pending');
  
      // Send the response back to the client
      return res.status(200).json({
        accepted: acceptedConnections,
        rejected: rejectedConnections,
        pending: pendingConnections
      });
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
};