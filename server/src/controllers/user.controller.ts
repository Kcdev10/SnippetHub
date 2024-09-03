import { Request, Response } from 'express';
import User from '../models/user.model';
import { CustomRequest } from '../middleware/authenticate';

// export const getUserProfileController = asynchHandler(
//   async (req: any, res: Response, next: NextFunction) => {
//     let userId = '';
//     if (!req.query.userid) {
//       userId = req.user._id;
//     } else {
//       userId = req.query.userid;
//     }

//     const userPosts = await Post.aggregate([
//       {
//         $match: {
//           postuploadby: new mongoose.Types.ObjectId(req.user._id),
//         },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'postuploadby',
//           foreignField: '_id',
//           as: 'postuploadby',
//         },
//       },
//       {
//         $unwind: '$postuploadby',
//       },
//       {
//         $lookup: {
//           from: 'likes',
//           localField: '_id',
//           foreignField: 'likedpostid',
//           as: 'likes',
//         },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'likes.likedby',
//           foreignField: '_id',
//           as: 'likes',
//         },
//       },
//       {
//         $lookup: {
//           from: 'comments',
//           localField: '_id',
//           foreignField: 'commentpostid',
//           as: 'comments',
//         },
//       },
//       {
//         $unwind: {
//           path: '$comments',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'comments.commentby',
//           foreignField: '_id',
//           as: 'comments.commentby',
//         },
//       },
//       {
//         $unwind: {
//           path: '$comments.commentby',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $group: {
//           _id: '$_id',
//           description: { $first: '$description' },
//           image: { $first: '$image' },
//           createdAt: { $first: '$createdAt' },
//           updatedAt: { $first: '$updatedAt' },
//           postuploadby: { $first: '$postuploadby' },
//           likes: { $first: '$likes' },
//           likerDetails: { $first: '$likerDetails' },
//           comments: { $push: '$comments' },
//         },
//       },
//     ]).sort({ createdAt: -1 });

//     const userDetails = await User.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: 'friends',
//           localField: '_id',
//           foreignField: 'followby',
//           as: 'following',
//         },
//       },
//       {
//         $lookup: {
//           from: 'friends',
//           localField: '_id',
//           foreignField: 'followedto',
//           as: 'followers',
//         },
//       },
//       {
//         $group: {
//           _id: '$_id',
//           firstname: { $first: '$firstname' },
//           lastname: { $first: '$lastname' },
//           address: { $first: '$address' },
//           dob: { $first: '$dob' },
//           email: { $first: '$email' },
//           gender: { $first: '$gender' },
//           coverimage: { $first: '$coverimage' },
//           image: { $first: '$image' },
//           following: { $first: '$following' },
//           followers: { $first: '$followers' },
//         },
//       },
//     ]).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       user: {
//         ...userDetails[0],
//         userPosts,
//       },
//       message: 'fetch succesfully',
//     });
//   }
// );

// export const updateProfile = asynchHandler(async (req: any, res: Response) => {
//   if (!req.file) {
//     await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         ...req.body,
//         address: {
//           city: req.body.city,
//           state: req.body.state,
//         },
//       },
//       { new: true }
//     );
//   } else {
//     const domainname = req.headers.host;
//     const protocol = req.protocol;
//     const imgurl = `${protocol}://${domainname}/uploads/${req.file?.filename}`;

//     if (req.body.coverimage === 'coverimage') {
//       await User.findByIdAndUpdate(
//         req.user._id,
//         {
//           firstname: req.body.firstname,
//           lastname: req.body.lastname,
//           dob: req.body.dob,
//           address: {
//             city: req.body.city,
//             state: req.body.state,
//           },
//           coverimage: imgurl,
//         },
//         { new: true }
//       );
//     } else {
//       await User.findByIdAndUpdate(
//         req.user._id,
//         {
//           firstname: req.body.firstname,
//           lastname: req.body.lastname,
//           dob: req.body.dob,
//           address: {
//             city: req.body.city,
//             state: req.body.state,
//           },
//           image: imgurl,
//         },
//         { new: true }
//       );
//     }
//   }

//   res.json({ success: true, message: 'profile update successfully' });
// });

export const isAuthenticatedUser = (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    user: { ...(req as CustomRequest).user },
    message: 'user is authenticate',
  });
};

export const getAuthUser = async (req: Request, res: Response) => {
  try {
    const userDetails = await User.findById(
      (req as CustomRequest).user._id
    ).select('-password');
    res.json({ status: true, user: userDetails });
  } catch (error) {
    res.status(401).json({ status: false, message: error });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res
        .status(201)
        .json({ sucess: false, message: 'user already exist' });
    }

    await User.create({
      username,
      email,
      password,
    });

    return res
      .status(200)
      .json({ success: true, message: 'register successfull' });
  } catch (error) {
    return res.status(401).json({ success: false, message: `error ${error}` });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const isUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!isUser) {
      return res
        .status(404)
        .json({ success: false, message: 'user is not found' });
    }

    if (password) {
      const isMatch = await isUser.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'username and password is incorrect',
        });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'password is required' });
    }

    const accessToken = await isUser.generateToken();
    return res
      .status(200)
      .cookie('auth_user_access_token', accessToken, {
        path: '/',
      })
      .json({
        success: true,
        message: 'login successful',
        user: {
          accessToken,
          uuid: isUser._id,
        },
      });
  } catch (error) {
    if (error && error instanceof Error) res.json({ success: false, error });
  }
};

// export const logout = asynchHandler(async (req: Request, res: Response) => {
//   try {
//     if (req.isAuthenticated()) {
//       req.logOut((err) => {
//         if (err) return res.json({ status: false, message: err });
//         res.clearCookie('connect.sid', { path: '/' });
//         res.clearCookie('auth_user_access_token', { path: '/' });
//         return res
//           .status(200)
//           .json({ success: true, message: 'Logged out successfully' });
//       });
//     } else {
//       res.clearCookie('auth_user_access_token', { path: '/' });
//       return res
//         .status(200)
//         .json({ success: true, message: 'Logged out successfully' });
//     }
//   } catch (error) {
//     if (error) {
//       return res.status(401).json({ message: error, success: false });
//     }
//   }
// });
