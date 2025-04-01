
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share2, Smile } from 'lucide-react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const {postId} = useParams()
  // For demo purposes, using hardcoded data
  const post = {
    _id: 'post1',
    title: 'First visit to the vet',
    content: 'Buddy had his first checkup today and everything looks great! The vet was impressed with how well-behaved he was during the examination. Got some new treats as a reward afterward.',
    createdAt: new Date('2023-06-10'),
    likes: 42,
    comments: [
      {
        id: 'c1',
        user: {
          id: 'user2',
          name: 'Sarah Johnson',
          avatar: null
        },
        text: 'He looks so happy! What a good boy!',
        createdAt: new Date('2023-06-10T14:30:00'),
        likes: 3
      },
      {
        id: 'c2',
        user: {
          id: 'user3',
          name: 'Mike Peterson',
          avatar: null
        },
        text: 'First vet visits can be stressful, glad it went well!',
        createdAt: new Date('2023-06-10T15:45:00'),
        likes: 1
      },
      {
        id: 'c3',
        user: {
          id: 'user4',
          name: 'Emma Wilson',
          avatar: null
        },
        text: 'What treats did you get? My cat loves the salmon ones from PetCare.',
        createdAt: new Date('2023-06-11T09:15:00'),
        likes: 2
      }
    ],
    user: {
      _id: '123',
      fullName: 'John Doe',
      profilePicture: {
        url: null,
      }
    },
    image: '/api/placeholder/800/600',
    pet: {
      _id: 'pet1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      profilePicture: null
    },
    location: 'PetCare Clinic',
    liked: false,
    saved: false
  };

  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.liked);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showLikes, setShowLikes] = useState(false);
  
  // Sample likers data
  const likers = [
    { id: 'user5', name: 'Alex Thompson', avatar: null },
    { id: 'user6', name: 'Jessica Miller', avatar: null },
    { id: 'user7', name: 'Ryan Davis', avatar: null },
    { id: 'user8', name: 'Katie Brown', avatar: null }
  ];

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // In a real app, you would send this to your backend
    console.log('Submitting comment:', newComment);
    
    // For demo, we'll just clear the input
    setNewComment('');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 5) {
      return `${diffInWeeks}w`;
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
          <img 
            src={post.image} 
            alt={post.title} 
            className="object-contain max-h-full w-full" 
          />
        </div>
        
        {/* Right side - Post details and comments */}
        <div className="w-full md:w-2/5 flex flex-col h-full border-l">
          {/* Header */}
          <div className="flex items-center p-4 border-b">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user.profilePicture?.url || ''} />
              <AvatarFallback className="bg-orange-400 text-white text-xs">
                {post.user.fullName?.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{post.user.fullName}</p>
              {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-gray-500">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Caption and comments section */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Caption */}
            <div className="flex mb-4">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={post.user.profilePicture?.url || ''} />
                <AvatarFallback className="bg-orange-400 text-white text-xs">
                  {post.user.fullName?.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm">
                  <span className="font-medium">{post.user.fullName}</span>{' '}
                  <span>{post.content}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            
            {/* Pet tag */}
            {post.pet && (
              <div className="mb-4 bg-orange-50 rounded-lg p-3 flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.pet.profilePicture || ''} />
                  <AvatarFallback className="bg-orange-300 text-white text-xs">
                    {post.pet.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{post.pet.name}</p>
                  <p className="text-xs text-gray-500">{post.pet.breed}</p>
                </div>
              </div>
            )}
            
            <Separator className="my-4" />
            
            {/* Comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex mb-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={comment.user.avatar || ''} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {comment.user.name?.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm">
                    <span className="font-medium">{comment.user.name}</span>{' '}
                    <span>{comment.text}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                    <button className="text-xs text-gray-500 hover:text-gray-900">
                      {comment.likes} likes
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-900">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Interaction bar */}
          <div className="px-4 py-2 border-t">
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isLiked ? "text-red-500" : "text-gray-700"}
                  onClick={handleLike}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <MessageCircle className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={isSaved ? "text-black" : "text-gray-700"}
                onClick={handleSave}
              >
                <Bookmark className={`h-6 w-6 ${isSaved ? "fill-black" : ""}`} />
              </Button>
            </div>
            
            {/* Likes */}
            <Dialog open={showLikes} onOpenChange={setShowLikes}>
              <DialogTrigger asChild>
                <button className="font-medium text-sm mb-1" onClick={() => setShowLikes(true)}>
                  {likeCount} likes
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <div className="py-2">
                  <h3 className="text-lg font-medium mb-4">Likes</h3>
                  {likers.map(user => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar || ''} />
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                            {user.name?.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{user.name}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <p className="text-xs text-gray-500 mb-3">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          
          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="flex items-center px-4 py-3 border-t">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Smile className="h-6 w-6" />
            </Button>
            <Input 
              type="text" 
              placeholder="Add a comment..." 
              className="border-0 shadow-none focus-visible:ring-0 flex-1 px-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className={`font-medium ${newComment.trim() ? 'text-orange-500' : 'text-orange-300'}`}
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;